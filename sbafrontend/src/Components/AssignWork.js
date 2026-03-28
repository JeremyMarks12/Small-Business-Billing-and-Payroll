import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, CircularProgress,
  TextField
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';

const AssignWork = () => {
  const [inspectors, setInspectors] = useState([]);
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [assignedDate, setAssignedDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define system admin username - this account won't be displayed
  const SYSTEM_ADMIN_USERNAME = "admin"; // Replace with your actual system admin username if different

  useEffect(() => {
    fetchInspectors();
  }, []);
  
  //Normalize worker to automatically route database IDs
  const normalizeWorker = (worker) => ({
	workerID: worker.workID ?? worker.workerid,
	firstName: worker.firstName ?? worker.workerFName?? worker.workerfname ?? '',
	lastName: worker.lastName ?? worker.workerLName ?? worker.workerlname ?? '',
	username: worker.username ?? worker.workerUser ?? worker.worker_user ?? '',
	admin: worker.admin ?? worker.isAdmin ?? worker.is_admin ?? false,
  });

  const fetchInspectors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/workers');
      const data = await response.json();
	  console.log("assignWork data:", data);	//New
	  
	  // map normalizeWorkers with normalizedWorkers
	  const normalizedWorkers = data.map(normalizeWorker);
	  console.log('assignWork normalized data:', normalizedWorkers);
	  
	  const inspectorsOnly = normalizedWorkers.filter(
		(worker) => worker.admin === false && worker.username !== SYSTEM_ADMIN_USERNAME
		);
      
      // Sort inspectors alphabetically by firstName then lastName
      const sortedInspectors = inspectorsOnly.sort((a, b) => {
        // First compare by firstName
        const firstNameComparison = a.firstName.localeCompare(b.firstName);
        
        // If firstNames are the same, compare by lastName
        if (firstNameComparison === 0) {
          return a.lastName.localeCompare(b.lastName);
        }
        
        return firstNameComparison;
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

      <Grid container spacing={2}>
        {inspectors.map((inspector) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={inspector.workerID}>
            <Paper
              elevation={3}
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                cursor: 'pointer',
                height: '100%',
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

      {/* Dialog */}
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