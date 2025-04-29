import React, { useEffect, useState } from 'react';
import {
    Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText,
    Divider, Grid, Paper, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Alert, Snackbar, FormControl, FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from './AuthContext';

const InspectorProfiles = () => {
    const { user } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [inspectors, setInspectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState(null);
    const [newWorker, setNewWorker] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        admin: false
    });
    const [editWorker, setEditWorker] = useState({
        workerID: null,
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        admin: false
    });
    const [formErrors, setFormErrors] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Define system admin username - this account cannot be deleted or modified and won't be displayed
    const SYSTEM_ADMIN_USERNAME = "admin"; // Replace with your actual system admin username

    // Helper function to sort workers alphabetically
    const sortWorkers = (workers) => {
        return workers.sort((a, b) => {
            // First compare by firstName
            const firstNameComparison = a.firstName.localeCompare(b.firstName);
            
            // If firstNames are the same, compare by lastName
            if (firstNameComparison === 0) {
                return a.lastName.localeCompare(b.lastName);
            }
            
            return firstNameComparison;
        });
    };

    const fetchWorkers = async () => {
        try {
            const response = await fetch('http://localhost:8080/worker/getAll');
            const data = await response.json();

            // Filter out system admin from both lists
            const adminList = data.filter(worker => 
                worker.admin === true && worker.username !== SYSTEM_ADMIN_USERNAME
            );
            const inspectorList = data.filter(worker => 
                worker.admin === false && worker.username !== SYSTEM_ADMIN_USERNAME
            );

            // Sort both lists alphabetically
            setAdmins(sortWorkers(adminList));
            setInspectors(sortWorkers(inspectorList));
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch workers:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    // Handling for Add dialog
    const handleOpenAddDialog = (isAdmin) => {
        setSelectedWorker(null);
        setEditMode(false);
        setNewWorker({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: '',
            admin: isAdmin
        });
        setFormErrors({
            username: '',
            password: '',
            confirmPassword: ''
        });
        setPasswordConfirm('');
        setPasswordError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedWorker(null);
        setEditMode(false);
        setPasswordConfirm('');
        setPasswordError('');
    };

    // Handling for View/Edit dialog
    const handleOpenViewDialog = (worker) => {
        // Check if this is the system admin (cannot be edited)
        if (worker.username === SYSTEM_ADMIN_USERNAME) {
            setSnackbar({
                open: true,
                message: 'System administrator cannot be modified',
                severity: 'warning'
            });
            return;
        }

        setSelectedWorker(worker);
        setEditWorker({
            workerID: worker.workerID,
            firstName: worker.firstName,
            lastName: worker.lastName,
            username: worker.username,
            password: '',
            confirmPassword: '',
            admin: worker.admin
        });
        setFormErrors({
            username: '',
            password: '',
            confirmPassword: ''
        });
        setEditMode(false);
        setPasswordConfirm('');
        setPasswordError('');
        setOpenDialog(true);
    };

    // Handling for delete dialog
    const handleOpenDeleteDialog = (worker) => {
        // Check if this is the system admin (cannot be deleted)
        if (worker.username === SYSTEM_ADMIN_USERNAME) {
            setSnackbar({
                open: true,
                message: 'System administrator cannot be deleted',
                severity: 'warning'
            });
            return;
        }
        
        setWorkerToDelete(worker);
        setPasswordConfirm('');
        setPasswordError('');
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setWorkerToDelete(null);
        setPasswordConfirm('');
        setPasswordError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (selectedWorker) {
            // Edit mode
            setEditWorker(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            // Add mode
            setNewWorker(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear any errors for this field
        if (['username', 'password', 'confirmPassword'].includes(name)) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordConfirm(e.target.value);
        setPasswordError('');
    };

    const validatePassword = (password) => {
        if (!password) return ""; // Skip validation if no password (for edit form)
        
        const minLength = 8;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        
        if (password.length < minLength) {
            return "Password must be at least 8 characters long";
        }
        
        if (!specialCharRegex.test(password)) {
            return "Password must contain at least one special character";
        }
        
        return "";
    };

    const checkUsernameExists = (username, currentId = null) => {
        const allWorkers = [...admins, ...inspectors];
        return allWorkers.some(worker => 
            worker.username === username && worker.workerID !== currentId
        );
    };

    const validateAddForm = () => {
        let valid = true;
        const errors = {
            username: '',
            password: '',
            confirmPassword: ''
        };

        // Validate username (check if exists)
        if (checkUsernameExists(newWorker.username)) {
            errors.username = "Username already exists";
            valid = false;
        }

        // Validate password
        const passwordError = validatePassword(newWorker.password);
        if (passwordError) {
            errors.password = passwordError;
            valid = false;
        }

        // Validate password confirmation
        if (newWorker.password !== newWorker.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const validateEditForm = () => {
        let valid = true;
        const errors = {
            username: '',
            password: '',
            confirmPassword: ''
        };

        // Validate username (check if exists, but ignore current user)
        if (checkUsernameExists(editWorker.username, editWorker.workerID)) {
            errors.username = "Username already exists";
            valid = false;
        }

        // Only validate password if one is provided (password change is optional during edit)
        if (editWorker.password) {
            // Validate password
            const passwordError = validatePassword(editWorker.password);
            if (passwordError) {
                errors.password = passwordError;
                valid = false;
            }

            // Validate password confirmation
            if (editWorker.password !== editWorker.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
                valid = false;
            }
        }

        setFormErrors(errors);
        return valid;
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

    const handleEditClick = async () => {
        if (!await verifyPassword()) {
            return;
        }
        setEditMode(true);
    };

    const handleAddSubmit = async () => {
        if (!validateAddForm()) {
            return;
        }

        if (!await verifyPassword()) {
            return;
        }

        // Remove confirmPassword before sending to API
        const workerToSave = {
            firstName: newWorker.firstName,
            lastName: newWorker.lastName,
            username: newWorker.username,
            password: newWorker.password,
            admin: newWorker.admin
        };

        try {
            const response = await fetch('http://localhost:8080/worker/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workerToSave),
            });

            if (response.ok) {
                fetchWorkers();
                handleCloseDialog();
                setSnackbar({
                    open: true,
                    message: `New ${newWorker.admin ? 'admin' : 'inspector'} created successfully!`,
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to create new worker',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error during creation:', error);
            setSnackbar({
                open: true,
                message: 'Error creating worker: ' + error.message,
                severity: 'error'
            });
        }
    };

    const handleEditSubmit = async () => {
        if (!validateEditForm()) {
            return;
        }

        if (!await verifyPassword()) {
            return;
        }

        // Prepare worker data for update (include password only if it was changed)
        const workerToUpdate = {
            workerID: editWorker.workerID,
            firstName: editWorker.firstName,
            lastName: editWorker.lastName,
            username: editWorker.username,
            admin: editWorker.admin
        };

        // Add password only if it was provided (changed)
        if (editWorker.password) {
            workerToUpdate.password = editWorker.password;
        }

        try {
            const response = await fetch(`http://localhost:8080/worker/updateWorker/${workerToUpdate.workerID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workerToUpdate),
            });

            if (response.ok) {
                fetchWorkers();
                handleCloseDialog();
                setSnackbar({
                    open: true,
                    message: `${editWorker.firstName} ${editWorker.lastName} updated successfully!`,
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to update worker',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error during update:', error);
            setSnackbar({
                open: true,
                message: 'Error updating worker: ' + error.message,
                severity: 'error'
            });
        }
    };

    // Functions for delete functionality
    const handleDeleteSubmit = async () => {
        if (!await verifyPassword()) {
            return;
        }

        if (!workerToDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/worker/deleteWorker/${workerToDelete.workerID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchWorkers();
                handleCloseDeleteDialog();
                setSnackbar({
                    open: true,
                    message: `${workerToDelete.firstName} ${workerToDelete.lastName} deleted successfully!`,
                    severity: 'success'
                });
            } else {
                const error = await response.json();
                setSnackbar({
                    open: true,
                    message: error.message || 'Failed to delete worker',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting worker: ' + error.message,
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Custom list item component that includes both the name and delete button
    const WorkerListItem = ({ worker, isAdmin }) => {
        return (
            <ListItem 
                disablePadding
                secondaryAction={
                    <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteDialog(worker);
                        }}
                        size="small"
                    >
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                }
            >
                <ListItemButton
                    onClick={() => handleOpenViewDialog(worker)}
                >
                    <ListItemText primary={`${worker.firstName} ${worker.lastName}`} />
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
                Inspector Profiles
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {/* Admin Box */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 2, height: 400, overflowY: 'auto' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Admins</Typography>
                            <IconButton onClick={() => handleOpenAddDialog(true)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <List>
                            {admins.map((admin) => (
                                <WorkerListItem key={admin.workerID} worker={admin} isAdmin={true} />
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Inspector Box */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 2, height: 400, overflowY: 'auto' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Inspectors</Typography>
                            <IconButton onClick={() => handleOpenAddDialog(false)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <List>
                            {inspectors.map((worker) => (
                                <WorkerListItem key={worker.workerID} worker={worker} isAdmin={false} />
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog for Add/View/Edit */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedWorker 
                        ? (editMode 
                            ? `Edit ${selectedWorker.admin ? 'Admin' : 'Inspector'}` 
                            : `${selectedWorker.admin ? 'Admin' : 'Inspector'} Details`)
                        : `Add New ${newWorker.admin ? 'Admin' : 'Inspector'}`
                    }
                </DialogTitle>
                <DialogContent>
                    {/* First Name */}
                    <FormControl fullWidth margin="normal">
                        <TextField 
                            label="First Name" 
                            name="firstName" 
                            onChange={handleChange}
                            value={selectedWorker ? editWorker.firstName : newWorker.firstName}
                            required
                            fullWidth
                            disabled={selectedWorker && !editMode}
                        />
                        <FormHelperText>
                            Enter the user's first name (e.g., "John")
                        </FormHelperText>
                    </FormControl>

                    {/* Last Name */}
                    <FormControl fullWidth margin="normal">
                        <TextField 
                            label="Last Name" 
                            name="lastName" 
                            onChange={handleChange}
                            value={selectedWorker ? editWorker.lastName : newWorker.lastName}
                            required
                            fullWidth
                            disabled={selectedWorker && !editMode}
                        />
                        <FormHelperText>
                            Enter the user's last name (e.g., "Smith")
                        </FormHelperText>
                    </FormControl>

                    {/* Username */}
                    <FormControl fullWidth margin="normal">
                        <TextField 
                            label="Username" 
                            name="username" 
                            onChange={handleChange}
                            value={selectedWorker ? editWorker.username : newWorker.username}
                            required
                            error={!!formErrors.username}
                            helperText={formErrors.username || "Create a unique username (e.g., 'jsmith')"}
                            fullWidth
                            disabled={selectedWorker && !editMode}
                        />
                    </FormControl>

                    {/* Password fields - only show in add mode or edit mode (not view mode) */}
                    {(!selectedWorker || editMode) && (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                {selectedWorker ? "Change Password (leave blank to keep current password)" : "Create Password"}
                            </Typography>

                            <FormControl fullWidth margin="normal">
                                <TextField 
                                    label={selectedWorker ? "New Password" : "Password"}
                                    name="password" 
                                    type="password" 
                                    onChange={handleChange}
                                    value={selectedWorker ? editWorker.password : newWorker.password}
                                    required={!selectedWorker}
                                    error={!!formErrors.password}
                                    helperText={formErrors.password || "Must be at least 8 characters with 1 special character (e.g., 'Secure@123')"}
                                    fullWidth
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <TextField 
                                    label={selectedWorker ? "Confirm New Password" : "Confirm Password"}
                                    name="confirmPassword" 
                                    type="password" 
                                    onChange={handleChange}
                                    value={selectedWorker ? editWorker.confirmPassword : newWorker.confirmPassword}
                                    required={!selectedWorker}
                                    error={!!formErrors.confirmPassword}
                                    helperText={formErrors.confirmPassword || "Re-enter the password exactly as above"}
                                    fullWidth
                                />
                            </FormControl>
                        </>
                    )}

                    {/* Password confirmation field - always show when viewing details */}
                    {selectedWorker && !editMode && (
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Enter Your Password"
                                type="password"
                                value={passwordConfirm}
                                onChange={handlePasswordChange}
                                fullWidth
                                margin="dense"
                                required
                                error={!!passwordError}
                                helperText={passwordError || "Enter your password to make changes"}
                                sx={{ mt: 2 }}
                            />
                        </FormControl>
                    )}

                    {/* Admin password confirmation field - show for add/edit operations */}
                    {(!selectedWorker || editMode) && (
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Enter Your Password to Confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={handlePasswordChange}
                                fullWidth
                                margin="dense"
                                required
                                error={!!passwordError}
                                helperText={passwordError || "Enter your password to confirm this action"}
                                sx={{ mt: 2 }}
                            />
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    {selectedWorker && !editMode && (
                        <Button onClick={handleEditClick} variant="contained" color="primary">
                            Edit
                        </Button>
                    )}
                    {editMode && selectedWorker && (
                        <Button 
                            onClick={handleEditSubmit} 
                            variant="contained" 
                            color="primary"
                            disabled={!editWorker.firstName || !editWorker.lastName || !editWorker.username}
                        >
                            Save Changes
                        </Button>
                    )}
                    {!selectedWorker && (
                        <Button 
                            onClick={handleAddSubmit} 
                            variant="contained" 
                            color="primary"
                            disabled={!newWorker.firstName || !newWorker.lastName || !newWorker.username || 
                                    !newWorker.password || !newWorker.confirmPassword}
                        >
                            Add
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    {workerToDelete && (
                        <>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Are you sure you want to delete {workerToDelete.firstName} {workerToDelete.lastName}?
                                This action cannot be undone.
                            </Typography>
                            
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Enter Your Password to Confirm"
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={handlePasswordChange}
                                    fullWidth
                                    required
                                    error={!!passwordError}
                                    helperText={passwordError || "Enter your password to confirm deletion"}
                                />
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteSubmit} 
                        variant="contained" 
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
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

export default InspectorProfiles;