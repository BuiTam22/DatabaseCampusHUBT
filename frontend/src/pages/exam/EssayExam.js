import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { extractPDFContent, calculateSimilarity } from '../../services/pdfService';
import { submitExam } from '../../services/examService';

const EssayExam = () => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [studentAnswer, setStudentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [pdfContent, setPdfContent] = useState('');
  const [score, setScore] = useState(null);

  // Mock data cho đề thi
  const examData = {
    title: "Tư tưởng Hồ Chí Minh",
    description: `Phân tích và đánh giá tư tưởng Hồ Chí Minh về vấn đề đoàn kết dân tộc. 
    Liên hệ với thực tiễn xây dựng khối đại đoàn kết toàn dân tộc ở Việt Nam hiện nay.

Yêu cầu:
1. Trình bày khái quát tư tưởng Hồ Chí Minh về đoàn kết dân tộc
2. Phân tích các nguyên tắc đoàn kết theo tư tưởng Hồ Chí Minh
3. Đánh giá ý nghĩa của tư tưởng đoàn kết trong giai đoạn hiện nay
4. Đề xuất giải pháp tăng cường đoàn kết dân tộc trong bối cảnh mới`,
    sampleAnswer: `Đoàn kết dân tộc là một trong những tư tưởng cốt lõi và xuyên suốt trong di sản tư tưởng của Chủ tịch Hồ Chí Minh...`,
  };

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const loadPdfContent = async () => {
      try {
        const content = await extractPDFContent('/datachamthi/giao-trinh-tu-tuong-ho-chi-minh.pdf');
        setPdfContent(content);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Không thể tải nội dung giáo trình');
      }
    };
    loadPdfContent();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!studentAnswer.trim()) {
      setError('Vui lòng nhập bài làm trước khi nộp');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Tính điểm dựa trên độ tương đồng
      const similarity = calculateSimilarity(studentAnswer, pdfContent);
      const calculatedScore = Math.round(similarity * 10);
      setScore(calculatedScore);

      // Gửi kết quả lên server
      await submitExam({
        answer: studentAnswer,
        score: calculatedScore,
        similarity: similarity
      });

      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate('/exams', { replace: true });
      }, 3000);

    } catch (err) {
      setError('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 64,
      left: isCollapsed ? '80px' : '280px',
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      display: 'flex',
      bgcolor: 'background.default'
    }}>
      {/* Left side - Problem description */}
      <Box sx={{ 
        width: '400px',
        height: '100%',
        bgcolor: 'background.paper',
        overflow: 'auto',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{examData.title}</Typography>
            <Chip 
              label={`Thời gian: ${formatTime(timeLeft)}`}
              color={timeLeft < 300 ? 'error' : 'default'}
            />
          </Stack>
          
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {examData.description}
          </Typography>
        </Box>
      </Box>

      {/* Right side - Answer editor */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1">Bài làm của bạn</Typography>
          </Box>

          <TextField
            multiline
            fullWidth
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="Nhập bài làm của bạn ở đây..."
            variant="outlined"
            disabled={timeLeft === 0}
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: '100%',
                '& textarea': {
                  height: '100% !important',
                }
              }
            }}
          />
        </Paper>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {score !== null && (
            <Alert severity="success" sx={{ flex: 1, mr: 2 }}>
              Điểm của bạn: {score}/10
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ flex: 1, mr: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || timeLeft === 0 || !studentAnswer.trim()}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Nộp bài'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EssayExam; 