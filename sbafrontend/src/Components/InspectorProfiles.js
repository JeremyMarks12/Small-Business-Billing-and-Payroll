import React, { useCallback, useEffect, useState } from 'react';
import {
    Box, Typography, Paper, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, Alert, Snackbar, FormControl, FormHelperText,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    InputLabel, MenuItem, Select
} from '@mui/material';
import { useAuth } from './AuthContext';
import { apiFetch } from '../api';
import { normalizeWorker, workerPayload } from '../model';

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

    const fetchWorkers = useCallback(async () => {
        try {
            const data = await apiFetch('/workers');
			
            // Filter out system admin from both lists
			const normalizedWorkers = data.map(normalizeWorker).map(worker => ({
                ...worker,
                admin: worker.isAdmin
            }));
			
			const adminList = normalizedWorkers.filter(worker => 
			    worker.admin === true && worker.username !== SYSTEM_ADMIN_USERNAME
			);

			const inspectorList = normalizedWorkers.filter(worker => 
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
    }, []);

    useEffect(() => {
        fetchWorkers();
    }, [fetchWorkers]);

    // Handling for Add dialog
    const handleOpenAddDialog = () => {
        setSelectedWorker(null);
        setEditMode(false);
        setNewWorker({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: '',
            admin: false
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
        const specialCharRegex = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]+/;
        
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
          await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ 
              username: user.username, 
              password: passwordConfirm 
            }),
          });
          return true;
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
        const workerToSave = workerPayload(newWorker);

        try {
            await apiFetch('/workers', {
                method: 'POST',
                body: JSON.stringify(workerToSave),
            });
            fetchWorkers();
            handleCloseDialog();
            setSnackbar({
                open: true,
                message: `New ${newWorker.admin ? 'admin' : 'inspector'} created successfully!`,
                severity: 'success'
            });
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

        if (!editWorker.password) {
            setSnackbar({
                open: true,
                message: 'Only password reset is supported by the current worker API.',
                severity: 'info'
            });
            return;
        }

        try {
            await apiFetch(`/workers/${editWorker.workerID}/password`, {
                method: 'PUT',
                body: JSON.stringify({ newPassword: editWorker.password }),
            });
            fetchWorkers();
            handleCloseDialog();
            setSnackbar({
                open: true,
                message: `${editWorker.firstName} ${editWorker.lastName}'s password was reset.`,
                severity: 'success'
            });
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
            await apiFetch(`/workers/${workerToDelete.workerID}`, {
                method: 'DELETE',
            });
            fetchWorkers();
            handleCloseDeleteDialog();
            setSnackbar({
                open: true,
                message: `${workerToDelete.firstName} ${workerToDelete.lastName} deleted successfully!`,
                severity: 'success'
            });
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

    const WorkerTable = ({ title, rows }) => (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(worker => (
                            <TableRow key={worker.workerID}>
                                <TableCell>
                                    <Button size="small" onClick={() => handleOpenViewDialog(worker)}>
                                        {worker.firstName} {worker.lastName}
                                    </Button>
                                </TableCell>
                                <TableCell>{worker.username}</TableCell>
                                <TableCell>{worker.admin ? 'Admin' : 'Worker'}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" color="error" onClick={() => handleOpenDeleteDialog(worker)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!rows.length && (
                            <TableRow>
                                <TableCell colSpan={4}>No {title.toLowerCase()} found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Worker Profiles
                </Typography>
                <Button variant="contained" onClick={handleOpenAddDialog}>Add Worker</Button>
            </Box>

            <WorkerTable title="Admins" rows={admins} />
            <WorkerTable title="Workers" rows={inspectors} />

            {/* Dialog for Add/View/Edit */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedWorker 
                        ? (editMode 
                            ? `Reset ${selectedWorker.firstName}'s Password`
                            : `${selectedWorker.admin ? 'Admin' : 'Inspector'} Details`)
                        : `Add New ${newWorker.admin ? 'Admin' : 'Inspector'}`
                    }
                </DialogTitle>
                <DialogContent>
                    {!selectedWorker && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Worker type</InputLabel>
                            <Select
                                label="Worker type"
                                value={newWorker.admin ? 'admin' : 'worker'}
                                onChange={event => setNewWorker(prev => ({
                                    ...prev,
                                    admin: event.target.value === 'admin'
                                }))}
                            >
                                <MenuItem value="worker">Worker</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {/* First Name */}
                    <FormControl fullWidth margin="normal">
                        <TextField 
                            label="First Name" 
                            name="firstName" 
                            onChange={handleChange}
                            value={selectedWorker ? editWorker.firstName : newWorker.firstName}
                            required
                            fullWidth
                            disabled={Boolean(selectedWorker)}
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
                            disabled={Boolean(selectedWorker)}
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
                            disabled={Boolean(selectedWorker)}
                        />
                    </FormControl>

                    {/* Password fields - only show in add mode or edit mode (not view mode) */}
                    {(!selectedWorker || editMode) && (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                {selectedWorker ? "Set a new password" : "Create Password"}
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
                            disabled={!editWorker.password || !editWorker.confirmPassword}
                        >
                            Reset Password
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
