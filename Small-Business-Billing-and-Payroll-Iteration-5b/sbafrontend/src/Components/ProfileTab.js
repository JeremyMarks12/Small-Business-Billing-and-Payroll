import React, { useState, useEffect } from 'react';
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
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from './AuthContext';

const ProfileTab = () => {
  const { user } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState({
    username: null,
    password: null
  });
  const [passwordError, setPasswordError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [openConfirmUsername, setOpenConfirmUsername] = useState(false);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(false);

  useEffect(() => {
    fetchLastUpdated();
  }, []);

  const fetchLastUpdated = () => {
    try {
      // Check localStorage for last update timestamp
      const storedData = localStorage.getItem(`lastUpdated_${user?.workerID}`);
      if (storedData) {
        setLastUpdated(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error fetching last updated information:', error);
    }
  };

  const canUpdateToday = (field) => {
    if (!lastUpdated[field]) return true;
    
    const lastDate = new Date(lastUpdated[field]);
    const today = new Date();
    
    // Reset hours, minutes, seconds and milliseconds for date comparison
    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // If the dates are different (i.e., not the same day), then update is allowed
    return lastDate.getTime() !== today.getTime();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordInput = (e) => {
    setPasswordConfirm(e.target.value);
    setPasswordError('');
  };

  const handleOpenUsernameDialog = () => {
    if (!newUsername) {
      showSnackbarMessage('Please enter a new username', 'error');
      return;
    }

    // Check if username can be updated today
    if (!canUpdateToday('username')) {
      showSnackbarMessage('You can only change your username once per day', 'warning');
      return;
    }
    
    setPasswordConfirm('');
    setPasswordError('');
    setOpenConfirmUsername(true);
  };

  const handleOpenPasswordDialog = () => {
    if (!newPassword) {
      showSnackbarMessage('Please enter a new password', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showSnackbarMessage('Passwords do not match', 'error');
      return;
    }

    // Check if password can be updated today
    if (!canUpdateToday('password')) {
      showSnackbarMessage('You can only change your password once per day', 'warning');
      return;
    }
    
    setPasswordConfirm('');
    setPasswordError('');
    setOpenConfirmPassword(true);
  };

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const verifyPassword = async () => {
    if (!passwordConfirm) {
      setPasswordError('Please enter your password');
      return false;
    }

    try {
      const response = await fetch('http://localhost:8080/worker/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: user.username, 
          password: passwordConfirm 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        setPasswordError('Incorrect password');
        return false;
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Error verifying password');
      return false;
    }
  };

  const confirmUsernameUpdate = async () => {
    if (!user) {
      showSnackbarMessage( 'User information is missing', 'error');
      return;
    }

    // First verify the password
    if (!await verifyPassword()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:8080/worker/updateWorker/${user.workerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...user, 
          username: newUsername 
        }),
      });
      
      if (response.ok) {
        // Update local storage with the new username
        const updatedUser = { ...user, username: newUsername };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('username', newUsername);
        
        // Update last updated timestamp
        const updatedTimestamps = {
          ...lastUpdated,
          username: new Date().toISOString()
        };
        localStorage.setItem(`lastUpdated_${user.workerID}`, JSON.stringify(updatedTimestamps));
        setLastUpdated(updatedTimestamps);
        
        setNewUsername('');
        showSnackbarMessage('Username updated successfully!');
      } else {
        showSnackbarMessage('Failed to update username', 'error');
      }
    } catch (err) {
      console.error('Error updating username:', err);
      showSnackbarMessage('Error updating username: ' + err.message, 'error');
    } finally {
      setIsUpdating(false);
      setOpenConfirmUsername(false);
    }
  };

  const confirmPasswordUpdate = async () => {
    if (!user || !user.workerID) {
      showSnackbarMessage('User information is missing', 'error');
      return;
    }

    // First verify the password
    if (!await verifyPassword()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:8080/worker/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...user, 
          password: newPassword 
        }),
      });
      
      if (response.ok) {
        // Update last updated timestamp
        const updatedTimestamps = {
          ...lastUpdated,
          password: new Date().toISOString()
        };
        localStorage.setItem(`lastUpdated_${user.workerID}`, JSON.stringify(updatedTimestamps));
        setLastUpdated(updatedTimestamps);
        
        setNewPassword('');
        setConfirmPassword('');
        showSnackbarMessage('Password updated successfully!');
      } else {
        showSnackbarMessage('Failed to update password', 'error');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      showSnackbarMessage('Error updating password: ' + err.message, 'error');
    } finally {
      setIsUpdating(false);
      setOpenConfirmPassword(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        User Profile
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
              {user.admin ? 'Administrator' : 'Inspector'}
            </Typography>
          </Grid>
          
          {/* Username Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Username</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Current: <strong>{user.username}</strong>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="New Username"
                value={newUsername}
                onChange={handleUsernameChange}
                variant="outlined"
                helperText="You can only change your username once per day"
              />
              <Button
                variant="contained"
                onClick={handleOpenUsernameDialog}
                disabled={!newUsername || isUpdating}
                sx={{ mt: 1 }}
              >
                Change
              </Button>
            </Box>
          </Grid>
          
          {/* Password Section */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6">Password</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Change your current password
            </Typography>
            
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Must be at least 8 characters with 1 special character"
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              margin="normal"
              variant="outlined"
              error={newPassword !== confirmPassword && confirmPassword !== ''}
              helperText={
                newPassword !== confirmPassword && confirmPassword !== '' 
                  ? 'Passwords do not match' 
                  : 'You can only change your password once per day'
              }
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleOpenPasswordDialog}
                disabled={!newPassword || newPassword !== confirmPassword || isUpdating}
              >
                Update Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Username Confirmation Dialog */}
      <Dialog open={openConfirmUsername} onClose={() => setOpenConfirmUsername(false)}>
        <DialogTitle>Confirm Username Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change your username to <strong>{newUsername}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            You will need to use this new username the next time you login.
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <TextField
              label="Enter Your Password to Confirm"
              type="password"
              value={passwordConfirm}
              onChange={handleConfirmPasswordInput}
              fullWidth
              margin="dense"
              required
              error={!!passwordError}
              helperText={passwordError || "Enter your password to confirm this action"}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirmUsername(false)} 
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmUsernameUpdate}
            variant="contained"
            disabled={isUpdating || !passwordConfirm}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Confirmation Dialog */}
      <Dialog open={openConfirmPassword} onClose={() => setOpenConfirmPassword(false)}>
        <DialogTitle>Confirm Password Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change your password?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            You will need to use this new password the next time you login.
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <TextField
              label="Enter Your Password to Confirm"
              type="password"
              value={passwordConfirm}
              onChange={handleConfirmPasswordInput}
              fullWidth
              margin="dense"
              required
              error={!!passwordError}
              helperText={passwordError || "Enter your current password to confirm this action"}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirmPassword(false)} 
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmPasswordUpdate}
            variant="contained"
            disabled={isUpdating || !passwordConfirm}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileTab;