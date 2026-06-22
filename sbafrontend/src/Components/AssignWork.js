import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, FormControl, InputLabel,
  MenuItem, Paper, Select, TextField, Typography
} from '@mui/material';
import { apiFetch } from '../api';
import { normalizeWorker } from '../model';

const AssignWork = () => {
  const [workers, setWorkers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [workerID, setWorkerID] = useState('');
  const [companyID, setCompanyID] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([apiFetch('/workers'), apiFetch('/companies/all')])
      .then(([workerData, companyData]) => {
        setWorkers(workerData.map(normalizeWorker).filter(worker => !worker.isAdmin));
        setCompanies(companyData);
      })
      .catch(error => setMessage({ severity: 'error', text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const worker = workers.find(item => item.workerID === Number(workerID));
    const company = companies.find(item => item.companyID === Number(companyID));
    if (!worker || !company) return;

    setSaving(true);
    setMessage(null);
    try {
      const created = await apiFetch('/workorders', {
        method: 'POST',
        body: JSON.stringify({
          workers: [{
            workerID: worker.workerID,
            workerFName: worker.firstName,
            workerLName: worker.lastName,
            workerUser: worker.username,
            admin: worker.isAdmin,
          }],
          company,
          comment: comment.trim(),
        }),
      });
      setMessage({ severity: 'success', text: `Work order #${created.workOrderID} created.` });
      setWorkerID('');
      setCompanyID('');
      setComment('');
    } catch (error) {
      setMessage({ severity: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Assign Work</Typography>
      {message && <Alert severity={message.severity} sx={{ mb: 2 }}>{message.text}</Alert>}
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 700 }}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Inspector</InputLabel>
          <Select value={workerID} label="Inspector" onChange={event => setWorkerID(event.target.value)}>
            {workers.map(worker => (
              <MenuItem key={worker.workerID} value={worker.workerID}>
                {worker.firstName} {worker.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Company</InputLabel>
          <Select value={companyID} label="Company" onChange={event => setCompanyID(event.target.value)}>
            {companies.map(company => (
              <MenuItem key={company.companyID} value={company.companyID}>{company.companyName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Assignment notes"
          value={comment}
          onChange={event => setComment(event.target.value)}
          fullWidth
          multiline
          minRows={4}
          margin="normal"
        />
        <Alert severity="info" sx={{ my: 2 }}>
          PDF attachment is not shown because the current backend document controller has no upload endpoint.
        </Alert>
        <Button type="submit" variant="contained" disabled={saving || !workerID || !companyID}>
          {saving ? 'Creating…' : 'Create work order'}
        </Button>
      </Paper>
    </Box>
  );
};

export default AssignWork;
