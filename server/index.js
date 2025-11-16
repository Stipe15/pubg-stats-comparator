// server/index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PUBG API Configuration
const pubgApi = axios.create({
  baseURL: 'https://api.pubg.com/shards/steam',
  headers: {
    'Authorization': `Bearer ${process.env.PUBG_API_KEY}`,
    'Accept': 'application/vnd.api+json',
  },
});

// --- NEW: Global variable to hold the current season ID ---
let CURRENT_SEASON_ID = '';

// --- NEW: Function to fetch and set the current season ID on server start ---
const fetchCurrentSeason = async () => {
  try {
    console.log('Fetching list of all seasons...');
    const response = await pubgApi.get('/seasons');
    const seasons = response.data.data;
    // Find the season that is the current one for the official game
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
  console.log('Calculating summary stats from gameModeStats:', JSON.stringify(gameModeStats, null, 2));
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

const { spawn } = require('child_process');
const fs = require('fs');

app.get('/api/players/summary', async (req, res) => {
  const playerNames = req.query.playerNames;

  if (!playerNames) {
    return res.status(400).json({ error: 'Player names are required.' });
  }

  if (!CURRENT_SEASON_ID) {
    return res.status(500).json({ error: 'Server has not determined the current season. Please check server logs.' });
  }

  try {
    const response = await pubgApi.get(`/players?filter[playerNames]=${playerNames}`);
    const players = response.data.data;

    const summaryStatsPromises = players.map(player => {
        const seasonId = CURRENT_SEASON_ID;
        console.log(`Using global season ${seasonId} for player ${player.attributes.name}. Fetching unranked stats for summary...`);

        return pubgApi.get(`/players/${player.id}/seasons/${seasonId}`)
            .then(seasonRes => {
                console.log(`Successfully fetched stats for ${player.attributes.name} for summary.`);
                const summaryStats = calculateSummaryStats(seasonRes.data.data.attributes.gameModeStats);
                return {
                    ...player.attributes,
                    id: player.id,
                    summaryStats,
                };
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    console.log(`API returned 404 (Not Found) for ${player.attributes.name} in season ${seasonId}.`);
                    return { ...player.attributes, id: player.id, summaryStats: calculateSummaryStats({}) };
                }
                console.error(`An unexpected error occurred fetching stats for ${player.attributes.name}:`, error.message);
                throw error;
            });
    });

    const playersWithSummaryStats = await Promise.all(summaryStatsPromises);

    const pythonProcess = spawn('python', ['generate_chart.py']);

    pythonProcess.stdin.write(JSON.stringify(playersWithSummaryStats));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python script output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        const kdChart = fs.readFileSync('kd_chart.png', 'base64');
        const adrChart = fs.readFileSync('adr_chart.png', 'base64');
        const winsChart = fs.readFileSync('wins_chart.png', 'base64');
        const kprChart = fs.readFileSync('kpr_chart.png', 'base64');
        const killsChart = fs.readFileSync('kills_chart.png', 'base64');

        res.json({
          stats: playersWithSummaryStats,
          charts: {
            kd: `data:image/png;base64,${kdChart}`,
            adr: `data:image/png;base64,${adrChart}`,
            wins: `data:image/png;base64,${winsChart}`,
            kpr: `data:image/png;base64,${kprChart}`,
            kills: `data:image/png;base64,${killsChart}`,
          }
        });

        // Clean up the generated files
        fs.unlinkSync('kd_chart.png');
        fs.unlinkSync('adr_chart.png');
        fs.unlinkSync('wins_chart.png');
        fs.unlinkSync('kpr_chart.png');
        fs.unlinkSync('kills_chart.png');
      } else {
        res.status(500).json({ error: 'Failed to generate charts.' });
      }
    });

  } catch (error) {
    const errorMessage = error.message;
    const errorResponse = error.response ? error.response.data : 'No response data';
    console.error('Error during API processing:', errorMessage, errorResponse);
    res.status(500).json({ error: 'Failed to fetch player data.' });
  }
});

app.get('/api/players', async (req, res) => {
  const playerNames = req.query.playerNames;

  if (!playerNames) {
    return res.status(400).json({ error: 'Player names are required.' });
  }

  // --- NEW: Check if the global season ID was set ---
  if (!CURRENT_SEASON_ID) {
    return res.status(500).json({ error: 'Server has not determined the current season. Please check server logs.' });
  }

  try {
    const response = await pubgApi.get(`/players?filter[playerNames]=${playerNames}`);
    const players = response.data.data;

    const seasonStatsPromises = players.map(player => {
        // --- REVISED LOGIC: Use the global season ID ---
        const seasonId = CURRENT_SEASON_ID;
        console.log(`Using global season ${seasonId} for player ${player.attributes.name}. Fetching unranked stats...`);

        return pubgApi.get(`/players/${player.id}/seasons/${seasonId}`)
            .then(seasonRes => {
                console.log(`Successfully fetched stats for ${player.attributes.name}.`);
                return {
                    ...player.attributes,
                    id: player.id,
                    seasonStats: seasonRes.data.data.attributes.gameModeStats,
                };
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    console.log(`API returned 404 (Not Found) for ${player.attributes.name} in season ${seasonId}.`);
                    return { ...player.attributes, id: player.id, seasonStats: {} };
                }
                console.error(`An unexpected error occurred fetching stats for ${player.attributes.name}:`, error.message);
                throw error;
            });
    });

    const playersWithStats = await Promise.all(seasonStatsPromises);
    res.json(playersWithStats);

  } catch (error) {
    const errorMessage = error.message;
    const errorResponse = error.response ? error.response.data : 'No response data';
    console.error('Error during API processing:', errorMessage, errorResponse);
    res.status(500).json({ error: 'Failed to fetch player data.' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('PUBG Stats Server is running.');
});

// --- NEW: Start server and fetch season ID ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Fetch the global season ID once the server starts.
  fetchCurrentSeason();
});