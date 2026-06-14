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
    TableSortLabel
} from '@mui/material';

const WorkOrderFunctions = () => {
    const [workOrders, setWorkOrders] = useState([]);
    const [orderBy, setOrderBy] = useState('workOrderID');
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        fetch("http://localhost:8080/workorders")
            .then(res => res.json())
            .then(data => setWorkOrders(data))
            .catch(err => console.error("Error fetching work orders:", err));
    }, []);

    const handleSort = (column) => {
        const isAsc = orderBy === column && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(column);
    };

    const sortedWorkOrders = [...workOrders].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Work Order Functions
            </Typography>

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
                                    active={orderBy === 'workerID'}
                                    direction={orderBy === 'workerID' ? order : 'asc'}
                                    onClick={() => handleSort('workerID')}
                                >
                                    Worker ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'companyID'}
                                    direction={orderBy === 'companyID' ? order : 'asc'}
                                    onClick={() => handleSort('companyID')}
                                >
                                    Company ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'workOrderPDF'}
                                    direction={orderBy === 'workOrderPDF' ? order : 'asc'}
                                    onClick={() => handleSort('workOrderPDF')}
                                >
                                    Work Order PDF
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedWorkOrders.map((wo) => (
                            <TableRow key={wo.workOrderID}>
                                <TableCell>{wo.workOrderID}</TableCell>
                                <TableCell>{wo.workerID}</TableCell>
                                <TableCell>{wo.companyID}</TableCell>
                                <TableCell>{wo.workOrderPDF || "No PDF"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default WorkOrderFunctions;