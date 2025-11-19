// client/src/App.js
import React, { useState } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, Box } from '@mui/material';
import PlayerInput from './components/PlayerInput';
import StatsDisplay from './components/StatsDisplay';
import Header from './components/Header';
import axios from 'axios';
import theme from './theme';

function App() {
  const [playerStats, setPlayerStats] = useState([]);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayerStats = async (playerNames) => {
    if (playerNames.length === 0) {
      setPlayerStats([]);
      setCharts(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5001/api/players/summary?playerNames=${playerNames.join(',')}`);
      setPlayerStats(response.data.stats);
      setCharts(response.data.charts);
    } catch (err) {
      setError('Failed to fetch player data. Make sure the server is running and player names are correct.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        padding: '2rem 0',
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: 'text.primary' }}>
            PUBG Player Stats Comparator
          </Typography>
          <PlayerInput onSearch={fetchPlayerStats} loading={loading} />
          {error && <Typography color="error" align="center" style={{ margin: '1rem' }}>{error}</Typography>}
          <StatsDisplay stats={playerStats} charts={charts} loading={loading} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;