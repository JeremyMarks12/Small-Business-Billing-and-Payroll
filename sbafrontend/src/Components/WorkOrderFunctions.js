import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Chip,
    Alert,
    Button,
    Stack
} from '@mui/material';
import { apiFetch } from '../api';
import { formatDateTime, getWorkOrderWorkers } from '../model';

const WorkOrderFunctions = () => {
    const [workOrders, setWorkOrders] = useState([]);
    const [orderBy, setOrderBy] = useState('workOrderID');
    const [order, setOrder] = useState('asc');
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch('/workorders')
            .then(data => setWorkOrders(data))
            .catch(err => setError(err.message));
    }, []);

    const handleSort = (column) => {
        const isAsc = orderBy === column && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(column);
    };

    const sortedWorkOrders = [...workOrders].sort((a, b) => {
        const getValue = (workOrder) => {
            if (orderBy === 'company') return workOrder.company?.companyName || '';
            if (orderBy === 'workers') return getWorkOrderWorkers(workOrder).map(worker => worker.lastName).join(',');
            return workOrder[orderBy] ?? '';
        };
        if (getValue(a) < getValue(b)) {
            return order === 'asc' ? -1 : 1;
        }
        if (getValue(a) > getValue(b)) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const updateStatus = async (workOrderID, action) => {
        try {
            setError('');
            const updated = await apiFetch(`/workorders/${workOrderID}/${action}`, { method: 'PUT' });
            setWorkOrders(current => current.map(order => (
                order.workOrderID === workOrderID ? updated : order
            )));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Work Order Functions
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'workOrderID'}
                                    direction={orderBy === 'workOrderID' ? order : 'asc'}
                                    onClick={() => handleSort('workOrderID')}
                                >
                                    Work Order ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'workers'}
                                    direction={orderBy === 'workers' ? order : 'asc'}
                                    onClick={() => handleSort('workers')}
                                >
                                    Assigned Workers
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'company'}
                                    direction={orderBy === 'company' ? order : 'asc'}
                                    onClick={() => handleSort('company')}
                                >
                                    Company
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Started</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedWorkOrders.map((wo) => (
                            <TableRow key={wo.workOrderID}>
                                <TableCell>{wo.workOrderID}</TableCell>
                                <TableCell>
                                    {getWorkOrderWorkers(wo).map(worker => `${worker.firstName} ${worker.lastName}`).join(', ') || 'Unassigned'}
                                </TableCell>
                                <TableCell>{wo.company?.companyName || 'Unassigned'}</TableCell>
                                <TableCell><Chip label={wo.status} size="small" /></TableCell>
                                <TableCell>{formatDateTime(wo.startDateTime)}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {wo.status === 'OPEN' && <Button size="small" onClick={() => updateStatus(wo.workOrderID, 'start')}>Start</Button>}
                                        {wo.status === 'IN_REVIEW' && (
                                            <>
                                                <Button size="small" onClick={() => updateStatus(wo.workOrderID, 'approve')}>Approve</Button>
                                                <Button size="small" color="warning" onClick={() => updateStatus(wo.workOrderID, 'reject')}>Reject</Button>
                                            </>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default WorkOrderFunctions;
