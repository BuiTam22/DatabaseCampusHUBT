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
import Editor from '@monaco-editor/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';

const CodingExam = () => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [testCases, setTestCases] = useState([]);
  const [passedTests, setPassedTests] = useState([]);

  // Mock data cho đề bài
  const examData = {
    title: "Bài tập lập trình Web",
    description: `Viết một hàm JavaScript để tính tổng các số trong một mảng và trả về kết quả.
    
Yêu cầu:
1. Hàm nhận vào một mảng số nguyên
2. Trả về tổng các phần tử trong mảng
3. Xử lý các trường hợp đặc biệt (mảng rỗng, phần tử không phải số)
4. Tối ưu hiệu suất cho mảng lớn`,
    testCases: [
      {
        id: 1,
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '15',
        description: 'Mảng cơ bản với các số dương'
      },
      {
        id: 2,
        input: '[-1, -2, 0, 1, 2]',
        expectedOutput: '0',
        description: 'Mảng có số âm và số 0'
      },
      {
        id: 3,
        input: '[]',
        expectedOutput: '0',
        description: 'Mảng rỗng'
      }
    ],
    initialCode: `function sumArray(arr) {
  // Viết code của bạn ở đây
  
}`,
  };

  useEffect(() => {
    setCode(examData.initialCode);
    setTestCases(examData.testCases);

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

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Thực thi code với các test case
      const passed = [];
      const results = [];

      for (const test of testCases) {
        try {
          // Evaluate code safely
          const testFunction = new Function('return ' + code)();
          const input = JSON.parse(test.input);
          const result = testFunction(input);
          const expected = JSON.parse(test.expectedOutput);
          
          if (result === expected) {
            passed.push(test.id);
          }
          
          results.push({
            id: test.id,
            passed: result === expected,
            output: result,
            expected: expected
          });
        } catch (err) {
          results.push({
            id: test.id,
            passed: false,
            error: err.message
          });
        }
      }

      setPassedTests(passed);
      setOutput(JSON.stringify(results, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await runTests();
    // TODO: Submit to backend
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
      bgcolor: '#1e1e1e'
    }}>
      {/* Left side - Problem description and test cases */}
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

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Test Cases</Typography>
          <Stack spacing={2}>
            {testCases.map((test) => (
              <Paper 
                key={test.id}
                sx={{ 
                  p: 2,
                  bgcolor: passedTests.includes(test.id) ? 'success.lighter' : 'background.default'
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Typography variant="subtitle2">Test case {test.id}</Typography>
                  {passedTests.includes(test.id) && <CheckIcon color="success" />}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {test.description}
                </Typography>
                <Typography variant="caption" component="pre" sx={{ mt: 1 }}>
                  Input: {test.input}
                  {'\n'}
                  Expected: {test.expectedOutput}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right side - Code editor and output */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Editor
          height="70%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            readOnly: timeLeft === 0
          }}
        />

        <Divider />

        <Box sx={{ flex: 1, p: 2, bgcolor: '#1e1e1e', color: '#fff' }}>
          <Stack direction="row" spacing={2} mb={2}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={runTests}
              disabled={loading || timeLeft === 0}
            >
              {loading ? 'Running...' : 'Run Tests'}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={loading || timeLeft === 0}
            >
              Submit
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="subtitle2" gutterBottom>
            Output:
          </Typography>
          <Paper 
            sx={{ 
              p: 2, 
              bgcolor: '#2d2d2d',
              color: '#fff',
              fontFamily: 'monospace',
              overflow: 'auto',
              maxHeight: '200px'
            }}
          >
            <pre>{output || 'No output yet'}</pre>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CodingExam; 