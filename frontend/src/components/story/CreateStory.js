import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
  TextField
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PaletteIcon from '@mui/icons-material/Palette';

const CreateStory = ({ onClose, user, onSubmit }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [viewMode, setViewMode] = useState('desktop');
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showTextInput, setShowTextInput] = useState(false);

  const backgroundColors = [
    '#1877F2', // Facebook blue
    '#E4405F', // Instagram pink
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
  ];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        const type = file.type.toLowerCase();
        return type.startsWith('image/');
      });

      if (validFiles.length > 0) {
        setMediaFiles(prev => [...prev, ...validFiles]);
        
        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews(prev => [...prev, reader.result]);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (previews.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      mediaFiles.forEach((file, index) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const mimeType = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif'
        }[fileExtension] || file.type;

        const processedFile = new File([file], file.name, {
          type: mimeType
        });

        formData.append('media', processedFile);
      });

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; charset=utf-8'
      };

      const response = await onSubmit(formData, headers);
      
      if (response?.data) {
        setMediaFiles([]);
        setPreviews([]);
        onClose();
      }
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1300
    }}>
      <Paper sx={{ 
        width: '1000px',
        height: '600px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex'
      }}>
        {/* Left Side - Preview */}
        <Box sx={{ 
          width: '350px',
          height: '100%',
          backgroundColor: '#f0f2f5',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Preview Header */}
          <Box sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Story Preview
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Desktop preview">
                <IconButton 
                  size="small"
                  onClick={() => setViewMode('desktop')}
                  sx={{ 
                    bgcolor: viewMode === 'desktop' ? 'primary.main' : 'grey.200',
                    color: viewMode === 'desktop' ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: viewMode === 'desktop' ? 'primary.dark' : 'grey.300'
                    }
                  }}
                >
                  <DesktopWindowsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Mobile preview">
                <IconButton 
                  size="small"
                  onClick={() => setViewMode('mobile')}
                  sx={{ 
                    bgcolor: viewMode === 'mobile' ? 'primary.main' : 'grey.200',
                    color: viewMode === 'mobile' ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: viewMode === 'mobile' ? 'primary.dark' : 'grey.300'
                    }
                  }}
                >
                  <PhoneIphoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Story Preview */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            ...(viewMode === 'mobile' && {
              maxWidth: '400px',
              margin: '0 auto'
            })
          }}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              borderRadius: viewMode === 'mobile' ? 1 : 2,
              overflow: 'hidden'
            }}>
              {previews.length > 0 ? (
                <>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${previews[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {text && (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: textColor,
                          textAlign: 'center',
                          padding: 2,
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        {text}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
                  }}>
                    <CardHeader
                      avatar={
                        <Avatar 
                          src={user?.image || user?.avatarUrl}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            border: '3px solid #1877F2'
                          }}
                        >
                          {user?.fullName?.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Typography sx={{ color: 'white', fontWeight: 500 }}>
                          {user?.fullName}
                        </Typography>
                      }
                      subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'white' }}>
                            Just now
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'white' }}>•</Typography>
                          <PublicIcon sx={{ fontSize: 14, color: 'white' }} />
                        </Box>
                      }
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: backgroundColor || 'grey.100'
                }}>
                  {text ? (
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: textColor,
                        textAlign: 'center',
                        padding: 2,
                        fontWeight: 'bold'
                      }}
                    >
                      {text}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary">
                      Add photos or text to preview your story
                    </Typography>
                  )}
                </Box>
              )}
            </Card>
          </Box>
        </Box>

        {/* Right Side - Controls */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Create Story
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ 
            flex: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto'
          }}>
            {/* Text Input */}
            {showTextInput && (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white'
                  }
                }}
              />
            )}

            {/* Background Colors */}
            <Box sx={{ 
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1
            }}>
              {backgroundColors.map((color) => (
                <IconButton
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: color,
                    '&:hover': {
                      bgcolor: color,
                      opacity: 0.8
                    },
                    ...(backgroundColor === color && {
                      border: '2px solid white',
                      boxShadow: '0 0 0 2px #1877F2'
                    })
                  }}
                />
              ))}
            </Box>

            {/* Media Previews */}
            {previews.length > 0 ? (
              <Box sx={{ 
                display: 'grid',
                gap: 1,
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))'
              }}>
                {previews.map((preview, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      position: 'relative',
                      paddingTop: '100%',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeMedia(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.8)'
                        },
                        width: 24,
                        height: 24
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <PhotoLibraryIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography variant="subtitle1" color="text.secondary">
                  Add photos to your story
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer Actions */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                id="story-media-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Tooltip title="Add photos">
                <IconButton 
                  onClick={() => document.getElementById('story-media-input').click()}
                  sx={{ color: 'primary.main' }}
                >
                  <PhotoLibraryIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add text">
                <IconButton 
                  onClick={() => setShowTextInput(!showTextInput)}
                  sx={{ 
                    color: showTextInput ? 'primary.main' : 'action.active'
                  }}
                >
                  <TextFieldsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Change background">
                <IconButton 
                  onClick={() => setBackgroundColor(backgroundColors[0])}
                  sx={{ color: 'action.active' }}
                >
                  <PaletteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || (!text && previews.length === 0)}
              >
                {loading ? <CircularProgress size={24} /> : 'Share to Story'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateStory; 