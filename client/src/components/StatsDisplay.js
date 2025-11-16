// client/src/components/StatsDisplay.js
import React, { useState, useMemo } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a.summaryStats[sortConfig.key] < b.summaryStats[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a.summaryStats[sortConfig.key] > b.summaryStats[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Player' },
  { id: 'kd', numeric: true, disablePadding: false, label: 'K/D' },
  { id: 'adr', numeric: true, disablePadding: false, label: 'ADR' },
  { id: 'kpr', numeric: true, disablePadding: false, label: 'Kills per Round' },
  { id: 'kills', numeric: true, disablePadding: false, label: 'Kills' },
  { id: 'assists', numeric: true, disablePadding: false, label: 'Assists' },
  { id: 'longestKill', numeric: true, disablePadding: false, label: 'Longest Kill' },
  { id: 'damageDealt', numeric: true, disablePadding: false, label: 'Damage Given' },
  { id: 'roundsPlayed', numeric: true, disablePadding: false, label: 'Rounds Played' },
  { id: 'wins', numeric: true, disablePadding: false, label: 'Wins' },
];

const StatsDisplay = ({ stats, charts, loading }) => {
  const { items: sortedStats, requestSort, sortConfig } = useSortableData(stats, { key: 'kpr', direction: 'descending' });

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
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={sortConfig && sortConfig.key === headCell.id ? sortConfig.direction : false}
                >
                  <TableSortLabel
                    active={sortConfig && sortConfig.key === headCell.id}
                    direction={sortConfig && sortConfig.key === headCell.id ? sortConfig.direction : 'asc'}
                    onClick={() => requestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStats.map((player) => (
              <TableRow key={player.id}>
                <TableCell component="th" scope="row">
                  {player.name}
                </TableCell>
                <TableCell align="right">{(player.summaryStats.kd / 100).toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.adr.toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.kpr.toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.kills}</TableCell>
                <TableCell align="right">{player.summaryStats.assists}</TableCell>
                <TableCell align="right">{player.summaryStats.longestKill.toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.damageDealt.toFixed(2)}</TableCell>
                <TableCell align="right">{player.summaryStats.roundsPlayed}</TableCell>
                <TableCell align="right">{player.summaryStats.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {charts && (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              K/D Ratio
            </Typography>
            <img src={charts.kd} alt="K/D Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              Average Damage per Round (ADR)
            </Typography>
            <img src={charts.adr} alt="ADR Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              Wins
            </Typography>
            <img src={charts.wins} alt="Wins Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              Kills per Round
            </Typography>
            <img src={charts.kpr} alt="Kills per Round Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom align="center">
              Kills
            </Typography>
            <img src={charts.kills} alt="Kills Chart" style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StatsDisplay;
