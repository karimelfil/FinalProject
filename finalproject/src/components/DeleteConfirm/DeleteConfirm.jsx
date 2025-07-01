import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography, 
  Box, 
} from '@mui/material';


export default function DeleteConfirm({ open, onConfirm, onCancel }) {
  return (
    <Dialog
      open={open} // open the delete dialog if true 
      onClose={onCancel} // close the dialog when he click on cancel 
      aria-labelledby="delete-dialog-title"
      sx={{
        '& .MuiPaper-root': { 
          backgroundColor: 'var(--card-b2-bg)', 
          borderRadius: '12px', 
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', 
          minWidth: { xs: '90%', sm: '400px' }, 
          maxWidth: '500px',
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          backgroundColor: 'var(--card-b1-bg)', 
          color: 'var(--text-color-primary)', 
          fontFamily: 'cursive',
          borderBottom: '1px solid var(--border-color)', 
          padding: '16px 24px', 
          textAlign: 'center', 
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          Confirm Deletion
        </Typography>
      </DialogTitle>

      <Box sx={{ padding: '24px', textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'var(--text-color-info)', fontFamily: 'cursive' }}>
          Are you sure you want to delete this product?  
        </Typography>
      </Box>

      <DialogActions
        sx={{
          justifyContent: 'center', 
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)', 
          gap: '16px', 
        }}
      >
        {/* cancel delete product */}
        <Button
          onClick={onCancel}  // call cancel function when the user click on cancel
          variant="outlined" 
          sx={{
            color: 'var(--text-color-info)', 
            borderColor: 'var(--text-color-info)', 
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'var(--text-color-info)',
            },
          }}
        >
          Cancel
        </Button>
        {/* confirm delete product */}
        <Button
          color="error"
          onClick={onConfirm} // call confirm function to delete when the user click on delete 
          variant="contained" 
          sx={{
            fontWeight: 'bold', 
            '&:hover': {
              backgroundColor: 'darkred', 
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}