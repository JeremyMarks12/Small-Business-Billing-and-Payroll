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
    TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatDateTime, getWorkOrderWorkers, normalizeWorker } from '../model';
import { useAuth } from './AuthContext';

const WorkOrderFunctions = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [workOrders, setWorkOrders] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [orderBy, setOrderBy] = useState('workOrderID');
    const [order, setOrder] = useState('asc');
    const [error, setError] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [workerID, setWorkerID] = useState('');
    const [companyID, setCompanyID] = useState('');
    const [comment, setComment] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([apiFetch('/workorders'), apiFetch('/workers'), apiFetch('/companies/all')])
            .then(([workOrderData, workerData, companyData]) => {
                setWorkOrders(workOrderData);
                setWorkers(workerData.map(normalizeWorker));
                setCompanies(companyData);
            })
            .catch(err => setError(err.message));
    }, []);

    const formatStatus = (status = '') => status.replaceAll('_', ' ');

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

    const closeCreateDialog = () => {
        setCreateOpen(false);
        setWorkerID('');
        setCompanyID('');
        setComment('');
    };

    const createWorkOrder = async () => {
        const worker = workers.find(item => item.workerID === Number(workerID));
        const company = companies.find(item => item.companyID === Number(companyID));

        setSaving(true);
        setError('');
        try {
            const created = await apiFetch('/workorders', {
                method: 'POST',
                body: JSON.stringify({
                    workers: worker ? [{
                        workerID: worker.workerID,
                        workerFName: worker.firstName,
                        workerLName: worker.lastName,
                        workerUser: worker.username,
                        admin: worker.isAdmin,
                    }] : [],
                    company: company || null,
                    comment: comment.trim(),
                }),
            });
            setWorkOrders(current => [...current, created]);
            closeCreateDialog();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const openWorkOrder = (workOrder) => {
        const assignedToUser = getWorkOrderWorkers(workOrder).some(worker => worker.workerID === user?.workerID);
        if (assignedToUser && workOrder.status === 'IN_PROCESS') {
            navigate(`/admin/my-workorders/${workOrder.workOrderID}`);
            return;
        }

        navigate(`/admin/workorders/${workOrder.workOrderID}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    View Work Orders
                </Typography>
                <Button variant="contained" onClick={() => setCreateOpen(true)}>Create Work Order</Button>
            </Box>
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
                            <TableCell>Start</TableCell>
                            <TableCell>Close</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedWorkOrders.map((wo) => (
                            <TableRow key={wo.workOrderID}>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => openWorkOrder(wo)}
                                    >
                                        {wo.workOrderID}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {getWorkOrderWorkers(wo).map(worker => `${worker.firstName} ${worker.lastName}`).join(', ') || 'Unassigned'}
                                </TableCell>
                                <TableCell>{wo.company?.companyName || 'Unassigned'}</TableCell>
                                <TableCell><Chip label={formatStatus(wo.status)} size="small" /></TableCell>
                                <TableCell>{formatDateTime(wo.startDateTime)}</TableCell>
                                <TableCell>{formatDateTime(wo.endDateTime)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={createOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
                <DialogTitle>Create Work Order</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Worker or Admin</InputLabel>
                        <Select value={workerID} label="Worker or Admin" onChange={event => setWorkerID(event.target.value)}>
                            <MenuItem value="">No worker selected</MenuItem>
                            {workers.map(worker => (
                                <MenuItem key={worker.workerID} value={worker.workerID}>
                                    {worker.firstName} {worker.lastName}{worker.isAdmin ? ' (Admin)' : ''}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Company</InputLabel>
                        <Select value={companyID} label="Company" onChange={event => setCompanyID(event.target.value)}>
                            <MenuItem value="">No company selected</MenuItem>
                            {companies.map(company => (
                                <MenuItem key={company.companyID} value={company.companyID}>{company.companyName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Comments"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        fullWidth
                        multiline
                        minRows={4}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreateDialog}>Cancel</Button>
                    <Button variant="contained" onClick={createWorkOrder} disabled={saving}>
                        Create Work Order
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default WorkOrderFunctions;
