// client/src/api.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_PUBG_API_KEY;
const pubgApi = axios.create({
  baseURL: 'https://api.pubg.com/shards/steam',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/vnd.api+json',
  },
});

// Rate limiting
const MAX_CALLS_PER_MINUTE = 10;
const calls = [];

const rateLimiter = async () => {
  const now = Date.now();
  calls.push(now);

  // Remove calls older than 1 minute
  const minuteAgo = now - 60000;
  const recentCalls = calls.filter(call => call > minuteAgo);
  calls.length = 0;
  calls.push(...recentCalls);

  if (calls.length > MAX_CALLS_PER_MINUTE) {
    const oldestCall = calls[0];
    const waitTime = 60000 - (now - oldestCall);
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

let CURRENT_SEASON_ID = '';

const fetchCurrentSeason = async () => {
  try {
    await rateLimiter();
    const response = await pubgApi.get('/seasons');
    const seasons = response.data.data;
    const currentSeason = seasons.find(s => s.attributes.isCurrentSeason && s.id.startsWith('division.bro.official.'));
    
    if (currentSeason) {
      CURRENT_SEASON_ID = currentSeason.id;
      console.log(`Successfully set current season ID: ${CURRENT_SEASON_ID}`);
    } else {
      console.error('CRITICAL: Could not find the current official season from the global list!');
    }
  } catch (error) {
    console.error('CRITICAL: Failed to fetch seasons from PUBG API.', error.message);
  }
};

const calculateSummaryStats = (gameModeStats) => {
  const summary = {
    kills: 0,
    deaths: 0,
    wins: 0,
    losses: 0,
    damageDealt: 0,
    roundsPlayed: 0,
    assists: 0,
    maxKillStreaks: 0,
    longestKill: 0,
  };

  for (const mode in gameModeStats) {
    if (gameModeStats.hasOwnProperty(mode)) {
      const stats = gameModeStats[mode];
      summary.kills += stats.kills || 0;
      summary.deaths += stats.deaths || 0;
      summary.wins += stats.wins || 0;
      summary.losses += stats.losses || 0;
      summary.damageDealt += stats.damageDealt || 0;
      summary.roundsPlayed += stats.roundsPlayed || 0;
      summary.assists += stats.assists || 0;
      if ((stats.maxKillStreaks || 0) > summary.maxKillStreaks) {
        summary.maxKillStreaks = stats.maxKillStreaks;
      }
      if ((stats.longestKill || 0) > summary.longestKill) {
        summary.longestKill = stats.longestKill;
      }
    }
  }

  summary.kd = summary.deaths > 0 ? summary.kills / summary.deaths : summary.kills;
  summary.adr = summary.roundsPlayed > 0 ? summary.damageDealt / summary.roundsPlayed : 0;
  summary.kpr = summary.roundsPlayed > 0 ? summary.kills / summary.roundsPlayed : 0;

  return summary;
};

export const fetchPlayerStats = async (playerNames) => {
  if (!CURRENT_SEASON_ID) {
    await fetchCurrentSeason();
  }

  if (!CURRENT_SEASON_ID) {
    throw new Error('Server has not determined the current season. Please check server logs.');
  }

  await rateLimiter();
  const response = await pubgApi.get(`/players?filter[playerNames]=${playerNames.join(',')}`);
  const players = response.data.data;

  const playersWithSummaryStats = [];
  for (const player of players) {
    const seasonId = CURRENT_SEASON_ID;
    
    await rateLimiter();
    const seasonRes = await pubgApi.get(`/players/${player.id}/seasons/${seasonId}`)
      .catch(error => {
        if (error.response && error.response.status === 404) {
          return { data: { data: { attributes: { gameModeStats: {} } } } };
        }
        throw error;
      });

    const summaryStats = calculateSummaryStats(seasonRes.data.data.attributes.gameModeStats);
    playersWithSummaryStats.push({
      ...player.attributes,
      id: player.id,
      summaryStats,
    });
  }

  return playersWithSummaryStats;
};
