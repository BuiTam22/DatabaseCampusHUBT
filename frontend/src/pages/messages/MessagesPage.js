import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Divider,
  Badge,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  EmojiEmotions as EmojiIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  CallEnd as CallEndIcon
} from '@mui/icons-material';

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "10:30 AM",
    unread: 2,
    avatar: null
  },
  {
    id: 2,
    name: "Alice Smith",
    lastMessage: "The project is due tomorrow",
    time: "Yesterday",
    unread: 0,
    avatar: null
  },
  // Add more conversations...
];

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    sender: "John Doe",
    content: "Hey, how are you?",
    time: "10:30 AM",
    isMine: false
  },
  {
    id: 2,
    sender: "Me",
    content: "I'm good, thanks! How about you?",
    time: "10:31 AM",
    isMine: true
  },
  // Add more messages...
];

const MessagesPage = () => {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  // Add call actions
  const handleStartCall = (type) => {
    console.log(`Starting ${type} call...`);
    setIsInCall(true);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left sidebar - Conversations list */}
        <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
          <Paper sx={{ height: '100%' }}>
            {/* Search bar */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Divider />
            
            {/* Conversations list */}
            <List sx={{ height: 'calc(100% - 70px)', overflow: 'auto' }}>
              {mockConversations.map((chat) => (
                <ListItem key={chat.id} disablePadding>
                  <ListItemButton
                    selected={selectedChat === chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="primary"
                        variant="dot"
                        invisible={!chat.unread}
                      >
                        <Avatar>{chat.name[0]}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.name}
                      secondary={chat.lastMessage}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        fontWeight: chat.unread ? 'bold' : 'normal'
                      }}
                      secondaryTypographyProps={{
                        noWrap: true,
                        variant: 'body2'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {chat.time}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right side - Chat area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat header with call buttons */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                  <Avatar sx={{ mr: 2 }}>J</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">John Doe</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Online
                    </Typography>
                  </Box>
                  <Tooltip title="Voice Call">
                    <IconButton onClick={() => handleStartCall('voice')}>
                      <PhoneIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Video Call">
                    <IconButton onClick={() => handleStartCall('video')}>
                      <VideoCallIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Messages area */}
                <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                  {mockMessages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.isMine ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1,
                          px: 2,
                          maxWidth: '70%',
                          bgcolor: msg.isMine ? 'primary.main' : 'grey.100',
                          color: msg.isMine ? 'white' : 'text.primary'
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                        <Typography variant="caption" color={msg.isMine ? 'grey.300' : 'text.secondary'}>
                          {msg.time}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Message input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <TextField
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton size="small">
                            <EmojiIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <AttachFileIcon />
                          </IconButton>
                          <IconButton size="small" onClick={handleSendMessage} disabled={!message.trim()}>
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Active Call Overlay */}
      {isInCall && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="subtitle2">
            In call with John Doe
          </Typography>
          <IconButton
            color="error"
            onClick={() => setIsInCall(false)}
          >
            <CallEndIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default MessagesPage;
