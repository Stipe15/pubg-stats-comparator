// client/src/components/StatsDisplay.js
import React, { useState, useMemo } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Fade } from '@mui/material';

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
    <Fade in={!loading} timeout={500}>
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Player Stats Summary
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={sortConfig && sortConfig.key === headCell.id ? sortConfig.direction : false}
                  sx={{ py: 2, px: 2 }}
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
              <TableRow key={player.id} hover>
                <TableCell component="th" scope="row" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
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
          {Object.entries(charts).map(([key, chart]) => (
            <Grid item xs={12} md={6} key={key}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', backgroundColor: 'background.paper' }}>
                <Typography variant="h6" component="h3" gutterBottom align="center">
                  {key.toUpperCase()}
                </Typography>
                <img src={chart} alt={`${key} Chart`} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  </Fade>
  );
};

export default StatsDisplay;
