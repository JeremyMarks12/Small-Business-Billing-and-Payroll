import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Grid, Paper } from '@mui/material';

const AdminViewWork = () => {
  const [woItems, setWoItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    fetchWOItems();
  }, []);

  const fetchWOItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/worker/getwoitems');
      const data = await response.json();
      setWoItems(data);
    } catch (error) {
      console.error('Error fetching WOItems:', error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedItem(null);
  };

  const handleDeleteWorkOrder = async () => {
    if (!selectedItem) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete Work Order Number: ${selectedItem.fileNumber}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/worker/delete/${selectedItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Work Order deleted successfully.');
        handleClosePopup();
        fetchWOItems(); // Refresh the grid
      } else {
        alert('Failed to delete Work Order.');
      }
    } catch (error) {
      console.error('Error deleting Work Order:', error);
      alert('An error occurred while deleting the Work Order.');
    }
  };

  useEffect(() => {
    if (popupVisible) {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          handleClosePopup();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [popupVisible]);

  return (
    <div className="admin-view-work" style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>Completed Work Orders</Typography>

      <Grid container spacing={2}>
        {woItems.map((woItem) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={woItem.id}>
            <Paper
              elevation={3}
              sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
              onClick={() => handleCardClick(woItem)}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>{woItem.name}</Typography>
              <Typography variant="body2">Work Order Number: {woItem.fileNumber}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {popupVisible && selectedItem && (
        <div
          className="popup-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            ref={popupRef}
            className="popup-content"
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '10px',
              width: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" gutterBottom>{selectedItem.name}</Typography>
            <Typography variant="h6" gutterBottom>Work Order Number: {selectedItem.fileNumber}</Typography>
            <Typography><strong>Company:</strong> {selectedItem.company}</Typography>
            <Typography><strong>Price:</strong> ${selectedItem.myPrice}</Typography>
            <Typography><strong>SBA Total:</strong> ${selectedItem.sBATotal}</Typography>
            <Typography><strong>Plat:</strong> {selectedItem.plat}</Typography>
            <Typography><strong>Assessment:</strong> {selectedItem.assessment}</Typography>
            <Typography><strong>Comments:</strong> {selectedItem.comments}</Typography>
            <Typography><strong>Address:</strong> {selectedItem.address}</Typography>
            <Typography><strong>Date:</strong> {selectedItem.date}</Typography>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button
                onClick={handleDeleteWorkOrder}
                sx={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  '&:hover': { backgroundColor: '#c82333' },
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewWork;
