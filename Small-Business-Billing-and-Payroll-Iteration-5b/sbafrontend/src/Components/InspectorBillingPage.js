import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, FormControlLabel, Checkbox, 
  Snackbar, Alert, Paper, Grid, CircularProgress, MenuItem, 
  FormControl, FormHelperText, InputLabel, Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useAuth } from './AuthContext';

const InspectorBillingPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    fileNumber: '',
    myPrice: '',
    sBATotal: '',
    assessmentChecked: false,
    platChecked: false,
    comments: '',
    address: '',
    date: null
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`
      }));
    }
    
    fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/companies/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      const data = await response.json();
      
      // Sort companies alphabetically
      const sortedCompanies = data.sort((a, b) => a.name.localeCompare(b.name));
      
      setCompanies(sortedCompanies);
      if (sortedCompanies.length > 0) {
        setSelectedCompany(sortedCompanies[0].name);
      }
    } catch (error) {
      console.error('Error retrieving companies:', error);
      showSnackbarMessage('Failed to load companies. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleAssessmentChange = (event) => {
    setFormData({
      ...formData,
      assessmentChecked: event.target.checked,
      platChecked: event.target.checked ? false : formData.platChecked
    });
    
    if (errors.assessment) {
      setErrors({
        ...errors,
        assessment: null
      });
    }
  };

  const handlePlatChange = (event) => {
    setFormData({
      ...formData,
      platChecked: event.target.checked,
      assessmentChecked: event.target.checked ? false : formData.assessmentChecked
    });
    
    if (errors.assessment) {
      setErrors({
        ...errors,
        assessment: null
      });
    }
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });
    
    if (errors.date) {
      setErrors({
        ...errors,
        date: null
      });
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fileNumber) newErrors.fileNumber = 'File number is required';
    if (!formData.myPrice) newErrors.myPrice = 'Price is required';
    if (!formData.sBATotal) newErrors.sBATotal = 'SBA Total is required';
    if (!formData.comments) newErrors.comments = 'Comments are required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.assessmentChecked && !formData.platChecked) {
      newErrors.assessment = 'Please select either Assessment or Plat';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBillingSubmission = async () => {
    if (!validateForm()) {
      showSnackbarMessage('Please fill out all required fields', 'error');
      return;
    }

    const billingData = {
      name: formData.name,
      company: selectedCompany,
      fileNumber: formData.fileNumber,
      myPrice: parseFloat(formData.myPrice),
      sBATotal: parseFloat(formData.sBATotal),
      assessment: formData.assessmentChecked ? "Yes" : "No",
      plat: formData.platChecked ? 1 : 0,
      comments: formData.comments,
      address: formData.address,
      date: formData.date.format('YYYY-MM-DD'),
    };

    try {
      const response = await fetch('http://localhost:8080/worker/postbilling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billingData),
      });
      
      if (response.ok) {
        // Reset form fields except name
        setFormData({
          ...formData,
          fileNumber: '',
          myPrice: '',
          sBATotal: '',
          assessmentChecked: false,
          platChecked: false,
          comments: '',
          address: '',
          date: null
        });
        
        showSnackbarMessage('Work order submitted successfully!');
      } else {
        console.error('Form submission failed:', response.statusText);
        showSnackbarMessage('Failed to submit work order. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving billing form:', error);
      showSnackbarMessage('Error submitting work order. Please try again later.', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Enter Billing Information
      </Typography>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.name}
              disabled
            />
          </Grid>

          {/* Company Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="company-select-label">Company</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                value={selectedCompany}
                onChange={handleCompanyChange}
                label="Company"
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.name}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* File Number */}
          <Grid item xs={12} md={6}>
            <TextField
              label="File Number"
              name="fileNumber"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.fileNumber}
              onChange={handleInputChange}
              error={!!errors.fileNumber}
              helperText={errors.fileNumber}
              required
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date,
                      required: true
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          {/* Price (myPrice) */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              name="myPrice"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.myPrice}
              onChange={handleInputChange}
              error={!!errors.myPrice}
              helperText={errors.myPrice}
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          {/* SBA Total */}
          <Grid item xs={12} md={6}>
            <TextField
              label="SBA Total"
              name="sBATotal"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.sBATotal}
              onChange={handleInputChange}
              error={!!errors.sBATotal}
              helperText={errors.sBATotal}
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>

          {/* Assessment/Plat Checkboxes */}
          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mt: 2,
                border: errors.assessment ? '1px solid #d32f2f' : 'none',
                p: errors.assessment ? 1 : 0,
                borderRadius: 1
              }}
            >
              <FormControlLabel
                control={<Checkbox checked={formData.assessmentChecked} onChange={handleAssessmentChange} />}
                label="Assessment"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.platChecked} onChange={handlePlatChange} />}
                label="Plat"
              />
            </Box>
            {errors.assessment && (
              <FormHelperText error>{errors.assessment}</FormHelperText>
            )}
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.address}
              onChange={handleInputChange}
              error={!!errors.address}
              helperText={errors.address}
              required
            />
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              label="Comments"
              name="comments"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.comments}
              onChange={handleInputChange}
              error={!!errors.comments}
              helperText={errors.comments}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              onClick={handleBillingSubmission}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InspectorBillingPage;