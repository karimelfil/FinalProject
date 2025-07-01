import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from 'react';


export default function ProductCard({ name, product, onEdit, onDelete }) {
  const [openDetails, setOpenDetails] = useState(false);  // state to control the visibility of the product details dialog
  return (
    <>
      <Card sx={{ width: 350, m: 2, boxShadow: 3, backgroundColor: 'var(--card-b2-bg)' }}>
        <Box p={1}>
          <CardMedia
            component="img"
            height="200"
            image={product.image}
            alt={name}
            sx={{
              objectFit: 'contain',
              backgroundColor: 'var(--card-b1-bg)',
              borderRadius: 2,
            }}
          />
        </Box>

        <CardContent sx={{ backgroundColor: 'var(--card-b2-bg)', fontFamily: 'cursive' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              variant="h6"
              fontWeight="bold"
              color="var(--text-color-infooo)"
              fontFamily="cursive"
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}
            >
              {name}
            </Typography>
            <Tooltip title="View Details">
              <IconButton onClick={() => setOpenDetails(true)} size="small">
                <ArrowForwardIosIcon fontSize="small" sx={{color :'var(--arrow-color)'}}/>
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            variant="body2"
            fontFamily="cursive"
            color="var(--text-color-infooo)"
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {product.category} 
          </Typography>
          <Typography
            variant="h6"
            color="var(--text-color-infooo)"
            fontWeight="bold"
            sx={{ wordBreak: 'break-word' }}
          >
            {product.price} {product.currency}
          </Typography>
        </CardContent>

       {/* card actions for edit and delete buttons */}
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, backgroundColor: 'var(--card-b2-bg)' }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(name)}  sx={{color:'var(--edit)'}}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(name)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      {/* details dialog */}
      <Dialog 
  open={openDetails} 
  onClose={() => setOpenDetails(false)}
  slotProps={{
    paper: {
      sx: {
       
        backgroundColor: '  var(--details-bg)', 
        borderRadius: '12px',

        boxShadow: '0 8px 30px         var(--detail-boxShadow)',
      }
    }
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: 'var( --arrow-color)', 
      fontFamily: 'cursive',
      color: 'var(-- --text-light)', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
      padding: '16px 24px',
    }}
  >
<Typography
  fontWeight="bold"
  fontSize="1.25rem"
  color="white"
  sx={{
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2, // Limits to 2 lines
    WebkitBoxOrient: 'vertical'
  }}
>
  {name} - Details
</Typography>
    <IconButton 
      onClick={() => setOpenDetails(false)}
      sx={{
        color: 'var(--text-close)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent
    dividers
    sx={{ 
      backgroundColor: 'var(--text-light)', 
      wordBreak: 'break-word',
      padding: '24px',
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography sx={{ 
          color: '          var(--text-details)',
          fontFamily: 'cursive',
          marginBottom: '12px',
          marginLeft:'2rem'
        }}>
          <strong style={{ color: 'var( --arrow-color)' }}>Category:</strong> {product.category}
        </Typography>
        <Typography sx={{ 

          color: '          var(--text-details)',
          fontFamily: 'cursive' ,
                    marginLeft:'2rem'
          
        }}>
          <strong style={{ color: 'var( --arrow-color)' }}>Price:</strong> {product.price} 
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography sx={{ 
          color: '          var(--text-details)',
          fontFamily: 'cursive',
          marginBottom: '12px',
                    marginLeft:'2rem'
        }}>
          <strong style={{ color: 'var( --arrow-color)' }}>Quantity:</strong> {product.qty}
        </Typography>
        <Typography sx={{ 
          color: '          var(--text-details)',
          fontFamily: 'cursive',
                    marginLeft:'2rem'
        }}>
          <strong style={{ color: 'var( --arrow-color)' }}>Currency:</strong> {product.currency}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ 
          color: '          var(--text-details)',
          fontFamily: 'cursive',
          mt: 3,
          mb: 2,
                    marginLeft:'2rem'
        }}>
          <strong style={{ color: 'var( --arrow-color)' }}>Description:</strong> {product.description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box 
          mt={2}
          sx={{
            border: '1px solid var(--border-grid)', 
            borderRadius: '8px',
            overflow: 'hidden',
            padding: '4px',
            backgroundColor: 'var(--card-b2-bg)'
          }}
        >
          <img 
            src={product.image} 
            alt={name} 
            style={{ 
              width: '100%', 
              display: 'block',
              borderRadius: '4px'
            }} 
          />
        </Box>
      </Grid>
    </Grid>
  </DialogContent>
</Dialog>
    </>
  );
}
