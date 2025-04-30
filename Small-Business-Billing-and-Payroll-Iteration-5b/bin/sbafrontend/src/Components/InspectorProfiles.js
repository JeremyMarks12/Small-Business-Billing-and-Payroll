import React, { useEffect, useState } from 'react';
import {
    Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText,
    Divider, Grid, Paper, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const InspectorProfiles = () => {
    const [admins, setAdmins] = useState([]);
    const [inspectors, setInspectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newWorker, setNewWorker] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        admin: false
    });

    const fetchWorkers = async () => {
        try {
            const response = await fetch('http://localhost:8080/worker/getAll');
            const data = await response.json();

            const adminList = data.filter(worker => worker.admin === true);
            const inspectorList = data.filter(worker => worker.admin === false);

            setAdmins(adminList);
            setInspectors(inspectorList);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch workers:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const handleNameClick = (name) => {
        console.log('Clicked on:', name);
    };

    const handleOpenDialog = (isAdmin) => {
        setNewWorker({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            admin: isAdmin
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewWorker((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/worker/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWorker),
            });

            if (response.ok) {
                fetchWorkers(); 
                handleCloseDialog();
            } else {
                console.error('Failed to create new worker');
            }
        } catch (error) {
            console.error('Error during creation:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

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
                            <IconButton onClick={() => handleOpenDialog(true)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <List>
                            {admins.map((admin, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton onClick={() => handleNameClick(admin.firstName + ' ' + admin.lastName)}>
                                        <ListItemText primary={`${admin.firstName} ${admin.lastName}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Inspector Box */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 2, height: 400, overflowY: 'auto' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Inspectors</Typography>
                            <IconButton onClick={() => handleOpenDialog(false)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <List>
                            {inspectors.map((worker, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton onClick={() => handleNameClick(worker.firstName + ' ' + worker.lastName)}>
                                        <ListItemText primary={`${worker.firstName} ${worker.lastName}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Add Worker Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New {newWorker.admin ? 'Admin' : 'Inspector'}</DialogTitle>
                <DialogContent>
                    <TextField label="First Name" name="firstName" fullWidth margin="normal" onChange={handleChange} />
                    <TextField label="Last Name" name="lastName" fullWidth margin="normal" onChange={handleChange} />
                    <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} />
                    <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InspectorProfiles;




