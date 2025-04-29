import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CompanyProfiles = () => {
  const [companies, setCompanies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    address: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:8080/companies/all');
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleOpenAddDialog = () => {
    setCompanyForm({ name: '', address: '', phoneNumber: '' });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (company) => {
    setSelectedCompany(company);
    setCompanyForm({
      name: company.name,
      address: company.address,
      phoneNumber: company.phoneNumber
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
    setCompanyForm({ name: '', address: '', phoneNumber: '' });
    setEditMode(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8080/companies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm),
      });

      if (!response.ok) throw new Error('Failed to add company');

      handleCloseDialog();
      fetchCompanies();
    } catch (err) {
      console.error('Error saving company:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/companies/${selectedCompany.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm),
      });

      if (!response.ok) throw new Error('Failed to update company');

      handleCloseDialog();
      fetchCompanies();
    } catch (err) {
      console.error('Error updating company:', err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this company?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8080/companies/${selectedCompany.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete company');

      handleCloseDialog();
      fetchCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Company Profiles
      </Typography>
      <Grid container spacing={2}>
        {companies.map((company) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={company.id}>
            <Paper
              elevation={3}
              sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleOpenViewDialog(company)}
            >
              {company.name}
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
            name="name"
            value={companyForm.name}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
          <TextField
            label="Address"
            name="address"
            value={companyForm.address}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={companyForm.phoneNumber}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            disabled={!editMode && selectedCompany}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'blue', textDecoration: 'underline' }}>
            Cancel
          </Button>
          {selectedCompany && !editMode && (
            <>
              <Button onClick={() => setEditMode(true)} sx={{ color: 'blue', textDecoration: 'underline' }}>
                Edit
              </Button>
              <Button onClick={handleDelete} sx={{ color: 'blue', textDecoration: 'underline' }}>
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
    </Box>
  );
};

export default CompanyProfiles;





