import React, { useState, useEffect } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button
} from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { apiFetch } from '../api';

const AdminHomePage = () => {
    const [open, setOpen] = useState(false);
    const [, setActiveTab] = useState('/admin');
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
	// Added to usestate area
	const[workOrderCount, setWorkOrderCount] = useState(0);
	
    const menuItems = [
		{ label: 'Work Order Functions', path: '/admin/workorders'},
        { label: 'Assign Work', path: '/admin/assign' },
        { label: 'View Completed Work', path: '/admin/viewwork' },
        { label: 'Company Profiles', path: '/admin/companies' },
        { label: 'Inspector Profiles', path: '/admin/inspectors' },
        { label: 'Settings (Profile)', path: '/admin/profile' },
        { label: 'Logout', path: '/admin/logout' }
    ];

    const handleLogoutClick = () => {
        setOpen(true);
        setActiveTab('/admin/logout');
    };

    const handleConfirmLogout = () => {
        setOpen(false);
        logout(); // Using the logout function from AuthContext
    };

    const handleCancelLogout = () => {
        setOpen(false);
        setActiveTab(location.pathname);
    };

    const handleItemClick = (path, label) => {
        if (label === 'Logout') {
            handleLogoutClick();
        } else {
            navigate(path);
            setActiveTab(path);
        }
    };

    const handleTitleClick = () => {
        navigate('/admin');
        setActiveTab('/admin');
    };
	
	// Block Test
	useEffect(() => {
	    apiFetch('/workorders/count')
	        .then(setWorkOrderCount)
	        .catch(err => console.error("Error fetching work orders:", err));
	}, []);

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
                        textAlign: 'center',
                        padding: '20px 0',
                    },
                }}
            >
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 'bold', 
                        marginBottom: 2,
                        cursor: 'pointer',
                        '&:hover': {
                            color: '#1976d2',
                        },
                    }}
                    onClick={handleTitleClick}
                >
                    Steve Ball & Associates
                </Typography>
                
                {user && (
                    <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                        Welcome, {user.firstName}
                    </Typography>
                )}
                
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => handleItemClick(item.path, item.label)}
                                sx={{
                                    backgroundColor: location.pathname === item.path ? '#153147' : 'inherit',
									color: location.pathname === item.path ? '#ffffff' : '1f2937',
									borderRadius: '12px',
									mx: 1,
									
										'&:hover': {
										backgroundColor:
											location.pathname === item.path
												? '#1f3b63'
												: '#e5e7eb',
									},

									'& .MuiListItemText-primary': {
									    fontWeight: location.pathname === item.path ? 600 : 400,
									    color:
									        location.pathname === item.path
									            ? '#ffffff'
									            : '#1f2937',
									},

									'& .MuiSvgIcon-root': {
									    color:
									        location.pathname === item.path
									            ? '#ffffff'
									            : '#6b7280',
									},
									}}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
			    {location.pathname === '/admin' && (
			        <Box>
			            <Typography variant="h4" sx={{ mb: 3 }}>
			                Admin Dashboard
			            </Typography>
						
						{/* Work order summary */}
			            <Box
							onClick={() => navigate('/admin/workorders')}
			                sx={{
			                    backgroundColor: "#ffffff",
			                    borderRadius: "12px",
			                    padding: "24px",
			                    width: "250px",
			                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
			                    textAlign: "center",
								cursor: "pointer",
								'&:hover': {
								    backgroundColor: "#f3f4f6",
								    transform: "scale(1.02)"
								}
			                }}
			            >
			                <Typography variant="h6">
			                    Total Work Orders
			                </Typography>

			                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#153147" }}>
			                    {workOrderCount}
			                </Typography>
			            </Box>
			        </Box>
			    )}

			    <Outlet />
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
