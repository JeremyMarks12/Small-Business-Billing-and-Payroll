import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const InspectorAssignedWork = () => { 
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const inspectorUsername = localStorage.getItem('username'); 

                const response = await axios.get(`http://localhost:8080/workorders/inspector`, {
                    params: { inspectorUsername }
                });
                const sortedOrders = response.data.sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate));
                setWorkOrders(sortedOrders);
            } catch (error) {
                console.error('Error fetching work orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkOrders();
    }, []);

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
        } catch (error) {
            console.error('Error downloading file:', error);
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3, overflowY: 'auto', height: '100%' }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: 'center', marginBottom: 4 }} 
            >
                Assigned Work
            </Typography>

            {Object.keys(groupedWorkOrders).map((date) => (
                <Box key={date} sx={{ marginBottom: 5 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {new Date(date).toLocaleDateString()}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 2,
                        paddingBottom: 1,
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '4px',
                        },
                    }}>
                        {groupedWorkOrders[date].map((order) => (
                            <Box
                                key={order.id}
                                sx={{
                                    minWidth: 150,
                                    height: 180,
                                    border: '1px solid #ccc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    PDF #{order.id}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleDownload(order.id)}
                                >
                                    Download
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default InspectorAssignedWork;

