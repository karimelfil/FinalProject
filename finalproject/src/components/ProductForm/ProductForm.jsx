import {
  Dialog, DialogTitle, DialogContent, TextField, Button,
  MenuItem, DialogActions, Box, Typography, IconButton,
  Autocomplete, InputAdornment,
} from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import categories from '../../core/variables/categories'; // import category array 
import currencies from '../../core/variables/currencies'; // import currency array

// yup validation 
const schema = yup.object({
  name: yup.string().required('Product name is required').trim() //trim to don't put space 
    .min(3, 'Product name must be at least 3 characters') // min 3 characters 
    .max(50, 'Product name must not exceed 50 characters'), // max 100 characters
  qty: yup
    .number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .positive('Quantity must be greater than 0')
    .min(1, 'Minimum quantity is 1')
    .max(1000,'Maximiun quantity is 1000'),
    
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .positive('Price must be greater than 0')
    .min(1, 'Minimum price is 1')
    .max(5000,'Maximum price is 5000'),


    // mixed is used here because the input will be vary in type
  image: yup.mixed().test("required", "Image is required", (value) => {
    return (value instanceof FileList && value.length > 0) || (typeof value === 'string' && !!value); // condition to check if the user had upload it a file 
  }),

  category: yup.string().required('Category is required').trim(),
  description: yup.string().required('Description is required').trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),

  currency: yup.string().required('Currency is required'),
});

// styled Box component for the drag-and-drop image upload area
const DropzoneBox = styled(Box)(({ theme }) => ({
  border: `2px dashed var(--border-label-color)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border .24s ease-in-out',
  '&:hover': {
    borderColor: 'var(--label-color)',
  },
  backgroundColor: 'var(--input-bg)',
  color: 'var(--text-color-info)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 150,
  position: 'relative',
}));

// styled img component for displaying the image preview within the dropzone
const PreviewImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.3,
  zIndex: 0,
});

// styled Box component for the content within the dropzone ensuring it's above the preview image
const DropzoneContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
});

// styled DialogTitle component for custom styling of the dialog's title area
const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '20px 24px',
});

// styled Typography component for required field labels, including a star icon
const RequiredLabel = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginBottom: 8,
  color: 'var(--label-color)',
  fontWeight: 'bold',
});


// styled Button component for primary actions 
const PrimaryButton = styled(Button)({
  backgroundColor: 'var(--arrow-color)',
  color: 'var(--card-b2-bg)',
  borderRadius: '8px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',

});


// Styled Button component for secondary actions
const SecondaryButton = styled(Button)({
  backgroundColor: 'transparent',
  color: 'var(--arrow-color)',
  border: '2px solid var(  --border-color-catt)',
  borderRadius: '8px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'all 0.3s ease',

});

export default function ProductForm({ open, onClose, onSubmit, initialData }) {
  const {
    control, handleSubmit, reset, watch, setValue, formState: { errors }
    //useForm   to manage form state, validation and interactions 
  } = useForm({
    resolver: yupResolver(schema), // integrates Yup validation
    defaultValues: { //  initial default values for form fields
      name: '', qty: '', image: null, price: '', category: '', description: '',
      currency: 'USD',
    }
  });

  const [preview, setPreview] = useState(null);   // state to store the URL or Data URL of the image for preview
  
   // useEffect to handle initial data loading when the dialog opens or initialData changes
  useEffect(() => {
    if (initialData) { // for edit 
      reset({
        ...initialData,
        image: initialData.image || null,
      });
      
      if (typeof initialData.image === 'string') {
        setPreview(initialData.image);
      } else {
        setPreview(null);
      }
    } else {
      reset();
      setPreview(null);
    }
  }, [initialData, reset]);

  const imageFile = watch("image"); //gets the current value of the image form field

  useEffect(() => {
    if (imageFile instanceof FileList && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (typeof imageFile === 'string' && !!imageFile) {
      setPreview(imageFile);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

    // useCallback memoizes the onDrop function for use with react-dropzone
  // it updates the image form field with the accepted files
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setValue('image', acceptedFiles, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('image', null, { shouldValidate: true // trigger validartion
      , shouldDirty: true // field change it state 
        });
      setPreview(null);
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, // assigns the onDrop callback
    accept: {
      'image/*': [] // accepts all image types
    },
    multiple: false, // only allows a single file to be dropped at one time 
    noClick: true, // disables click-to-upload
  });


  //manually trigger a hidden file input's click event when the user clicks a custom UI element 
  const handleManualUploadClick = (e) => {
    e.stopPropagation(); //  button is inside another clickable container and you don’t want both to trigger
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click(); // opens the file picker dialog as if the user clicked the file input
    }
  };



  const handleRemoveImage = () => {
    setPreview(null);
    setValue('image', null, { shouldValidate: true, shouldDirty: true });
  };


  const onFormSubmit = async (data) => {   //  receives data, which contains all form field values
    // trim all string fields
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
    };

    let imageToSubmit = trimmedData.image;

    if (imageToSubmit instanceof FileList && imageToSubmit.length > 0) {
      const file = imageToSubmit[0];
      imageToSubmit = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file); // reads the file as a Data URL
      });
    }

    const product = {
      ...trimmedData,
      image: imageToSubmit, 
    };
    onSubmit(product); // calls the onSubmit prop with the product data
    onClose();// closes the dialog
    reset();// resets the form to default values
    setPreview(null);// clears the image preview
  };

  const textFieldStyles = {
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      backgroundColor: 'var(--input-bg)',
      color: 'var(--text-color-info)',
      fontFamily: 'cursive',
      '& fieldset': {
        borderColor: 'var(--border-label-color)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--label-color)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--label-color)',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px',
    },
  };

  return (
    <Dialog
      open={open} // controls if the dialog is open
      onClose={()=>{onClose()}} // function called when the dialog requests to be closed
      maxWidth="sm"
      fullWidth
  slotProps={{
    paper: {
      sx: {
        backgroundColor: 'var(--form-bg)',
        color: 'var(--text-color-info)',
        fontFamily: 'cursive',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      },
    },
  }}
    >
      <StyledDialogTitle sx={{
        backgroundColor: 'var(--title-bg)',
        color: 'var(--arrow-color)',
        fontFamily: 'cursive',
        fontWeight: 'bold',
        borderBottom: '1px solid var(--border-label-color)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        fontSize: '1.75rem',
      }}>
        <span>{initialData ? 'Edit Product' : 'Create Product'}</span>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: 'var( --arrow-color)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 2,
          backgroundColor: 'var(--form-bg)',
          color: 'var(--text-color-info)',
          fontFamily: 'cursive',
          padding: '24px',
        }}>

          <Box>
            <RequiredLabel variant="body1">
              Product Name <span style={{ color: 'red' }}>*</span>
            </RequiredLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Enter product name"
                  fullWidth

                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={textFieldStyles}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.trimStart())}
                />
              )}
            />
          </Box>

          <Box>
            <RequiredLabel variant="body1">
              Quantity <span style={{ color: 'red' }}>*</span>
            </RequiredLabel>
            <Controller
              name="qty"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Enter quantity"
                  fullWidth
                  type="number"
                inputProps={{ min: 1 , max:1000 }}
                  error={!!errors.qty}
                  helperText={errors.qty?.message}
                  sx={textFieldStyles}
                  {...field}
                />
              )}
            />
          </Box>

          <Box>
            <RequiredLabel variant="body1">
              Product Image <span style={{ color: 'red' }}>*</span>
            </RequiredLabel>
 <Controller
              name="image"
              control={control}
              render={() => (
                <DropzoneBox
                  {...getRootProps()}
                  sx={{
                    borderColor: isDragActive ? 'var(--primary-color)' : 'var(--border-label-color)',
                    borderStyle: isDragActive ? 'solid' : 'dashed',
                  }}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 0, 0, 0.7)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.9)',
                          },
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      {isDragActive ? (
                        <Typography variant="body1" color="var(--primary-color)">Drop the files here ...</Typography>
                      ) : (
                        <>
                          <CloudUploadIcon sx={{ fontSize: 60, color: 'var(--label-color)', mb: 1 }} />
                          <Typography variant="h6" color="var(--label-color)" fontWeight="bold">
                            Drag and Drop files
                          </Typography>
                          <Typography variant="body2" color="var(--text-color-info)" mt={1}>
                            or
                          </Typography>
                          <Button
                            variant="contained"
                                sx={{
                            mt: 2,
                            backgroundColor: 'var(--arrow-color)',
                            color: 'var(  --input-bg)',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '1rem',
                          }}
                            onClick={handleManualUploadClick}
                          >
                            Upload Files
                          </Button>
                          <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => onDrop(e.target.files)}
                          />
                        </>
                      )}
                    </>
                  )}
                </DropzoneBox>
              )}
            />
            {errors.image && (
              <Typography color="error" fontSize={13} mt={1}>{errors.image.message}</Typography>
            )}
          </Box>

<Box>
  <Typography variant="body1" sx={{ 
    marginBottom: 1,
    color: 'var(--label-color)',
    fontWeight: 'bold'
  }}>
    Price <span style={{ color: 'red' }}>*</span>
  </Typography>
  
  <Controller
    name="price"
    control={control}
    render={({ field }) => (
      <TextField
        placeholder="Enter price"
        fullWidth
        type="number"
                inputProps={{ min:1 , max:5000 }}
        error={!!errors.price}
        helperText={errors.price?.message}
        sx={textFieldStyles}
      InputProps={{
  startAdornment: (
    <InputAdornment position="start" >
      <Controller
        name="currency"
        control={control}
        render={({ field: currencyField }) => (
          <TextField
            select
            variant="standard"
            sx={{
              '& .MuiInput-root': {
                '&:before, &:after': {
                  borderBottom: 'none',
                },
              },
              '& .MuiSelect-select': {
                paddingRight: '0 !important',
                color: 'var(--text-color-info)',
                fontFamily: 'cursive',
                '& ~ .MuiSelect-icon': {
                  display: 'none',
                },
              },
            }}
            {...currencyField}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value} sx={{ fontFamily: 'cursive' }}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </InputAdornment>
  ),
}}
        {...field}
      />
    )}
  />
</Box>

          <Box>
            <RequiredLabel variant="body1">
              Category <span style={{ color: 'red' }}>*</span>
            </RequiredLabel>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={categories}
                  value={field.value}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select or type a category"
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      sx={textFieldStyles}
                    />
                  )}
                  sx={{ width: '100%' }}
                />
              )}
            />
          </Box>

          <Box>
            <RequiredLabel variant="body1">
              Description <span style={{ color: 'red' }}>*</span>
            </RequiredLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="Enter product description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  sx={textFieldStyles}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.trimStart())}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{
          backgroundColor: 'var(--title-bg)',
          borderTop: '1px solid var(--arrow-color)',
          padding: '20px 24px',
          justifyContent: 'flex-end',
          gap: 2,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}>
          <SecondaryButton  onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">
            {initialData ? 'Update' : 'Save '}
          </PrimaryButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}