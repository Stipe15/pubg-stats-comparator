import React, { useState, useMemo } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Fade } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      const key = sortConfig.key;
      const getValue = (obj) => {
        // if sorting by name use top-level name, otherwise read from summaryStats and fallback to 0
        if (key === 'name') return (obj && obj.name) ? String(obj.name).toLowerCase() : '';
        const v = obj && obj.summaryStats ? obj.summaryStats[key] : 0;
        // ensure numeric comparison for missing/invalid values
        return typeof v === 'number' ? v : Number(v) || 0;
      };
      sortableItems.sort((a, b) => {
        const aVal = getValue(a);
        const bVal = getValue(b);
        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
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

// small palette used to color each bar (will cycle if more entries than colors)
const COLORS = [
  '#4caf50', // green
  '#2196f3', // blue
  '#ff9800', // orange
  '#9c27b0', // purple
  '#f44336', // red
  '#00bcd4', // cyan
  '#ffc107', // amber
  '#8bc34a', // light green
];

const Chart = ({ data, dataKey, title }) => (
  <Grid item sx={{ display: 'flex', flex: '0 1 45%', maxWidth: '45%', minWidth: 260, boxSizing: 'border-box', p: 1 }}>
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'background.paper' }}>
      <Typography variant="h6" component="h3" gutterBottom align="center">
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={dataKey}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>
);

const StatsDisplay = ({ stats, loading }) => {
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
  
  // helper formatters to avoid calling toFixed on undefined
  const fmt = (v, decimals = 2) => {
    const n = (v === null || v === undefined) ? 0 : Number(v);
    if (Number.isNaN(n)) return (0).toFixed(decimals);
    return n.toFixed(decimals);
  };
  const fmtInt = (v) => {
    const n = (v === null || v === undefined) ? 0 : Number(v);
    if (Number.isNaN(n)) return '0';
    return String(Math.round(n));
  };

  const chartData = sortedStats.map(player => ({
    name: player.name || '',
    kd: Number(player?.summaryStats?.kd ?? 0) / 100, // divided by 100
    adr: Number(player?.summaryStats?.adr ?? 0),
    kpr: Number(player?.summaryStats?.kpr ?? 0),
    kills: Number(player?.summaryStats?.kills ?? 0),
    wins: Number(player?.summaryStats?.wins ?? 0),
  }));
  console.log(chartData);

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
                    {/* smaller label */}
                    <Typography variant="caption" component="span">
                      {headCell.label}
                    </Typography>
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
                <TableCell align="right">{fmt((player?.summaryStats?.kd ?? 0) / 100, 2)}</TableCell> {/* divided by 100 */}
                <TableCell align="right">{fmt(player?.summaryStats?.adr, 2)}</TableCell>
                <TableCell align="right">{fmt(player?.summaryStats?.kpr, 2)}</TableCell>
                <TableCell align="right">{fmtInt(player?.summaryStats?.kills)}</TableCell>
                <TableCell align="right">{fmtInt(player?.summaryStats?.assists)}</TableCell>
                <TableCell align="right">{fmt(player?.summaryStats?.longestKill, 2)}</TableCell>
                <TableCell align="right">{fmt(player?.summaryStats?.damageDealt, 2)}</TableCell>
                <TableCell align="right">{fmtInt(player?.summaryStats?.roundsPlayed)}</TableCell>
                <TableCell align="right">{fmtInt(player?.summaryStats?.wins)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} justifyContent="center" sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Chart data={chartData} dataKey="kd" title="K/D Ratio" />
        <Chart data={chartData} dataKey="adr" title="ADR" />
        <Chart data={chartData} dataKey="wins" title="Wins" />
        <Chart data={chartData} dataKey="kpr" title="Kills per Round" />
        <Chart data={chartData} dataKey="kills" title="Total Kills" />
      </Grid>
    </Box>
  </Fade>
  );
};

export default StatsDisplay;
