import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider
} from '@mui/material';
import { DownloadOutlined, CalendarToday } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from './AuthContext';

const InspectorAssignedWork = () => { 
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchWorkOrders = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`http://localhost:8080/workorders/inspector`, {
                    params: { inspectorUsername: user.username }
                });
                
                const sortedOrders = response.data.sort(
                    (a, b) => new Date(b.assignedDate) - new Date(a.assignedDate)
                );
                
                setWorkOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching work orders:', error);
                setError('Failed to load your assigned work. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkOrders();
    }, [user]);

    const handleDownload = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/workorders/download/${id}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `WorkOrder_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove(); // Clean up
        } catch (error) {
            console.error('Error downloading file:', error);
            setError('Unable to download the file. Please try again later.');
        }
    };

    // Group work orders by date
    const groupedWorkOrders = workOrders.reduce((groups, order) => {
        const date = order.assignedDate;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(order);
        return groups;
    }, {});

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }} 
            >
                Assigned Work
            </Typography>

            {Object.keys(groupedWorkOrders).length === 0 ? (
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                        You don't have any assigned work at the moment.
                    </Typography>
                </Paper>
            ) : (
                Object.keys(groupedWorkOrders)
                    .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
                    .map((date) => (
                        <Paper 
                            elevation={3} 
                            key={date} 
                            sx={{ 
                                p: 3, 
                                mb: 4,
                                borderRadius: 2 
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {new Date(date).toLocaleDateString(undefined, { 
                                        weekday: 'long',
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ mb: 2 }} />
                            
                            <Grid container spacing={2}>
                                {groupedWorkOrders[date].map((order) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 6
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 1 }}>
                                                    Work Order #{order.id}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Assigned: {new Date(order.assignedDate).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    fullWidth
                                                    startIcon={<DownloadOutlined />}
                                                    onClick={() => handleDownload(order.id)}
                                                >
                                                    Download PDF
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    ))
            )}
        </Box>
    );
};

export default InspectorAssignedWork;