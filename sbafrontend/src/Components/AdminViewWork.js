import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardActions, CardContent,
  CircularProgress, Grid, Typography
} from '@mui/material';
import { apiFetch } from '../api';
import { formatDateTime, getWorkOrderWorkers } from '../model';

const AdminViewWork = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    apiFetch('/workorders')
      .then(data => setWorkOrders(data.filter(order => order.status === 'COMPLETE')))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (workOrderID) => {
    if (!window.confirm(`Delete completed work order #${workOrderID}?`)) return;
    try {
      await apiFetch(`/workorders/${workOrderID}`, { method: 'DELETE' });
      setWorkOrders(current => current.filter(order => order.workOrderID !== workOrderID));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Completed Work Orders</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!workOrders.length && <Alert severity="info">No completed work orders were found.</Alert>}
      <Grid container spacing={2}>
        {workOrders.map(order => (
          <Grid item xs={12} md={6} lg={4} key={order.workOrderID}>
            <Card>
              <CardContent>
                <Typography variant="h6">Work order #{order.workOrderID}</Typography>
                <Typography>{order.company?.companyName || 'No company'}</Typography>
                <Typography color="text.secondary">
                  {getWorkOrderWorkers(order).map(worker => `${worker.firstName} ${worker.lastName}`).join(', ') || 'Unassigned'}
                </Typography>
                <Typography variant="body2">Finished: {formatDateTime(order.endDateTime)}</Typography>
              </CardContent>
              <CardActions>
                <Button color="error" onClick={() => remove(order.workOrderID)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminViewWork;
