// client/src/components/StatsDisplay.js
import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';

const StatsDisplay = ({ stats, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (stats.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Add player names and click "Compare Stats" to see the results.
      </Alert>
    );
  }

  // A list of game modes we care about, in a preferred order of display.
  const gameModes = ['squad-fpp', 'squad', 'duo-fpp', 'duo', 'solo-fpp', 'solo'];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Player Stats by Game Mode
      </Typography>
      
      <Grid container spacing={3} justifyContent="flex-start">
        {stats.map((player) => {
          // Filter and sort the available stats based on our preferred order
          const availableModes = player.seasonStats 
            ? Object.keys(player.seasonStats)
                .filter(mode => gameModes.includes(mode) && player.seasonStats[mode].roundsPlayed > 0)
                .sort((a, b) => gameModes.indexOf(a) - gameModes.indexOf(b))
            : [];

          return (
            <Grid item xs={12} md={6} lg={4} key={player.id}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" component="h3" color="primary" gutterBottom>{player.name}</Typography>
                
                {availableModes.length > 0 ? (
                  availableModes.map(mode => {
                    const modeStats = player.seasonStats[mode];
                    const kd = (modeStats.kills || 0) / (modeStats.losses || 1);
                    const adr = (modeStats.damageDealt || 0) / (modeStats.roundsPlayed || 1);

                    return (
                      <Box key={mode} sx={{ mb: 2, p: 1.5, border: '1px solid #333', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{mode.replace(/-/g, ' ').toUpperCase()}</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}><Typography><b>K/D:</b> {kd.toFixed(2)}</Typography></Grid>
                          <Grid item xs={6}><Typography><b>ADR:</b> {adr.toFixed(2)}</Typography></Grid>
                          <Grid item xs={6}><Typography><b>Wins:</b> {modeStats.wins || 0}</Typography></Grid>
                          <Grid item xs={6}><Typography><b>Rounds:</b> {modeStats.roundsPlayed || 0}</Typography></Grid>
                        </Grid>
                      </Box>
                    );
                  })
                ) : (
                  <Typography>No recent unranked stats found.</Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default StatsDisplay;
