import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AssignWork = () => {
  const [inspectors, setInspectors] = useState([]);
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [assignedDate, setAssignedDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const SYSTEM_ADMIN_USERNAME = "admin";

  useEffect(() => {
    fetchInspectors();
  }, []);

  const fetchInspectors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/worker/getAll');
      const data = await response.json();
      
      
      const inspectorsOnly = data.filter(worker => {
        const isAdminValue = String(worker.isAdmin).toLowerCase();
        return isAdminValue !== 'true' && isAdminValue !== '1';
      });
  
      
      const sortedInspectors = inspectorsOnly.sort((a, b) => {
        const firstNameComparison = a.firstName.localeCompare(b.firstName);
        return firstNameComparison === 0
          ? a.lastName.localeCompare(b.lastName)
          : firstNameComparison;
      });
  
      setInspectors(sortedInspectors);
    } catch (error) {
      console.error('Error fetching inspectors:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleInspectorClick = (inspector) => {
    setSelectedInspector(inspector);
    setAssignedDate(null);
    setSelectedFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInspector(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!assignedDate || !selectedFile) {
      alert('Please select a file and a date.');
      return;
    }

    const formData = new FormData();
    formData.append('inspectorUsername', selectedInspector.username);
    formData.append('assignedDate', assignedDate.format('YYYY-MM-DD'));
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8080/workorders/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Work order assigned successfully!');
        handleCloseDialog();
      } else {
        alert('Error assigning work order.');
      }
    } catch (error) {
      console.error('Error uploading work order:', error);
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
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        Assign Work
      </Typography>

      <Grid container spacing={3}>
        {inspectors
          .filter(worker => (worker.isAdmin === false || worker.isAdmin === "false") && worker.username !== SYSTEM_ADMIN_USERNAME)
          .map((inspector) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={inspector.workerID}>
              <Paper
                elevation={3}
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '&:hover': { backgroundColor: '#f0f0f0' }
                }}
                onClick={() => handleInspectorClick(inspector)}
              >
                <Typography>{inspector.firstName} {inspector.lastName}</Typography>
              </Paper>
            </Grid>
          ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedInspector ? `Assign Work to ${selectedInspector.firstName} ${selectedInspector.lastName}` : ''}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please Attach File Below:
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            fullWidth
            sx={{ mb: 3 }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Button>

          {selectedFile && (
            <Typography variant="caption" sx={{ display: 'block', mb: 3, textAlign: 'center' }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}

          <Typography variant="body1" sx={{ mb: 2 }}>
            Please Enter Date:
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={assignedDate}
              onChange={(newValue) => setAssignedDate(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ color: 'blue', textDecoration: 'underline' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!selectedFile || !assignedDate}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignWork;