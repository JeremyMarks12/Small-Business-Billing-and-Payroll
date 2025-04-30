import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer, List, ListItem, ListItemButton, ListItemText, Box,
    Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControlLabel, Checkbox, Snackbar, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const InspectorBillingPage = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname);

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const fullName = loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : '';

    const [name, setName] = useState(fullName);
    const [fileNumber, setFileNumber] = useState('');
    const [price, setPrice] = useState('');
    const [sBATotal, setSBATotal] = useState('');
    const [assessmentChecked, setAssessmentChecked] = useState(false);
    const [platChecked, setPlatChecked] = useState(false);
    const [comment, setComment] = useState('');
    const [address, setAddress] = useState('');
    const [date, setDate] = useState(null);

    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [showSnackbar, setShowSnackbar] = useState(false);

    const sidebarItems = [
        { label: 'View Assigned Work', path: '/worker/assigned' },
        { label: 'Billing', path: '/worker/billing' },
        { label: 'Profile', path: '/worker/profile' },
        { label: 'Logout', path: '/logout' },
    ];

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:8080/worker/getcompanies');
                const data = await response.json();
                setCompanies(data);
                if (data.length > 0) {
                    setSelectedCompany(data[0].name);
                }
            } catch (error) {
                console.error('Error retrieving data for companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const handleLogoutClick = () => {
        setOpen(true);
        setActiveTab('/worker/logout');
    };

    const handleConfirmLogout = () => {
        setOpen(false);
        navigate('/');
        alert('You have been logged out successfully.');
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
        }
    };

    const handleAssessmentChange = (event) => {
        setAssessmentChecked(event.target.checked);
        if (event.target.checked) {
            setPlatChecked(false);
        }
    };

    const handlePlatChange = (event) => {
        setPlatChecked(event.target.checked);
        if (event.target.checked) {
            setAssessmentChecked(false);
        }
    };

    const handleBillingSubmission = async () => {
        if (!price || !sBATotal || !comment || !address || !date || !fileNumber || (!assessmentChecked && !platChecked)) {
            alert('Please fill out all required fields.');
            return;
        }

        const billingData = {
            name: fullName,
            company: selectedCompany,
            fileNumber: fileNumber,
            myPrice: parseFloat(price),
            sbatotal: sBATotal ? parseFloat(sBATotal) : 0,
            assessment: assessmentChecked ? "Yes" : "No",
            plat: platChecked ? 1 : 0,
            comments: comment,
            address: address,
            date: date.format('YYYY-MM-DD'),
        };

        try {
            const response = await fetch('http://localhost:8080/worker/postbilling', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(billingData),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Form submitted successfully:', data);
                setShowSnackbar(true);

                setFileNumber('');
                setPrice('');
                setSBATotal('');
                setAssessmentChecked(false);
                setPlatChecked(false);
                setComment('');
                setAddress('');
                setDate(null);
            } else {
                console.log('Form submission failure:', data);
            }
        } catch (error) {
            console.error('Error saving billing form:', error);
        }
    };

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
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Steve Ball & Associates
                </Typography>
                <List>
                    {sidebarItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => handleItemClick(item.path, item.label)}
                                sx={{
                                    backgroundColor: activeTab === item.path ? '#bbdefb' : 'inherit'
                                }}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Enter Billing Information
                </Typography>

                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <Typography>Select the company:</Typography>
                <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    required
                >
                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>

                <Typography>File Number:</Typography>
                <TextField
                    label="File Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={fileNumber}
                    required
                    onChange={(e) => setFileNumber(e.target.value)}
                />

                <TextField
                    label="Price"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={price}
                    required
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                    label="SBA Total"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sBATotal}
                    required
                    onChange={(e) => setSBATotal(e.target.value)}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <FormControlLabel
                        control={<Checkbox checked={assessmentChecked} onChange={handleAssessmentChange} />}
                        label="Assessment"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={platChecked} onChange={handlePlatChange} />}
                        label="Plat"
                    />
                </Box>

                <TextField
                    label="Comments"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={comment}
                    required
                    onChange={(e) => setComment(e.target.value)}
                />
                <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                />

                <Typography>Date:</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        required
                        format="YYYY-MM-DD"
                    />
                </LocalizationProvider>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleBillingSubmission}
                >
                    Submit
                </Button>
            </Box>

            <Dialog open={open} onClose={handleCancelLogout}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>Are you sure you want to log out?</DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="primary">No</Button>
                    <Button onClick={handleConfirmLogout} color="primary" autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Work order submitted successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InspectorBillingPage;
