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