// client/src/components/StatsDisplay.js
import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

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

  const chartData = stats.map(player => ({
    name: player.name,
    kd: parseFloat((player.summaryStats.kd / 100).toFixed(2)),
    adr: parseFloat(player.summaryStats.adr.toFixed(2)),
    wins: player.summaryStats.wins,
  }));

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

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h3" gutterBottom align="center">
            K/D Ratio
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 75 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="kd" fill="#8884d8" barSize={50}>
                <LabelList dataKey="kd" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h3" gutterBottom align="center">
            Average Damage per Round (ADR)
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 75 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="adr" fill="#82ca9d" barSize={50}>
                <LabelList dataKey="adr" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" component="h3" gutterBottom align="center">
            Wins
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 75 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#ffc658" barSize={50}>
                <LabelList dataKey="wins" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsDisplay;
