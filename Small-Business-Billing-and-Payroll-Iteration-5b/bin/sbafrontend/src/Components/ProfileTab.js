import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ProfileTab = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [openConfirmUsername, setOpenConfirmUsername] = useState(false);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const confirmUsernameUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/worker/update/${currentUser.workerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentUser, username: newUsername }),
      });
      if (response.ok) {
        const updatedUser = { ...currentUser, username: newUsername };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setNewUsername('');
        alert('Username updated successfully!');
      }
    } catch (err) {
      console.error('Error updating username:', err);
    }
  };

  const confirmPasswordUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/worker/update/${currentUser.workerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentUser, password: newPassword }),
      });
      if (response.ok) {
        const updatedUser = { ...currentUser, password: newPassword };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setNewPassword('');
        alert('Password updated successfully!');
      }
    } catch (err) {
      console.error('Error updating password:', err);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {currentUser.firstName} {currentUser.lastName}
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Current Username: {currentUser.username}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', my: 1 }}>
          <TextField
            fullWidth
            label="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => setOpenConfirmUsername(true)}
            disabled={!newUsername}
          >
            Submit
          </Button>
        </Box>

        <Typography variant="subtitle1">
          Current Password: {currentUser.password}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Enter new password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={() => setOpenConfirmPassword(true)}
            disabled={!newPassword}
          >
            Submit
          </Button>
        </Box>

        {/* Username Confirmation Dialog */}
        <Dialog open={openConfirmUsername} onClose={() => setOpenConfirmUsername(false)}>
          <DialogTitle>Confirm Username Change</DialogTitle>
          <DialogContent>
            Are you sure you want to change your username to <strong>{newUsername}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmUsername(false)}>Cancel</Button>
            <Button
              onClick={() => {
                confirmUsernameUpdate();
                setOpenConfirmUsername(false);
              }}
              variant="contained"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Confirmation Dialog */}
        <Dialog open={openConfirmPassword} onClose={() => setOpenConfirmPassword(false)}>
          <DialogTitle>Confirm Password Change</DialogTitle>
          <DialogContent>
            Are you sure you want to change your password?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmPassword(false)}>Cancel</Button>
            <Button
              onClick={() => {
                confirmPasswordUpdate();
                setOpenConfirmPassword(false);
              }}
              variant="contained"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default ProfileTab;



