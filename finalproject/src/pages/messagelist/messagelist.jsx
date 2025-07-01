import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Box, Button,
  Stepper, Step, StepLabel, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, TablePagination, FormHelperText, useMediaQuery, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

export default function MessagesList() {
  // state to control the visibility of the contact form dialog
  const [showForm, setShowForm] = useState(false);
  // state to manage the current step in the multi-step contact form
  const [step, setStep] = useState(1);
  // state to store form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  // state to manage validation errors for form fields
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  // state to store the list of messages, initially empty
  const [messages, setMessages] = useState([]);

  // pagination states for controlling the current page and number of rows per page in the message table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);  // number of messages to display per page

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Load messages from local storage
  useEffect(() => {
    const stored = localStorage.getItem('messages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  const handleInputChange = (field, value) => {
    const trimmedValue = value.trimStart();
    setFormData((prev) => ({
      ...prev,
      [field]: trimmedValue
    }));
    // clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateStep1 = () => {
    const newErrors = { // check if fields are empty
      name: !formData.name.trim(),
      email: !formData.email.trim()
    };
    setErrors(prev => ({ ...prev, ...newErrors }));

    if (newErrors.name || newErrors.email) {
      const missingFields = [];
      if (newErrors.name) missingFields.push('Name');
      if (newErrors.email) missingFields.push('Email');

      toast.error(
        missingFields.length > 1
          ? `${missingFields.join(' and ')} are required!`
          : `${missingFields[0]} is required!`
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrors(prev => ({ ...prev, email: true }));
      toast.error('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const newErrors = {
      subject: !formData.subject.trim(),
      message: !formData.message.trim()
    };
    setErrors(prev => ({ ...prev, ...newErrors }));

    if (newErrors.subject || newErrors.message) {
      const missingFields = [];
      if (newErrors.subject) missingFields.push('Subject');
      if (newErrors.message) missingFields.push('Message');

      toast.error(
        missingFields.length > 1
          ? `${missingFields.join(' and ')} are required!`
          : `${missingFields[0]} is required!`
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    // trim all fields before submission
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    };

    const updatedMessages = [...messages, trimmedData];
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);

    toast.success('Message submitted successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({ name: false, email: false, subject: false, message: false });
    setStep(1);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setStep(1);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({ name: false, email: false, subject: false, message: false });
  };

  // pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, mt: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 4,
        px: { xs: 1, sm: 3 },
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%'
      }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          sx={{
            fontWeight: 'bold',
            fontFamily: 'cursive',
            color: 'var(--title-color )',
            whiteSpace: 'nowrap',
            mr: 2
          }}
        >
          Customer Messages
        </Typography>

        <Button
          variant="contained"
          onClick={() => setShowForm(true)}
          sx={{
            background: 'var(--button-contact-color)',
            border: 0,
            borderRadius: 3,
            color: 'white',
            height: 48,
            px: 4,
            fontFamily: 'cursive',
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Contact Us
        </Button>
      </Box>

      {/* Contact Form Dialog */}
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: 'var(--card-b3-bg)',
            color: 'var(--button-contact-color)',
            fontFamily: 'cursive',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Contact Us
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{
              color: 'var(--text-color-info)',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: 'var(--card-b3-bg)', py: 3 }}>
          <Stepper
            activeStep={step - 1}
            sx={{
              backgroundColor: 'var(--card-b3-bg)',
              p: 2,
              borderRadius: 2,
              mb: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '& .MuiStepConnector-line': {
                borderColor: 'var(--border-stepactive)',
              },
            }}
          >
            {['Basic Info', 'Message', 'Preview'].map((label, index) => (
              <Step key={index}>
                <StepLabel
                  slotProps={{
                    stepIcon: {
                      sx: {
                        color: 'var(  --border-stepactive)',
                        '&.Mui-completed': {
                          color: 'var(--check)',
                        },
                        '&.Mui-active': {
                          color: 'var(  --secondary-color )',
                        },
                      },
                    },
                  }}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: 'var(--cat-focus)',
                      fontFamily: 'cursive',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      '&.Mui-active': {
                        color: 'var(--cat-focus)',
                        fontWeight: 700,
                      },
                      '&.Mui-completed': {
                        color: 'var(--arrow-colo)',
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1 */}
          {step === 1 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '14px',
                    zIndex: 1,
                    backgroundColor: 'var(--card-b3-bg)',
                    padding: '0 4px',
                    color: errors.name ? 'error.main' : 'var(--text-color-infooo)',
                    fontFamily: 'cursive',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Name <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Enter your name (max 10 characters)"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      handleInputChange('name', e.target.value);
                    }
                  }}
                  variant="outlined"
                  error={errors.name}
                  slotProps={{
                    input: {
                      maxLength: 10,
                    },
                    root: {
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '1.5px'
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          transition: 'border-color 0.3s ease'
                        }
                      }
                    }
                  }}
                />
                {errors.name && (
                  <FormHelperText error sx={{ ml: 1.5 }}>
                    Name is required (max 10 characters)
                  </FormHelperText>
                )}
              </Box>

              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '14px',
                    zIndex: 1,
                    backgroundColor: 'var(--card-b3-bg)',
                    padding: '0 4px',
                    color: errors.name ? 'error.main' : 'var(--text-color-infooo)',
                    fontFamily: 'cursive',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Email <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Enter your email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  variant="outlined"
                  error={errors.email}
                  slotProps={{
                    root: {
                      sx: {
                        color: 'var(--text-color-info)',
                        backgroundColor: 'var(--field-bg)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '1.5px'
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          transition: 'border-color 0.3s ease'
                        }
                      }
                    }
                  }}
                />
                {errors.email && (
                  <FormHelperText error sx={{ ml: 1.5 }}>
                    {formData.email.trim() ? 'Invalid email format' : 'Email is required'}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '14px',
                    zIndex: 1,
                    backgroundColor: 'var(--card-b3-bg)',
                    padding: '0 4px',
                    color: errors.name ? 'error.main' : 'var(--text-color-infooo)',
                    fontFamily: 'cursive',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Subject <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Enter the subject (max 50 characters)"
                  fullWidth
                  value={formData.subject}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      handleInputChange('subject', e.target.value);
                    }
                  }}
                  variant="outlined"
                  error={errors.subject}
                  slotProps={{
                    input: {
                      maxLength: 50,
                    },
                    root: {
                      sx: {
                        color: 'var(--text-color-info)',
                        backgroundColor: 'var(--field-bg)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '1.5px'
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          transition: 'border-color 0.3s ease'
                        }
                      }
                    }
                  }}
                />
                {errors.subject && (
                  <FormHelperText error sx={{ ml: 1.5 }}>
                    Subject is required (max 50 characters)
                  </FormHelperText>
                )}
              </Box>

              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '14px',
                    zIndex: 1,
                    backgroundColor: 'var(--card-b3-bg)',
                    padding: '0 4px',
                    color: errors.name ? 'error.main' : 'var(--text-color-infooo)',
                    fontFamily: 'cursive',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Message <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  placeholder="Type your message here..."
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  variant="outlined"
                  error={errors.message}
                  slotProps={{
                    root: {
                      sx: {
                        color: 'var(--text-color-info)',
                        backgroundColor: 'var(--field-bg)',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '1.5px'
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--border-color-catt)',
                            borderWidth: '2px'
                          },
                          transition: 'border-color 0.3s ease'
                        }
                      },
                    },
                  }}
                />
                {errors.message && (
                  <FormHelperText error sx={{ ml: 1.5 }}>
                    Message is required
                  </FormHelperText>
                )}
              </Box>
            </Box>
          )}

          {/* Step 3*/}
          {step === 3 && (
            <Paper
              elevation={3}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                backgroundColor: 'var(--card-b3-bg)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    color: 'var(--text-color-infooo)',
                fontFamily: 'cursive',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontFamily: 'cursive', }}>
                Review Your Message
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 'bold', fontFamily: 'cursive', }}>Name:</Typography>
                <Typography sx={{ fontFamily: 'cursive', wordBreak: 'break-word' }}> {/* Added wordBreak */}
                  {formData.name.trim().length > 10 ? `${formData.name.trim().substring(0, 10)}...` : formData.name.trim()}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 'bold', fontFamily: 'cursive', }}>Email:</Typography>
                <Typography sx={{ fontFamily: 'cursive', wordBreak: 'break-word' }}> {/* Added wordBreak */}
                  {formData.email.trim()}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 'bold', fontFamily: 'cursive', }}>Subject:</Typography>
                <Typography sx={{ fontFamily: 'cursive', wordBreak: 'break-word' }}> {/* Added wordBreak */}
                  {formData.subject.trim()}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 'bold', fontFamily: 'cursive', }}>Message:</Typography>
                <Typography sx={{ fontFamily: 'cursive', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}> {/* Added wordBreak */}
                  {formData.message.trim()}
                </Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ backgroundColor: 'var(--card-b3-bg)', p: 3, pt: 0 }}>
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{
                color: 'var(  --cat-focus)',
                borderColor: 'var(  --border-color-cat)',
                backgroundColor: 'var(  --input-bg )',
                '&:hover': {
                  backgroundColor: 'rgba(109, 46, 70, 0.08)',
                  borderColor: 'var(  --cat-focus)', // Darker purple on hover
                  boxShadow: '0 2px 6px rgba(92, 55, 77, 0.2)',
                },
                '&:active': {
                  backgroundColor: 'rgba(109, 46, 70, 0.12)',
                  transform: 'translateY(1px)',
                },
                fontFamily: 'cursive',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                borderWidth: '2px',
                transition: 'all 0.3s ease',
                textTransform: 'none',
              }}
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: 'var( --arrow-color)',
                color: 'var(  --input-bg )',
                fontFamily: 'cursive',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: 'var(  --arrow-color)',
                color: 'var(  --input-bg )',

                fontFamily: 'cursive',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Messages Table with Pagination */}
      <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.05)',
            mb: 4
          }}
        >
          <Typography
            variant="h6"
            sx={{
              p: 2,
              fontWeight: 600,
              borderBottom: '1px solid #ddd',
              backgroundColor: 'var(--card-b2-bg)',
              fontFamily: 'cursive',
              color: 'var(  --arrow-color)'
            }}
          >
            Messages List
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: 'var(--card-b2-bg)', '&:hover': {
                    backgroundColor: 'var(--table-row-hover) !important',
                  }
                }}>
                  {['Name', 'Email', 'Subject', 'Message'].map((header, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        fontWeight: 700,
                        // backgroundColor: 'var(--card-b2-bg)',
                        fontFamily: 'cursive',
                        color: 'var(  --arrow-color)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{
                      py: 4,
                      color: 'text.secondary',
                      backgroundColor: 'var(--card-b2-bg)',
                    }}>
                      No messages submitted yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((msg, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: 'var(--card-b2-bg)',
                          '&:hover': {
                            backgroundColor: 'var(--table-row-hover)'
                          }
                        }}
                      >
                        <TableCell
                          sx={{
                            fontFamily: 'cursive',
                            color: 'var(--text-color-infoo)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '120px'
                          }}
                          title={msg.name}
                        >
                          {msg.name.length > 10 ? `${msg.name.substring(0, 10)}...` : msg.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: 'cursive',
                            color: 'var(--text-color-infoo)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px'
                          }}
                        >
                          {msg.email}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: 'cursive',
                            color: 'var(--text-color-infoo)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px'
                          }}
                        >
                          {msg.subject}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: 'cursive',
                            color: 'var(--text-color-infoo)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxWidth: '300px'
                          }}
                        >
                          {msg.message}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={messages.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: 'var(--card-b2-bg)',
              color: 'var(--text-color-infoo)',
              fontFamily: 'cursive',
              borderTop: '1px solid var(--border-color)',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontFamily: 'cursive',
                color: 'var(--text-color-infoo)'
              },
              '& .MuiSvgIcon-root': {
                color: 'var(--text-color-infoo)'
              }
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}