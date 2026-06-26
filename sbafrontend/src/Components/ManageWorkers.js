import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api';
import { formatDateTime, normalizeWorker, workerPayload } from '../model';
import { useAuth } from './AuthContext';

const emptyWorker = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
};

const WorkerFields = ({ form, onChange, mode }) => (
  <>
    <TextField label="First Name" name="firstName" value={form.firstName} onChange={onChange} fullWidth margin="normal" />
    <TextField label="Last Name" name="lastName" value={form.lastName} onChange={onChange} fullWidth margin="normal" />
    <TextField label="Username" name="username" value={form.username} onChange={onChange} fullWidth margin="normal" disabled={mode === 'edit'} />
    <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} fullWidth margin="normal" />
    {mode === 'create' && (
      <FormControlLabel
        control={<Checkbox name="isAdmin" checked={form.isAdmin} onChange={onChange} />}
        label="Admin"
      />
    )}
  </>
);

const ManageWorkers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workerID: routeWorkerID } = useParams();
  const [workers, setWorkers] = useState([]);
  const [workerID, setWorkerID] = useState(routeWorkerID || '');
  const [createForm, setCreateForm] = useState(emptyWorker);
  const [editForm, setEditForm] = useState(emptyWorker);
  const [password, setPassword] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingWorker, setPendingWorker] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchWorkers = useCallback(async () => {
    const data = await apiFetch('/workers');
    const normalizedWorkers = data
      .map(normalizeWorker)
      .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

    setWorkers(normalizedWorkers);
  }, []);

  useEffect(() => {
    fetchWorkers().catch(error => setSnackbar({ open: true, message: error.message, severity: 'error' }));
  }, [fetchWorkers]);

  useEffect(() => {
    if (routeWorkerID) {
      setWorkerID(routeWorkerID);
    }
  }, [routeWorkerID]);

  const selectedWorker = useMemo(
    () => workers.find(worker => worker.workerID === Number(workerID)),
    [workers, workerID]
  );

  useEffect(() => {
    if (selectedWorker) {
      setEditForm({
        firstName: selectedWorker.firstName || '',
        lastName: selectedWorker.lastName || '',
        username: selectedWorker.username || '',
        email: selectedWorker.email || '',
        password: '',
        confirmPassword: '',
        isAdmin: selectedWorker.isAdmin || false,
      });
    } else {
      setEditForm(emptyWorker);
    }

  }, [selectedWorker]);

  const handleCreateChange = (event) => {
    const { name, value, checked, type } = event.target;
    setCreateForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm(current => ({ ...current, [name]: value }));
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const requestPassword = (action, worker = null) => {
    setPendingAction(action);
    setPendingWorker(worker);
    setPassword('');
    setPasswordOpen(true);
  };

  const closePasswordDialog = () => {
    setPasswordOpen(false);
    setPassword('');
    setPendingAction(null);
    setPendingWorker(null);
  };

  const verifyPassword = () => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: user.username, password }),
  });

  const createWorker = async (event) => {
    event?.preventDefault?.();

    if (createForm.password !== createForm.confirmPassword) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    setSaving(true);
    try {
      await verifyPassword();
      await apiFetch('/workers', {
        method: 'POST',
        body: JSON.stringify(workerPayload({
          ...createForm,
          admin: createForm.isAdmin,
        })),
      });
      setCreateForm(emptyWorker);
      await fetchWorkers();
      closePasswordDialog();
      showMessage('Worker created successfully.');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateWorker = async () => {
    if (!selectedWorker) return;

    setSaving(true);
    try {
      await verifyPassword();
      await apiFetch(`/workers/${selectedWorker.workerID}`, {
        method: 'PUT',
        body: JSON.stringify({
          workerFName: editForm.firstName,
          workerLName: editForm.lastName,
          workerUser: editForm.username,
          workerEmail: editForm.email,
          admin: editForm.isAdmin,
        }),
      });
      await fetchWorkers();
      closePasswordDialog();
      showMessage('Worker updated successfully.');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const archiveWorker = async (worker) => {
    if (!worker) return;
    if (!window.confirm(`Archive ${worker.firstName} ${worker.lastName}?`)) {
      closePasswordDialog();
      return;
    }

    setSaving(true);
    try {
      await verifyPassword();
      await apiFetch(`/workers/${worker.workerID}`, { method: 'DELETE' });
      if (Number(workerID) === worker.workerID) {
        setWorkerID('');
      }
      await fetchWorkers();
      closePasswordDialog();
      showMessage('Worker archived successfully.');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const runPendingAction = () => {
    if (pendingAction === 'create') {
      createWorker();
      return;
    }
    if (pendingAction === 'update') {
      updateWorker();
      return;
    }
    if (pendingAction === 'archive') {
      archiveWorker(pendingWorker);
    }
  };

  return (
    <Box sx={{ p: 3, pb: 8 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Manage Workers</Typography>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Paper component="form" onSubmit={event => {
            event.preventDefault();
            requestPassword('create');
          }} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 2 }}>Create Worker</Typography>

            <WorkerFields form={createForm} onChange={handleCreateChange} mode="create" />

            <TextField label="Password" name="password" type="password" value={createForm.password} onChange={handleCreateChange} fullWidth margin="normal" />
            <TextField label="Confirm Password" name="confirmPassword" type="password" value={createForm.confirmPassword} onChange={handleCreateChange} fullWidth margin="normal" />

            <Button
              type="submit"
              variant="contained"
              disabled={
                saving ||
                !createForm.firstName.trim() ||
                !createForm.lastName.trim() ||
                !createForm.username.trim() ||
                !createForm.email.trim() ||
                createForm.password.length < 8 ||
                !createForm.confirmPassword
              }
              sx={{ mt: 2 }}
            >
              {saving ? 'Creating...' : 'Create'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 2 }}>Edit Worker</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Worker</InputLabel>
              <Select value={workerID} label="Worker" onChange={event => setWorkerID(event.target.value)}>
                <MenuItem value="">No worker selected</MenuItem>
                {workers.map(worker => (
                  <MenuItem key={worker.workerID} value={worker.workerID}>
                    {worker.firstName} {worker.lastName}{worker.isAdmin ? ' (Admin)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <WorkerFields form={editForm} onChange={handleEditChange} mode="edit" />

            <Button
              variant="contained"
              disabled={saving || !selectedWorker || !editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.email.trim()}
              onClick={() => requestPassword('update')}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              Save Changes
            </Button>

          </Paper>
        </Grid>

        <Grid item xs={12} sx={{ mt: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 2 }}>Workers</Typography>

            <TableContainer sx={{ maxHeight: 360, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workers.map(worker => (
                    <TableRow key={worker.workerID}>
                      <TableCell>
                        <Button size="small" onClick={() => navigate(`/admin/workers/${worker.workerID}`)}>
                          {worker.firstName} {worker.lastName}
                        </Button>
                      </TableCell>
                      <TableCell>{worker.username}</TableCell>
                      <TableCell>{worker.email}</TableCell>
                      <TableCell>{worker.isAdmin ? 'Admin' : 'Worker'}</TableCell>
                      <TableCell>{formatDateTime(worker.createdAt)}</TableCell>
                      <TableCell>{formatDateTime(worker.lastModifiedAt)}</TableCell>
                      <TableCell align="right">
                        <Button size="small" color="warning" disabled={saving} onClick={() => requestPassword('archive', worker)}>
                          Archive
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!workers.length && (
                    <TableRow>
                      <TableCell colSpan={7}>No workers found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(current => ({ ...current, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={passwordOpen} onClose={closePasswordDialog} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePasswordDialog}>Cancel</Button>
          <Button variant="contained" disabled={!password || saving} onClick={runPendingAction}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageWorkers;
