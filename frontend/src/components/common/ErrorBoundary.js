import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      errorInfo
    });

    // Log error to your error reporting service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    // You can implement error logging to your backend here
    console.error('Error details:', {
      error: error?.message,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  handleRetry = () => {
    // Clear any stored error states that might be causing the issue
    localStorage.removeItem('lastError');
    
    // Check if it's a token-related error
    if (this.state.error?.message?.toLowerCase().includes('token')) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    // Reset error state
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Reload the component
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Get user-friendly error message
      let errorMessage = 'Something went wrong.';
      if (this.state.error?.message) {
        if (this.state.error.message.includes('Network Error')) {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        } else if (this.state.error.message.includes('token')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (this.state.error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        }
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
          p={3}
        >
          <Alert 
            severity="error" 
            sx={{ mb: 2, width: '100%', maxWidth: 400 }}
          >
            {errorMessage}
          </Alert>
          
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <Box sx={{ mb: 2, maxWidth: '100%', overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={this.handleRetry}
            size="large"
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;