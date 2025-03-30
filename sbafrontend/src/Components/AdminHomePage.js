import React, { useState } from 'react';
import { Box, Button, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminHomePage = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setOpen(true);
    };

    const handleConfirmLogout = () => {
        setOpen(false);
        navigate('/');
        alert('You have been logged out successfully.');
    };

    const handleCancelLogout = () => {
        setOpen(false);
    };

    const sidebarItems = [
        'Assign Work',
        'View Completed Work',
        'Companies',
        'Inspector Profiles',
        'Billing',
        'Profile',
        'Logout'
    ];

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                        backgroundColor: '#f4f4f4',
                        textAlign: 'center', // Center the text
                        padding: '20px 0', // Space around the title
                    },
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Steve Ball & Associates
                </Typography>
                <List>
                    {sidebarItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={item === 'Logout' ? handleLogoutClick : null}>
                                <ListItemText primary={item} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4">Admin Dashboard</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Welcome to the admin dashboard! Select an option from the sidebar to get started.
                </Typography>
            </Box>
            <Dialog open={open} onClose={handleCancelLogout}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    Are you sure you want to log out?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="primary">No</Button>
                    <Button onClick={handleConfirmLogout} color="primary" autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminHomePage;

