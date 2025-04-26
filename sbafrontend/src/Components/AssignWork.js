import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Modal,
  TextField,
  IconButton,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const AssignWork = () => {
  const [inspectors, setInspectors] = useState([]);
  const [selectedInspector, setSelectedInspector] = useState(null);
  const [assignedDate, setAssignedDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/worker/getAll')
      .then(response => response.json())
      .then(data => {
        const inspectorsOnly = data.filter(worker => !worker.isAdmin);
        setInspectors(inspectorsOnly);
      })
      .catch(error => console.error('Error fetching inspectors:', error));
  }, []);

  const handleInspectorClick = (inspector) => {
    setSelectedInspector(inspector);
    setAssignedDate(null);
    setSelectedFile(null);
    setOpenModal(true);
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
        setOpenModal(false);
      } else {
        alert('Error assigning work order.');
      }
    } catch (error) {
      console.error('Error uploading work order:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Assign Work
      </Typography>

      <Grid container spacing={2}>
        {inspectors.map((inspector) => (
          <Grid item xs={2} key={inspector.workerID}>
            <Box
              onClick={() => handleInspectorClick(inspector)}
              sx={{
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              <Typography>{inspector.firstName} {inspector.lastName}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center">
            {selectedInspector?.firstName} {selectedInspector?.lastName}
          </Typography>

          <Typography variant="body1">
            Please Attach File Below:
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
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
            <Typography variant="caption" align="center">
              {selectedFile.name}
            </Typography>
          )}

          <Typography variant="body1">
            Please Enter Date:
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={assignedDate}
              onChange={(newValue) => setAssignedDate(newValue)}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AssignWork;

