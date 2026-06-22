import React, { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { apiFetch } from '../api';
import { useAuth } from './AuthContext';

const ProfileTab = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const resetPassword = async () => {
    try {
      await apiFetch(`/workers/${user.workerID}/password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword: password }),
      });
      setPassword('');
      setMessage({ severity: 'success', text: 'Password updated.' });
    } catch (error) {
      setMessage({ severity: 'error', text: error.message });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Profile</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6">{user?.firstName} {user?.lastName}</Typography>
        <Typography color="text.secondary">{user?.username}</Typography>
        <Typography sx={{ mb: 3 }}>{user?.isAdmin ? 'Administrator' : 'Inspector'}</Typography>
        {message && <Alert severity={message.severity} sx={{ mb: 2 }}>{message.text}</Alert>}
        {user?.isAdmin ? (
          <>
            <TextField
              label="New password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              fullWidth
              helperText="The backend requires at least 8 characters."
            />
            <Button variant="contained" sx={{ mt: 2 }} disabled={password.length < 8} onClick={resetPassword}>
              Reset password
            </Button>
          </>
        ) : (
          <Alert severity="info">
            Self-service profile editing is not exposed by the current backend. Ask an administrator to reset your password.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ProfileTab;
