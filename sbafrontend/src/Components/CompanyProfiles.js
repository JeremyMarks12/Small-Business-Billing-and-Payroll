import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, Snackbar, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from './AuthContext';

const CompanyProfiles = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:8080/companies/all');
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      
      // Sort companies alphabetically by name
      const sortedCompanies = data.sort((a, b) => a.companyName.localeCompare(b.companyName));
      
      setCompanies(sortedCompanies);
    } catch (err) {
      console.error('Error fetching companies:', err);
      handleSnackbar('Error fetching companies', 'error');
    }
  };

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
      const response = await fetch('http://localhost:8080/worker/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: user.username, 
          password: passwordConfirm 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        setPasswordError('Incorrect password');
        return false;
      }
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
      const response = await fetch('http://localhost:8080/companies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm),
      });

      if (!response.ok) throw new Error('Failed to add company');

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
      const response = await fetch(`http://localhost:8080/companies/${selectedCompany.companyID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm),
      });

      if (!response.ok) throw new Error('Failed to update company');

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
      const response = await fetch(`http://localhost:8080/companies/${selectedCompany.companyID}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete company');

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
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Company Profiles
      </Typography>
      <Grid container spacing={2}>
        {companies.map((company) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={company.companyID}>
            <Paper
              elevation={3}
              sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleOpenViewDialog(company)}
            >
              {company.companyName}
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Paper
            elevation={3}
            sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
            onClick={handleOpenAddDialog}
          >
            <AddIcon fontSize="large" />
          </Paper>
        </Grid>
      </Grid>

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