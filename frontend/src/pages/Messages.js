import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Badge,
  InputAdornment,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  AvatarGroup,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
  Circle as StatusIcon,
  Image as ImageIcon,
  VideoCall as VideoIcon,
  Phone as PhoneIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import authService from '../services/authService';
import { useSidebar } from '../contexts/SidebarContext';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const user = authService.getCurrentUser();
  const { isCollapsed } = useSidebar();

  const mockMessages = [
    {
      id: 1,
      sender: 'John Doe',
      content: 'Hey, how are you doing?',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: 2,
      content: "I'm good, thanks! Working on the new project.",
      time: '10:32 AM',
      isMe: true,
    },
    {
      id: 3,
      sender: 'John Doe',
      content: 'Great! Can we schedule a meeting to discuss the details?',
      time: '10:33 AM',
      isMe: false,
    },
  ];

  const chats = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://mui.com/static/images/avatar/1.jpg',
      lastMessage: 'Hey, how are you?',
      time: '2 min ago',
      unread: 2,
      online: true,
      isGroup: false,
    },
    {
      id: 2,
      name: 'Design Team',
      avatar: 'https://mui.com/static/images/avatar/2.jpg',
      lastMessage: 'Alice: The new mockups are ready',
      time: '1 hour ago',
      unread: 5,
      online: true,
      isGroup: true,
      members: ['Alice', 'Bob', 'Charlie', '+3'],
    },
  ];

  const MessageBubble = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: message.isMe ? 'row-reverse' : 'row',
        gap: 2,
        mb: 2,
      }}
    >
      {!message.isMe && (
        <Avatar src={selectedChat?.avatar} sx={{ width: 32, height: 32 }} />
      )}
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            maxWidth: '70%',
            bgcolor: message.isMe ? 'primary.main' : 'grey.100',
            color: message.isMe ? 'white' : 'text.primary',
            ml: message.isMe ? 'auto' : 0,
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
        </Paper>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: message.isMe ? 'right' : 'left',
            mt: 0.5,
          }}
        >
          {message.time}
        </Typography>
      </Box>
    </Box>
  );

  const ChatListItem = ({ chat, isSelected }) => (
    <ListItem
      button
      selected={isSelected}
      onClick={() => setSelectedChat(chat)}
      sx={{
        borderRadius: 2,
        mb: 1,
        transition: 'all 0.2s ease',
        '&.Mui-selected': {
          backgroundColor: 'primary.lighter',
          '&:hover': {
            backgroundColor: 'primary.lighter',
          },
        },
        '&:hover': {
          backgroundColor: 'grey.50',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <ListItemAvatar>
        {chat.isGroup ? (
          <AvatarGroup max={3} sx={{ width: 40, height: 40 }}>
            <Avatar src={chat.avatar} />
            <Avatar src="https://mui.com/static/images/avatar/3.jpg" />
            <Avatar src="https://mui.com/static/images/avatar/4.jpg" />
          </AvatarGroup>
        ) : (
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              chat.online && (
                <StatusIcon
                  sx={{
                    fontSize: 12,
                    color: 'success.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                  }}
                />
              )
            }
          >
            <Avatar src={chat.avatar} />
          </Badge>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {chat.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {chat.time}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '180px',
              }}
            >
              {chat.lastMessage}
            </Typography>
            {chat.unread > 0 && (
              <Chip
                label={chat.unread}
                color="primary"
                size="small"
                sx={{ height: 20, minWidth: 20, borderRadius: '10px' }}
              />
            )}
          </Box>
        }
      />
    </ListItem>
  );

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 64,
      left: isCollapsed ? '80px' : '280px',
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1,
      borderLeft: '1px solid',
      borderColor: 'divider',
      transition: 'left 0.3s ease',
    }}>
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          display: 'flex',
          border: 'none',
          borderRadius: 0,
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        {/* Left Side - Chat List */}
        <Box
          sx={{
            width: 320,
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton sx={{ bgcolor: 'grey.100' }}>
                <FilterIcon />
              </IconButton>
            </Stack>
          </Box>

          <List sx={{ 
            overflow: 'auto', 
            flexGrow: 1,
            px: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '3px',
            },
          }}>
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChat?.id === chat.id}
              />
            ))}
          </List>
        </Box>

        {/* Right Side - Chat Window */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {selectedChat.isGroup ? (
                      <AvatarGroup max={3}>
                        <Avatar src={selectedChat.avatar} />
                        <Avatar src="https://mui.com/static/images/avatar/3.jpg" />
                        <Avatar src="https://mui.com/static/images/avatar/4.jpg" />
                      </AvatarGroup>
                    ) : (
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          selectedChat.online && (
                            <StatusIcon
                              sx={{
                                fontSize: 12,
                                color: 'success.main',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                              }}
                            />
                          )
                        }
                      >
                        <Avatar src={selectedChat.avatar} sx={{ width: 48, height: 48 }} />
                      </Badge>
                    )}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {selectedChat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedChat.online ? 'Online' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Voice call">
                      <IconButton sx={{ bgcolor: 'grey.100' }}>
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Video call">
                      <IconButton sx={{ bgcolor: 'grey.100' }}>
                        <VideoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More options">
                      <IconButton sx={{ bgcolor: 'grey.100' }}>
                        <MoreIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Box>

              {/* Chat Messages */}
              <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                overflow: 'auto', 
                bgcolor: 'grey.50',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                },
              }}>
                {mockMessages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </Box>

              {/* Chat Input */}
              <Box sx={{ p: 2, bgcolor: 'white' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'grey.100',
                    borderRadius: 3,
                  }}
                >
                  <Tooltip title="Add emoji">
                    <IconButton size="small">
                      <EmojiIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Attach file">
                    <IconButton size="small">
                      <AttachIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Send image">
                    <IconButton size="small">
                      <ImageIcon />
                    </IconButton>
                  </Tooltip>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    variant="standard"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                  <Tooltip title="Send message">
                    <IconButton 
                      color="primary"
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                </Paper>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default Messages;
