// client/src/App.js
import React, { useState } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PlayerInput from './components/PlayerInput';
import StatsDisplay from './components/StatsDisplay';
// import Footer from './components/Footer';
import Header from './components/Header';
import axios from 'axios';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          PUBG Player Stats Comparator
        </Typography>
        <PlayerInput onSearch={fetchPlayerStats} loading={loading} />
        {error && <Typography color="error" align="center" style={{ margin: '1rem' }}>{error}</Typography>}
        <StatsDisplay stats={playerStats} charts={charts} loading={loading} />
      </Container>
    </ThemeProvider>
  );
}

export default App;