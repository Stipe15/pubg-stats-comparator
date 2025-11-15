// client/src/components/StatsDisplay.js
import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const StatsDisplay = ({ stats, charts, loading }) => {
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

  const allStatsZero = stats.every(
    player =>
      player.summaryStats.kd === 0 &&
      player.summaryStats.adr === 0 &&
      player.summaryStats.wins === 0 &&
      player.summaryStats.roundsPlayed === 0
  );

  if (allStatsZero) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No data available for the selected players in the current season.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Player Stats Summary
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell align="right">K/D</TableCell>
              <TableCell align="right">ADR</TableCell>
              <TableCell align="right">Wins</TableCell>
              <TableCell align="right">Rounds Played</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((player) => (
              <TableRow key={player.id}>
                <TableCell component="th" scope="row">
                  {player.name}
                </TableCell>
                <TableCell align="right">{(player.summaryStats.kd / 100).toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.adr.toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.wins}</TableCell>
                <TableCell align="right">{player.summaryStats.roundsPlayed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {charts && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              K/D Ratio
            </Typography>
            <img src={charts.kd} alt="K/D Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              Average Damage per Round (ADR)
            </Typography>
            <img src={charts.adr} alt="ADR Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              Wins
            </Typography>
            <img src={charts.wins} alt="Wins Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StatsDisplay;
