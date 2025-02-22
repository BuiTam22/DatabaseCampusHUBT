import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Image as ImageIcon,
  Close as CloseIcon,
  VideoCall as VideoIcon,
  EmojiEmotions as EmojiIcon,
  Public as PublicIcon,
  PhotoLibrary as PhotoLibraryIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ApiService from '../../services/apiService';

const CreatePost = ({ onClose, user, onSubmit }) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('CreatePost received user:', user);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Kiểm tra và xử lý từng file
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
    if (!content.trim() && previews.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      
      mediaFiles.forEach((file) => {
        formData.append('media', file);
      });

      // Gọi API trực tiếp thông qua ApiService
      const response = await ApiService.createPost(formData);
      
      if (response?.data) {
        setContent('');
        setMediaFiles([]);
        setPreviews([]);
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, limit = 100) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
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
          {/* Header của preview */}
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
              Post Preview
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

          {/* Content preview */}
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
            }),
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }
            }
          }}>
            {/* Facebook post card preview */}
            <Card sx={{ 
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: viewMode === 'mobile' ? 1 : 2,
              minHeight: 'min-content',
              ...(viewMode === 'mobile' && {
                fontSize: '0.9rem'
              }),
              '& .MuiCardContent-root': {
                pb: content.length > 100 && previews.length > 0 ? 1 : 2
              }
            }}>
              {/* Post header */}
              <CardHeader
                avatar={
                  <Avatar 
                    src={user?.image || user?.avatarUrl}
                    sx={{ width: 40, height: 40 }}
                  >
                    {user?.fullName?.charAt(0)}
                  </Avatar>
                }
                title={
                  <Typography variant="subtitle2">
                    {user?.fullName}
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Just now
                    </Typography>
                    <Typography variant="caption" color="text.secondary">•</Typography>
                    <PublicIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  </Box>
                }
              />

              {/* Post content */}
              <CardContent sx={{ pt: 0 }}>
                {content && previews.length > 0 ? (
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        ...(content.length > 100 && !isExpanded && {
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        })
                      }}
                    >
                      {isExpanded ? content : truncateText(content)}
                    </Typography>
                    {content.length > 100 && (
                      <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        sx={{ 
                          p: 0,
                          mt: 1,
                          minWidth: 'auto',
                          textTransform: 'none',
                          color: 'text.secondary',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {content || "What's on your mind?"}
                  </Typography>
                )}
              </CardContent>

              {/* Media preview */}
              {previews.length > 0 && (
                <Box sx={{ 
                  position: 'relative',
                  display: 'grid',
                  gap: 1,
                  p: 1,
                  mt: content.length > 100 ? 0 : 1,
                  ...(previews.length === 1 && {
                    gridTemplateColumns: '1fr',
                    '& img': { 
                      height: content.length > 100 ? '250px' : '300px'
                    }
                  }),
                  ...(previews.length === 2 && {
                    gridTemplateColumns: '1fr 1fr',
                    '& img': { height: '200px' }
                  }),
                  ...(previews.length === 3 && {
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: 'repeat(2, 200px)',
                    '& > :first-of-type': {
                      gridRow: '1 / span 2',
                      '& img': { height: '400px' }
                    },
                    '& > :not(:first-of-type) img': { height: '200px' }
                  }),
                  ...(previews.length === 4 && {
                    gridTemplateColumns: '1fr 1fr',
                    '& img': { height: '200px' }
                  }),
                  ...(previews.length >= 5 && {
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridTemplateRows: 'repeat(2, 150px)',
                    '& > :first-of-type': {
                      gridRow: '1 / span 2',
                      '& img': { height: '300px' }
                    },
                    '& > :not(:first-of-type) img': { height: '150px' }
                  })
                }}>
                  {previews.map((preview, index) => {
                    if (index >= 5) return null;
                    
                    return (
                      <Box 
                        key={index} 
                        sx={{ 
                          position: 'relative',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeMedia(index)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.8)'
                            },
                            width: 24,
                            height: 24,
                            padding: 0
                          }}
                        >
                          <CloseIcon sx={{ color: 'white', fontSize: '16px' }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Post actions */}
              <CardActions sx={{ 
                borderTop: '1px solid',
                borderColor: 'divider',
                px: 2
              }}>
                <Button 
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ flex: 1, color: 'text.secondary' }}
                >
                  Like
                </Button>
                <Button
                  startIcon={<CommentIcon />}
                  sx={{ flex: 1, color: 'text.secondary' }}
                >
                  Comment
                </Button>
                <Button
                  startIcon={<ShareIcon />}
                  sx={{ flex: 1, color: 'text.secondary' }}
                >
                  Share
                </Button>
              </CardActions>
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
              Create Post
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
            {/* Content Input */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              variant="outlined"
              InputProps={{
                sx: {
                  border: 'none',
                  '& fieldset': { border: 'none' },
                  fontSize: '1.1rem',
                  '&::placeholder': {
                    fontSize: '1.1rem'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: 0,
                  '&:hover fieldset': {
                    border: 'none'
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none'
                  }
                }
              }}
            />

            {/* Media Previews Grid */}
            {previews.length > 0 && (
              <Box sx={{ 
                display: 'grid',
                gap: 1,
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                mt: 2
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
                        height: 24,
                        '& .MuiSvgIcon-root': {
                          fontSize: 16
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
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
            {/* Left side - Add Photo button */}
            <Box>
              <input
                id="media-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Tooltip title="Add photos">
                <IconButton 
                  onClick={() => document.getElementById('media-input').click()}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      opacity: 0.8
                    }
                  }}
                >
                  <PhotoLibraryIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Right side - Cancel and Post buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && previews.length === 0)}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Post'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePost;