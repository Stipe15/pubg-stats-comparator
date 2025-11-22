import React, { useState } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, Box } from '@mui/material';
import PlayerInput from './components/PlayerInput';
import StatsDisplay from './components/StatsDisplay';
import Header from './components/Header';
import { fetchPlayerStats as fetchStats } from './api';
import theme from './theme';

function App() {
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayerStats = async (playerNames) => {
    if (playerNames.length === 0) {
      setPlayerStats([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stats = await fetchStats(playerNames);
      setPlayerStats(stats);
    } catch (err) {
      setError('Failed to fetch player data. Make sure the API key is correct and player names are valid.');
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
          <StatsDisplay stats={playerStats} loading={loading} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}


export default App;