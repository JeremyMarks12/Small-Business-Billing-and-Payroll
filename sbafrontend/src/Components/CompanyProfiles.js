import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, Snackbar
} from '@mui/material';
import { useAuth } from './AuthContext';
import { apiFetch } from '../api';

const CompanyProfiles = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [orderBy, setOrderBy] = useState('companyName');
  const [order, setOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: ''
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await apiFetch('/companies/all');
      
      // Sort companies alphabetically by name
      const sortedCompanies = data.sort((a, b) => a.companyName.localeCompare(b.companyName));
      
      setCompanies(sortedCompanies);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setSnackbar({ open: true, message: 'Error fetching companies', severity: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOpenAddDialog = () => {
    setCompanyForm({
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: ''
    });
    setEditMode(false);
    setPasswordConfirm('');
    setPasswordError('');
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (company) => {
    setSelectedCompany(company);
    setCompanyForm({
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      companyPhone: company.companyPhone,
      companyEmail: company.companyEmail
    });
    setEditMode(false);
    setPasswordConfirm('');
    setPasswordError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
    setCompanyForm({
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: ''
    });
    setEditMode(false);
    setPasswordConfirm('');
    setPasswordError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordConfirm(e.target.value);
    setPasswordError('');
  };

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const verifyPassword = async () => {
    if (!passwordConfirm) {
      setPasswordError('Please enter your password');
      return false;
    }

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          username: user.username, 
          password: passwordConfirm 
        }),
      });
      return true;
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('Error verifying password');
      return false;
    }
  };

  const handleSave = async () => {
    if (!await verifyPassword()) {
      return;
    }

    try {
      await apiFetch('/companies/add', {
        method: 'POST',
        body: JSON.stringify(companyForm),
      });

      handleCloseDialog();
      fetchCompanies();
      handleSnackbar('Company added successfully');
    } catch (err) {
      console.error('Error saving company:', err);
      handleSnackbar('Error saving company', 'error');
    }
  };

  const handleEditClick = async () => {
    if (!await verifyPassword()) {
      return;
    }
    setEditMode(true);
  };

  const handleUpdate = async () => {
    if (!await verifyPassword()) {
      return;
    }

    try {
      await apiFetch(`/companies/${selectedCompany.companyID}`, {
        method: 'PUT',
        body: JSON.stringify(companyForm),
      });

      handleCloseDialog();
      fetchCompanies();
      handleSnackbar('Company updated successfully');
    } catch (err) {
      console.error('Error updating company:', err);
      handleSnackbar('Error updating company', 'error');
    }
  };

  const handleDelete = async () => {
    if (!await verifyPassword()) {
      return;
    }

    try {
      await apiFetch(`/companies/${selectedCompany.companyID}`, {
        method: 'DELETE',
      });

      handleCloseDialog();
      fetchCompanies();
      handleSnackbar('Company deleted successfully');
    } catch (err) {
      console.error('Error deleting company:', err);
      handleSnackbar('Error deleting company', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Company Profiles
        </Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>Add Company</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'companyName'}
                  direction={orderBy === 'companyName' ? order : 'asc'}
                  onClick={() => handleSort('companyName')}
                >
                  Company
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'companyAddress'}
                  direction={orderBy === 'companyAddress' ? order : 'asc'}
                  onClick={() => handleSort('companyAddress')}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'companyPhone'}
                  direction={orderBy === 'companyPhone' ? order : 'asc'}
                  onClick={() => handleSort('companyPhone')}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'companyEmail'}
                  direction={orderBy === 'companyEmail' ? order : 'asc'}
                  onClick={() => handleSort('companyEmail')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCompanies.map(company => (
              <TableRow key={company.companyID}>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenViewDialog(company)}>
                    {company.companyName}
                  </Button>
                </TableCell>
                <TableCell>{company.companyAddress || 'Not set'}</TableCell>
                <TableCell>{company.companyPhone || 'Not set'}</TableCell>
                <TableCell>{company.companyEmail || 'Not set'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedCompany ? (editMode ? "Edit Company" : "Company Details") : "Add New Company"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Company Name"
            name="companyName"
            value={companyForm.companyName}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
          <TextField
            label="Address"
            name="companyAddress"
            value={companyForm.companyAddress}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
          <TextField
            label="Phone Number"
            name="companyPhone"
            value={companyForm.companyPhone}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
          <TextField
            label="Email"
            name="companyEmail"
            value={companyForm.companyEmail}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
          
          {/* Password field for verification - always shown when viewing details */}
          {selectedCompany && !editMode && (
            <TextField
              label="Enter Your Password"
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordChange}
              fullWidth
              margin="dense"
              required
              error={!!passwordError}
              helperText={passwordError || "Enter your password to make changes"}
              sx={{ mt: 2 }}
            />
          )}
          
          {/* Password field for add/edit mode */}
          {(editMode || !selectedCompany) && (
            <TextField
              label="Enter Your Password to Confirm"
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordChange}
              fullWidth
              margin="dense"
              required
              error={!!passwordError}
              helperText={passwordError}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          {selectedCompany && !editMode && (
            <>
              <Button onClick={handleEditClick} variant="contained" color="primary">
                Edit
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </>
          )}
          {editMode && selectedCompany && (
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Save Changes
            </Button>
          )}
          {!selectedCompany && (
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyProfiles;
