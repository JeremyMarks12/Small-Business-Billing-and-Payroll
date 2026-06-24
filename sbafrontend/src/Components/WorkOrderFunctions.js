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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatDateTime, getWorkOrderWorkers, normalizeWorker } from '../model';

const WorkOrderFunctions = () => {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [orderBy, setOrderBy] = useState('workOrderID');
    const [order, setOrder] = useState('asc');
    const [error, setError] = useState('');
    const [reassignTarget, setReassignTarget] = useState(null);
    const [selectedWorkerID, setSelectedWorkerID] = useState('');

    useEffect(() => {
        Promise.all([apiFetch('/workorders'), apiFetch('/workers')])
            .then(([workOrderData, workerData]) => {
                setWorkOrders(workOrderData);
                setWorkers(workerData.map(normalizeWorker).filter(worker => !worker.isAdmin));
            })
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

    const remove = async (workOrderID) => {
        if (!window.confirm(`Delete work order #${workOrderID}? This cannot be undone.`)) return;

        try {
            setError('');
            await apiFetch(`/workorders/${workOrderID}`, { method: 'DELETE' });
            setWorkOrders(current => current.filter(order => order.workOrderID !== workOrderID));
        } catch (err) {
            setError(err.message);
        }
    };

    const openReassign = (workOrder) => {
        setReassignTarget(workOrder);
        setSelectedWorkerID(getWorkOrderWorkers(workOrder)[0]?.workerID || '');
    };

    const closeReassign = () => {
        setReassignTarget(null);
        setSelectedWorkerID('');
    };

    const reassign = async () => {
        if (!reassignTarget || !selectedWorkerID) return;

        try {
            setError('');
            const updated = await apiFetch(`/workorders/${reassignTarget.workOrderID}/assign`, {
                method: 'PUT',
                body: JSON.stringify({ workerID: Number(selectedWorkerID) }),
            });
            setWorkOrders(current => current.map(order => (
                order.workOrderID === updated.workOrderID ? updated : order
            )));
            closeReassign();
        } catch (err) {
            setError(err.message);
        }
    };

    const canViewDetails = (workOrder) => ['IN_REVIEW', 'COMPLETE'].includes(workOrder.status);

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
                                <TableCell>
                                    {canViewDetails(wo) ? (
                                        <Button
                                            size="small"
                                            onClick={() => navigate(`/admin/workorders/${wo.workOrderID}`)}
                                        >
                                            {wo.workOrderID}
                                        </Button>
                                    ) : (
                                        wo.workOrderID
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getWorkOrderWorkers(wo).map(worker => `${worker.firstName} ${worker.lastName}`).join(', ') || 'Unassigned'}
                                </TableCell>
                                <TableCell>{wo.company?.companyName || 'Unassigned'}</TableCell>
                                <TableCell><Chip label={wo.status} size="small" /></TableCell>
                                <TableCell>{formatDateTime(wo.startDateTime)}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {wo.status === 'OPEN' && <Button size="small" onClick={() => updateStatus(wo.workOrderID, 'start')}>Start</Button>}
                                        {wo.status !== 'COMPLETE' && (
                                            <Button size="small" onClick={() => openReassign(wo)}>Reassign</Button>
                                        )}
                                        {wo.status === 'IN_REVIEW' && (
                                            <>
                                                <Button size="small" onClick={() => updateStatus(wo.workOrderID, 'approve')}>Approve</Button>
                                                <Button size="small" color="warning" onClick={() => updateStatus(wo.workOrderID, 'reject')}>Reject</Button>
                                            </>
                                        )}
                                        <Button size="small" color="error" onClick={() => remove(wo.workOrderID)}>DELETE</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={Boolean(reassignTarget)} onClose={closeReassign} fullWidth maxWidth="xs">
                <DialogTitle>Reassign Work Order</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Worker</InputLabel>
                        <Select
                            value={selectedWorkerID}
                            label="Worker"
                            onChange={event => setSelectedWorkerID(event.target.value)}
                        >
                            {workers.map(worker => (
                                <MenuItem key={worker.workerID} value={worker.workerID}>
                                    {worker.firstName} {worker.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeReassign}>Cancel</Button>
                    <Button variant="contained" onClick={reassign} disabled={!selectedWorkerID}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkOrderFunctions;
