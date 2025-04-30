import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, CircularProgress, Alert, Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const AdminBillingPage = () => {
  const [loading, setLoading] = useState(true);
  const [inspectors, setInspectors] = useState([]);
  const [selectedInspector, setSelectedInspector] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [completedWorkOrders, setCompletedWorkOrders] = useState([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const [error, setError] = useState(null);
  const [netPay, setNetPay] = useState(0);
  const [totalSBACost, setTotalSBACost] = useState(0);
  const [inspectorPay, setInspectorPay] = useState(0);

  // Load inspectors and work orders on component mount
  useEffect(() => {
    fetchInspectors();
    fetchCompletedWorkOrders();
  }, []);

  // Filter work orders when criteria change
  useEffect(() => {
    filterWorkOrders();
  }, [selectedInspector, startDate, endDate, completedWorkOrders]);

  // Calculate totals when filtered work orders change
  useEffect(() => {
    calculateTotals();
  }, [filteredWorkOrders]);

  const fetchInspectors = async () => {
    try {
      const response = await fetch('http://localhost:8080/worker/getAll');
      if (!response.ok) {
        throw new Error('Failed to fetch inspectors');
      }
      
      const data = await response.json();
      
      // Filter out admin accounts
      const inspectorsOnly = data.filter(worker => !worker.admin && !worker.isAdmin);
      
      // Sort inspectors alphabetically by firstName then lastName
      const sortedInspectors = inspectorsOnly.sort((a, b) => {
        const firstNameComparison = a.firstName.localeCompare(b.firstName);
        if (firstNameComparison === 0) {
          return a.lastName.localeCompare(b.lastName);
        }
        return firstNameComparison;
      });
      
      setInspectors(sortedInspectors);
    } catch (error) {
      console.error('Error fetching inspectors:', error);
      setError('Failed to load inspectors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedWorkOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/worker/getwoitems');
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }
      
      const data = await response.json();
      
      // Process data to ensure all numeric fields are properly formatted
      const processedData = data.map(order => {
        const myPrice = Number(order.myPrice) || 0;
        const sbaCost = Number(order.sBATotal) || 0;
        
        return {
          ...order,
          myPrice: myPrice,
          sBATotal: sbaCost,
          // Calculate inspector pay as myPrice - sBATotal
          inspectorPay: myPrice - sbaCost
        };
      });
      
      // Sort by date (newest first)
      const sortedData = processedData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      setCompletedWorkOrders(sortedData);
    } catch (error) {
      console.error('Error fetching completed work orders:', error);
      setError('Failed to load completed work orders. Please try again later.');
    }
  };

  const filterWorkOrders = () => {
    if (!completedWorkOrders.length) return;

    let filtered = [...completedWorkOrders];

    // Filter by inspector (name field matches firstName + lastName)
    if (selectedInspector) {
      filtered = filtered.filter(order => order.name === selectedInspector);
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = startDate.startOf('day');
      const end = endDate.endOf('day');
      
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.date);
        return orderDate.isAfter(start) && orderDate.isBefore(end);
      });
    }

    // Always sort by date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredWorkOrders(filtered);
  };

  const calculateTotals = () => {
    // Calculate net pay (myPrice)
    const totalNetPay = filteredWorkOrders.reduce((sum, order) => sum + (Number(order.myPrice) || 0), 0);
    setNetPay(totalNetPay);
    
    // Calculate total SBA cost
    const totalSBACost = filteredWorkOrders.reduce((sum, order) => sum + (Number(order.sBATotal) || 0), 0);
    setTotalSBACost(totalSBACost);
    
    // Calculate inspector pay (Net Pay - SBA cost)
    setInspectorPay(totalNetPay - totalSBACost);
  };

  const handleInspectorChange = (event) => {
    setSelectedInspector(event.target.value);
  };

  const resetFilters = () => {
    setSelectedInspector('');
    setStartDate(null);
    setEndDate(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Compute inspector names for dropdown
  const inspectorNames = inspectors.map(inspector => 
    `${inspector.firstName} ${inspector.lastName}`
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Inspector Pay Calculation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {/* Filter Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
        
        <Grid container spacing={3} alignItems="center">
          {/* Inspector Dropdown */}
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Select Inspector"
              value={selectedInspector}
              onChange={handleInspectorChange}
              variant="outlined"
            >
              <MenuItem value="">All Inspectors</MenuItem>
              {inspectorNames.map((name, index) => (
                <MenuItem key={index} value={name}>{name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date Range Pickers */}
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{
                  textField: { fullWidth: true, variant: 'outlined' }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{
                  textField: { fullWidth: true, variant: 'outlined' }
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Reset Button */}
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={resetFilters}
              sx={{ height: '56px' }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Results</Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'right', mb: 1 }}>
              Net Pay: <strong>{formatCurrency(netPay)}</strong>
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'right', mb: 1 }}>
              SBA Cost: <strong>{formatCurrency(totalSBACost)}</strong>
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              {selectedInspector ? `${selectedInspector}'s Pay` : 'Inspector Pay'}: <strong>{formatCurrency(inspectorPay)}</strong>
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {filteredWorkOrders.length === 0 ? (
          <Alert severity="info">No work orders match the selected criteria.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 440, maxWidth: '100%', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Inspector</TableCell>
                  <TableCell>File Number</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell align="right">Net Pay</TableCell>
                  <TableCell align="right">SBA Cost</TableCell>
                  <TableCell align="right">Inspector Pay</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkOrders.map((order) => {
                  // Calculate inspector pay as Net Pay - SBA cost
                  const inspectorPay = (Number(order.myPrice) || 0) - (Number(order.sBATotal) || 0);
                  
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.fileNumber}</TableCell>
                      <TableCell>{order.company}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.assessment === "Yes" ? "Assessment" : "Plat"}</TableCell>
                      <TableCell>{order.comments}</TableCell>
                      <TableCell align="right">{formatCurrency(Number(order.myPrice) || 0)}</TableCell>
                      <TableCell align="right">{formatCurrency(Number(order.sBATotal) || 0)}</TableCell>
                      <TableCell align="right">{formatCurrency(inspectorPay)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminBillingPage;