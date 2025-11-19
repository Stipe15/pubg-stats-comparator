// client/src/components/PlayerInput.js
import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Chip } from '@mui/material';

const PlayerInput = ({ onSearch, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const [playerNames, setPlayerNames] = useState([]);

  const handleAddPlayer = () => {
    if (inputValue && playerNames.length < 6 && !playerNames.includes(inputValue.trim())) {
      setPlayerNames([...playerNames, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDeletePlayer = (playerToDelete) => {
    setPlayerNames(playerNames.filter((player) => player !== playerToDelete));
  };

  const handleSearch = () => {
    onSearch(playerNames);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', mb: 4, p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', maxWidth: '500px' }}>
        <TextField
          label="Enter Player Name (up to 6)"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          disabled={playerNames.length >= 6}
        />
        <Button
          variant="contained"
          onClick={handleAddPlayer}
          disabled={playerNames.length >= 6 || !inputValue}
          sx={{ height: '56px' }}
        >
          Add
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 1 }}>
        {playerNames.map((name) => (
          <Chip
            key={name}
            label={name}
            onDelete={() => handleDeletePlayer(name)}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSearch}
        disabled={loading || playerNames.length === 0}
        sx={{ minWidth: '150px', fontWeight: 'bold' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Compare Stats'}
      </Button>
    </Box>
  );
};

export default PlayerInput;
