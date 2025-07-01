import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, updateProduct } from '../../redux/productSlice';
import ProductCard from '../ProductCard/ProductCard';
import ProductForm from '../ProductForm/ProductForm';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';
import AnimatedSearchBar from '../searchbar/searchbar'
import {
  Button, Select, MenuItem, Typography, Grid, Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


export default function ProductList() {
  const products = useSelector(state => state.products); // select product state from redux store 
  const dispatch = useDispatch(); // use dispatch to send actions 

  const [selectedCategory, setSelectedCategory] = useState(''); // state to filter categories 
  const [formOpen, setFormOpen] = useState(false); // state to controle the o/c of the product form 
  const [editData, setEditData] = useState(null); // state that contain all data to edit 
  const [deleteTarget, setDeleteTarget] = useState(null); // state that contain product name to delete it 
  

const [search, setSearch] = useState('');








  //display 10 products by default if the the website have less than 10 products the load more button will not appear
  const [visibleCount, setVisibleCount] = useState(10);


  //filter products by category 
const filtered = Object.entries(products) //  converts the products object into an array of key value pairs
  .filter(([, p]) => !selectedCategory || p.category === selectedCategory)
.filter(([name]) =>
  !search || name.toLowerCase().includes(search.toLowerCase())
);



  // slice products based on visibleCount
  const visibleProducts = filtered.slice(0, visibleCount);

  const handleFormSubmit = (data) => {
    if (editData) { 
      dispatch(updateProduct(data));
      //show toast success message 
      toast.success('Product updated successfully');
    } else {
      dispatch(addProduct(data));
            //show toast success message 
      toast.success('Product created successfully');
    }
    setEditData(null);
    setFormOpen(false);
    
  };
  

  return (
    
<Box>
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    mb: 1,
    gap: 2,
    px: { xs: 2, sm: 3 }
  }}
>

    <Box>
<Typography
  variant="h4"
  sx={{
    fontFamily: 'cursive',
    color: 'var(--title-color)',
    fontWeight: 'bold',
    marginLeft: '1rem',
    fontSize: { xs: '1.5rem', sm: '2.125rem' }
  }}
>

        Product List
      </Typography>
      <Typography variant="subtitle1" sx={{ fontFamily: 'cursive', color: 'var(--condition-messgae)' , marginLeft:'1rem'  }}>
        Total: {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </Typography>
    </Box>

<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: 1.5,
    width: { xs: '100%', sm: 'auto' },
    marginRight: { sm: '1rem' }
  }}
>

<Button
  variant="contained"
  onClick={() => setFormOpen(true)}
  sx={{
    fontFamily: 'cursive',
    backgroundColor: 'var(--button-primary-bgh)',
    color: 'var(--button-primary-textt)',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    px: 3,
    py: 1.2,
    borderRadius: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',

    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    },
  }}
  startIcon={<AddIcon />}
>
  Add Product
</Button>

     <Select
  value={selectedCategory}
  onChange={e => {
    setSelectedCategory(e.target.value);
    setVisibleCount(10);
  }}
  displayEmpty
  sx={{
    fontFamily: 'cursive',
    backgroundColor: 'var(  --input-bg )', 
    minWidth: 150,
    '& .MuiOutlinedInput-notchedOutline': {

      borderColor: 'var(--cat)', 
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(  --border-color-cat)',
      borderWidth: '2px'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

      borderColor: '      var(--cat-focus)', 
      borderWidth: '2px'
    },
    '& .MuiSelect-icon': {
      color: 'var(  --border-color-cat)', 
    },
    borderRadius: '8px', // Matches your other inputs
    transition: 'border-color 0.3s ease' ,
  }}
>
  <MenuItem value="" sx={{ fontFamily: 'cursive' }}>All Categories</MenuItem>
  {[...new Set(Object.values(products).map(p => p.category))].map(cat => (
    <MenuItem 
      key={cat} 
      value={cat}
      sx={{
        fontFamily: 'cursive',
        '&:hover': {
          backgroundColor: 'rgba(109, 46, 70, 0.08)' 
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(109, 46, 70, 0.12)'
        }
      }}
    >
      {cat}
    </MenuItem>
  ))}
</Select>
    </Box>
  </Box>
<AnimatedSearchBar
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

{visibleProducts.length === 0 ? (
  <Box sx={{ textAlign: 'center', mt: 4 }}>
    <Typography variant="h6" sx={{ fontFamily: 'cursive', color: 'var(--condition-messgae)' }}>
      No products  displayed.
    </Typography>
  </Box>
) : (
  <Grid container>
    {visibleProducts.map(([name, product]) => (
      <ProductCard
        key={name}
        name={name}
        product={product}
        onEdit={() => {
          setEditData({ name, ...product });
          setFormOpen(true);
        }}
        onDelete={() => setDeleteTarget(name)}
      />
    ))}
  </Grid>
)}


{/* Load More Button */}
{visibleCount < filtered.length && (
  <Box textAlign="center" mt={2} mb={4}>
    <Button
      variant="outlined"
      onClick={() => setVisibleCount((prev) => prev + 10)}
      sx={{
        fontFamily: 'cursive',
        color: 'var(  --border-color-cat)', 
        borderColor: 'var(  --border-color-cat)',
        borderRadius: '8px', 
        padding: '8px 24px', 
        transition: 'all 0.3s ease' 
      }}
    >
      Load More
    </Button>
  </Box>
)}


      {formOpen&& (
        <ProductForm
        open={true}
        onClose={() => {
           
          setFormOpen(false);
          setEditData(null);
         
        }}
        initialData={editData}
        onSubmit={handleFormSubmit}
      />)}

      <DeleteConfirm
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          dispatch(deleteProduct(deleteTarget));
                //show toast success message 
          toast.success('Product deleted successfully');
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
}
