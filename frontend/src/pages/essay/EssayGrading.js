import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Divider,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Compare as CompareIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useSidebar } from '../../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';

const EssayGrading = () => {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const [studentText, setStudentText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabCount, setTabCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);

  // Mock original text (in real app, this would come from API)
  const originalText = `In today's digital age, artificial intelligence has become an integral part of our daily lives...`;

  useEffect(() => {
    // Check if user is blocked
    const blockedUntil = localStorage.getItem('essayBlockedUntil');
    if (blockedUntil && new Date(blockedUntil) > new Date()) {
      setIsBlocked(true);
      setTimeLeft(new Date(blockedUntil));
    }

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (examStarted && document.hidden) {
        setTabCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) { // Show warning at 2 attempts
            setShowWarning(true);
          }
          if (newCount >= 3) { // Block at 3 attempts
            const blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            localStorage.setItem('essayBlockedUntil', blockUntil.toISOString());
            setIsBlocked(true);
            setTimeLeft(blockUntil);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examStarted]);

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleGrading = async () => {
    if (!studentText) {
      setError('Please complete your essay before submitting');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const mockResult = {
        score: 85,
        feedback: {
          content: 'Good understanding of the main concepts',
          structure: 'Well-organized paragraphs',
          grammar: 'Minor grammatical errors',
          suggestions: [
            'Consider adding more specific examples',
            'Strengthen the conclusion',
          ],
        },
        similarity: 78,
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      setResult(mockResult);
      setExamStarted(false); // End exam mode
    } catch (err) {
      setError('Failed to grade essay. Please try again.');
      console.error('Grading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isBlocked) {
    return (
      <Box sx={{ 
        position: 'fixed',
        top: 64,
        left: isCollapsed ? '80px' : '280px',
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}>
        <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom color="error">
            Access Blocked
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You have been blocked from taking essays for 24 hours due to multiple tab switching attempts.
            You can try again after: {new Date(timeLeft).toLocaleString()}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

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
      <Card elevation={0} sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3, overflow: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Essay Examination
          </Typography>

          {!examStarted ? (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Important Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • You will have 60 minutes to complete the essay
                • Switching tabs or leaving the window more than 3 times will result in a 24-hour block
                • Make sure you have a stable internet connection
                • Your work will be automatically saved
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleStartExam}
                sx={{ mt: 2 }}
              >
                Start Essay
              </Button>
            </Paper>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Essay Topic
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {originalText}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Your Answer
                </Typography>
                <TextField
                  multiline
                  rows={12}
                  fullWidth
                  placeholder="Write your essay here..."
                  value={studentText}
                  onChange={(e) => setStudentText(e.target.value)}
                  variant="outlined"
                  disabled={loading}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <CompareIcon />}
                  onClick={handleGrading}
                  disabled={loading || !studentText}
                >
                  {loading ? 'Submitting...' : 'Submit Essay'}
                </Button>
              </Box>
            </>
          )}

          {/* Results Section */}
          {result && (
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Grading Results
              </Typography>
              
              <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="overline">Score</Typography>
                  <Typography variant="h4" color="primary.main">
                    {result.score}%
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="overline">Similarity</Typography>
                  <Typography variant="h4" color="secondary.main">
                    {result.similarity}%
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="subtitle1" gutterBottom>
                Feedback
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Content:</strong> {result.feedback.content}
                </Typography>
                <Typography variant="body2">
                  <strong>Structure:</strong> {result.feedback.structure}
                </Typography>
                <Typography variant="body2">
                  <strong>Grammar:</strong> {result.feedback.grammar}
                </Typography>
              </Stack>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Suggestions for Improvement
              </Typography>
              <Stack spacing={1}>
                {result.feedback.suggestions.map((suggestion, index) => (
                  <Typography key={index} variant="body2">
                    • {suggestion}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>
      </Card>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon color="warning" />
            <Typography>Warning</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have switched tabs {tabCount} times. If you switch tabs one more time, 
            you will be blocked from taking essays for 24 hours.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)} variant="contained">
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EssayGrading; 