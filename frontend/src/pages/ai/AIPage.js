import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Grid, Paper, TextField, IconButton, Typography, Avatar, CircularProgress, Tooltip, Card } from '@mui/material';
import { Send as SendIcon, Add as AddIcon, Bookmark as BookmarkIcon, History as HistoryIcon, Code as CodeIcon, Lightbulb as LightbulbIcon, EmojiEvents as RankingIcon } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { chat } from '../../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';

const AIPage = () => {
    const { isCollapsed } = useSidebar();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [recentChats, setRecentChats] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const navigate = useNavigate();
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Hàm parse timestamp
    const parseStoredMessages = (messages) => {
        return messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
        }));
    };

    // Load data từ localStorage
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem('currentChat');
            const savedRecentChats = localStorage.getItem('recentChats');
            
            if (savedMessages) {
                const parsedMessages = parseStoredMessages(JSON.parse(savedMessages));
                setMessages(parsedMessages);
            } else {
                setMessages([{
                    content: "Hello! I'm your AI assistant. How can I help you today?",
                    timestamp: new Date(),
                    sender: 'ai',
                }]);
            }

            if (savedRecentChats) {
                const parsedRecentChats = JSON.parse(savedRecentChats).map(chat => ({
                    ...chat,
                    messages: parseStoredMessages(chat.messages),
                    timestamp: new Date(chat.timestamp)
                }));
                setRecentChats(parsedRecentChats);
            }
        } catch (error) {
            console.error('Error loading saved chats:', error);
            // Reset to initial state if there's an error
            setMessages([{
                content: "Hello! I'm your AI assistant. How can I help you today?",
                timestamp: new Date(),
                sender: 'ai',
            }]);
            setRecentChats([]);
        }
    }, []);

    // Lưu messages vào localStorage
    useEffect(() => {
        try {
            if (messages.length > 0) {
                localStorage.setItem('currentChat', JSON.stringify(messages));
            }
        } catch (error) {
            console.error('Error saving current chat:', error);
        }
    }, [messages]);

    // Lưu recent chats vào localStorage
    useEffect(() => {
        try {
            if (recentChats.length > 0) {
                localStorage.setItem('recentChats', JSON.stringify(recentChats));
            }
        } catch (error) {
            console.error('Error saving recent chats:', error);
        }
    }, [recentChats]);

    // Thêm system prompt
    const systemPrompt = `You are an AI programming assistant. Only answer questions related to:
- Programming and software development
- Computer science and IT
- Web development, mobile development
- DevOps and system administration
- Databases and data structures
- Software architecture and design patterns
- Coding best practices and debugging
- Technology tools and frameworks

If the question is not related to these topics, politely inform the user that you can only assist with IT and programming related questions.

Always format your code examples properly and explain your solutions clearly.`;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            content: input,
            timestamp: new Date(),
            sender: 'user',
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Kết hợp system prompt với câu hỏi của user
            const fullPrompt = `${systemPrompt}\n\nUser: ${input}\nAssistant:`;
            const response = await chat(fullPrompt);
            
            // Kiểm tra nếu câu hỏi không liên quan đến IT
            if (response.toLowerCase().includes("i can only assist with")) {
                const aiMessage = {
                    content: "I apologize, but I can only assist with IT and programming related questions. Please feel free to ask any technical questions about software development, programming languages, or other IT topics.",
                    timestamp: new Date(),
                    sender: 'ai',
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                const aiMessage = {
                    content: response,
                    timestamp: new Date(),
                    sender: 'ai',
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            const errorMessage = {
                content: "Sorry, I encountered an error. Please try again with a programming or IT-related question.",
                timestamp: new Date(),
                sender: 'ai',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const formatMessage = (content) => {
        if (!content) return null;
        
        // Cải thiện regex để xử lý markdown tốt hơn
        const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*|\*[^*]+\*)/g);
        
        return parts.map((part, index) => {
            if (!part) return null;
            
            if (part.startsWith('```')) {
                const code = part.slice(3, -3).trim();
                return (
                    <Box key={index} sx={{ my: 2, width: '100%' }}>
                        <SyntaxHighlighter
                            language="javascript"
                            style={vs2015}
                            customStyle={{
                                borderRadius: '8px',
                                padding: '16px',
                                margin: '8px 0'
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    </Box>
                );
            } else if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <Typography
                        key={index}
                        component="span"
                        sx={{ 
                            fontWeight: 'bold',
                            display: 'inline',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {part.slice(2, -2)}
                    </Typography>
                );
            } else if (part.startsWith('*') && part.endsWith('*')) {
                return (
                    <Typography
                        key={index}
                        component="span"
                        sx={{ 
                            fontStyle: 'italic',
                            display: 'inline',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {part.slice(1, -1)}
                    </Typography>
                );
            }
            
            return (
                <Typography
                    key={index}
                    component="span"
                    sx={{ 
                        display: 'inline',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}
                >
                    {part}
                </Typography>
            );
        });
    };

    // Cập nhật suggested topics để focus vào IT
    const suggestedTopics = [
        {
            id: 1,
            title: 'Code Review',
            prompt: "Could you review my code and suggest improvements for better performance and maintainability?"
        },
        {
            id: 2,
            title: 'Debug Help',
            prompt: "I'm encountering a bug in my code. Can you help me identify and fix the issue?"
        },
        {
            id: 3,
            title: 'Architecture Design',
            prompt: "What's the best architecture pattern for building a scalable web application?"
        },
        {
            id: 4,
            title: 'Security Best Practices',
            prompt: "What are the essential security practices I should implement in my web application?"
        },
        {
            id: 5,
            title: 'Performance Optimization',
            prompt: "How can I optimize my application's performance and reduce loading time?"
        }
    ];

    // Xử lý suggested topic
    const handleTopicClick = (prompt) => {
        setInput(prompt);
    };

    // Xử lý new chat
    const handleNewChat = () => {
        try {
            if (messages.length > 1) {
                const newRecentChat = {
                    id: Date.now(),
                    title: messages[1].content.slice(0, 30) + "...",
                    messages: [...messages],
                    timestamp: new Date().toISOString()
                };
                setRecentChats(prev => [newRecentChat, ...prev].slice(0, 5));
            }
            
            const welcomeMessage = {
                content: "Hello! I'm your IT and programming assistant. I can help you with coding, debugging, architecture design, and other technical topics. How can I assist you today?",
                timestamp: new Date(),
                sender: 'ai',
            };
            setMessages([welcomeMessage]);
            setInput('');
        } catch (error) {
            console.error('Error creating new chat:', error);
        }
    };

    // Thêm hàm lưu chat
    const handleSaveChat = () => {
        try {
            if (messages.length > 1) {
                const chatToSave = {
                    id: Date.now(),
                    title: `Saved Chat - ${new Date().toLocaleDateString()}`,
                    messages: [...messages],
                    timestamp: new Date().toISOString()
                };
                
                setRecentChats(prev => {
                    // Kiểm tra xem chat đã được lưu chưa
                    const isDuplicate = prev.some(chat => 
                        JSON.stringify(chat.messages) === JSON.stringify(chatToSave.messages)
                    );
                    if (!isDuplicate) {
                        const newRecentChats = [chatToSave, ...prev].slice(0, 5);
                        // Lưu ngay lập tức vào localStorage
                        localStorage.setItem('recentChats', JSON.stringify(newRecentChats));
                        return newRecentChats;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    };

    // Xử lý recent chat
    const handleRecentChatClick = (chat) => {
        setMessages(chat.messages);
    };

    const handleRankingClick = () => {
        navigate('/rankings');
    };

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
                {/* Left Sidebar */}
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Start New Chat">
                                <IconButton 
                                    onClick={handleNewChat}
                                    color="primary" 
                                    sx={{ 
                                        flex: 1,
                                        py: 1,
                                        border: '1px dashed',
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <AddIcon /> <Typography sx={{ ml: 1 }}>New Chat</Typography>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="View Rankings">
                                <IconButton
                                    onClick={handleRankingClick}
                                    color="secondary"
                                    sx={{
                                        py: 1,
                                        border: '1px dashed',
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'secondary.light',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <RankingIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ 
                        flex: 1,
                        overflowY: 'auto',
                        px: 2,
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '3px',
                        }
                    }}>
                        {showSuggestions && (
                            <>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <LightbulbIcon sx={{ mr: 1 }} /> Suggested Topics
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                    {suggestedTopics.map((topic) => (
                                        <Paper
                                            key={topic.id}
                                            onClick={() => handleTopicClick(topic.prompt)}
                                            sx={{
                                                p: 1.5,
                                                mb: 1,
                                                cursor: 'pointer',
                                                '&:hover': { 
                                                    bgcolor: 'action.hover',
                                                    transform: 'translateX(5px)',
                                                    transition: 'all 0.2s'
                                                },
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <CodeIcon sx={{ mr: 1, fontSize: 20 }} />
                                            <Typography variant="body2">{topic.title}</Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            </>
                        )}

                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <HistoryIcon sx={{ mr: 1 }} /> Recent Chats
                        </Typography>
                        <Box>
                            {recentChats.map((chat) => (
                                <Paper
                                    key={chat.id}
                                    onClick={() => handleRecentChatClick(chat)}
                                    sx={{
                                        p: 1.5,
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { 
                                            bgcolor: 'action.hover',
                                            transform: 'translateX(5px)',
                                            transition: 'all 0.2s'
                                        }
                                    }}
                                >
                                    <Typography variant="body2" noWrap>{chat.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(chat.timestamp).toLocaleString()}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Main Chat Area */}
                <Box sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Chat Header */}
                    <Box sx={{ 
                        p: 2, 
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'grey.50',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 500 }}>AI Assistant</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ask me anything about programming and development
                            </Typography>
                        </Box>
                        <Box>
                            <Tooltip title="Save Current Chat">
                                <IconButton 
                                    onClick={handleSaveChat}
                                    disabled={messages.length <= 1}
                                    color="primary"
                                >
                                    <BookmarkIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="New Chat">
                                <IconButton 
                                    onClick={handleNewChat}
                                    color="primary"
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        p: 3,
                        bgcolor: 'grey.50',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '3px',
                        }
                    }}>
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    mb: 2,
                                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                                }}
                            >
                                <Avatar
                                    sx={{ 
                                        m: 1,
                                        bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main'
                                    }}
                                >
                                    {message.sender === 'user' ? 'U' : 'AI'}
                                </Avatar>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        borderRadius: 2,
                                        bgcolor: message.sender === 'user' ? 'primary.light' : 'white',
                                        color: message.sender === 'user' ? 'white' : 'text.primary',
                                        '& pre': {
                                            maxWidth: '100%',
                                            overflow: 'auto'
                                        },
                                        '& code': {
                                            fontFamily: 'monospace',
                                            backgroundColor: 'rgba(0,0,0,0.04)',
                                            padding: '2px 4px',
                                            borderRadius: '4px'
                                        }
                                    }}
                                >
                                    <Box sx={{ 
                                        wordBreak: 'break-word',
                                        '& > *': { mb: 1 },
                                        '& > *:last-child': { mb: 0 }
                                    }}>
                                        {formatMessage(message.content)}
                                    </Box>
                                    <Typography 
                                        variant="caption" 
                                        display="block" 
                                        sx={{ 
                                            mt: 1,
                                            opacity: 0.7,
                                            textAlign: message.sender === 'user' ? 'right' : 'left'
                                        }}
                                    >
                                        {message.timestamp.toLocaleTimeString()}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <CircularProgress size={30} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box 
                        component="form" 
                        onSubmit={handleSendMessage} 
                        sx={{ 
                            p: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'white'
                        }}
                    >
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message... (Shift + Enter for new line)"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: 'grey.50'
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton 
                                        type="submit" 
                                        disabled={isLoading || !input.trim()}
                                        color="primary"
                                        sx={{ 
                                            p: 1,
                                            '&:hover': {
                                                bgcolor: 'primary.light',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

export default AIPage;