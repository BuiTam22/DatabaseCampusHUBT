import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Alert,
} from '@mui/material';
import {
  School as SubjectIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSidebar } from '../../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';

const ExamPage = () => {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [error, setError] = useState(null);

  // Mock data cho các môn thi trong ngày
  const todayExams = [
    {
      id: 1,
      subject: "Tư tưởng Hồ Chí Minh",
      time: "08:00 - 09:30",
      duration: 90,
      totalStudents: 45,
      status: "ongoing",
      type: "essay",
      description: "Thi tự luận - Phân tích và đánh giá"
    },
    {
      id: 2,
      subject: "Lịch sử Đảng",
      time: "10:00 - 11:30",
      duration: 90,
      totalStudents: 38,
      status: "upcoming",
      type: "essay",
      description: "Thi tự luận - Nghiên cứu và phân tích"
    },
    {
      id: 3,
      subject: "Triết học Mac-Lenin",
      time: "13:30 - 15:00",
      duration: 90,
      totalStudents: 42,
      status: "upcoming",
      type: "essay",
      description: "Thi tự luận - Lý luận và thực tiễn"
    },
    {
      id: 4,
      subject: "Lập trình Web",
      time: "15:30 - 17:00", 
      duration: 90,
      totalStudents: 35,
      status: "upcoming",
      type: "coding",
      description: "Thi lập trình - Giải thuật và thực hành"
    },
    {
      id: 5,
      subject: "Cơ sở dữ liệu",
      time: "08:00 - 09:30",
      duration: 90,
      totalStudents: 40,
      status: "upcoming",
      type: "coding",
      description: "Thi lập trình - SQL và thiết kế CSDL"
    }
  ];

  const handleStartExam = () => {
    if (!selectedSubject) {
      setError('Vui lòng chọn môn thi');
      return;
    }
    setOpenConfirm(true);
  };

  const handleConfirmExam = () => {
    setOpenConfirm(false);
    switch (selectedSubject.type) {
      case 'coding':
        navigate(`/coding-exam?subject=${selectedSubject.subject}`);
        break;
      case 'essay':
        navigate(`/essay-exam?subject=${selectedSubject.subject}`);
        break;
      default:
        setError('Invalid exam type');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'success';
      case 'upcoming':
        return 'primary';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing':
        return 'Đang diễn ra';
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      default:
        return status;
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
      zIndex: 1,
      borderLeft: '1px solid',
      borderColor: 'divider',
      transition: 'left 0.3s ease',
    }}>
      <Card elevation={0} sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* Left Side - Exam List */}
        <Box
          sx={{
            width: 320,
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Danh sách môn thi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>

          <List sx={{ flex: 1, overflow: 'auto' }}>
            {todayExams.map((exam) => (
              <ListItem
                key={exam.id}
                onClick={() => setSelectedSubject(exam)}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  bgcolor: selectedSubject?.id === exam.id ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemIcon>
                  <SubjectIcon 
                    color={exam.type === 'programming' ? 'secondary' : 'primary'} 
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{exam.subject}</Typography>
                      <Chip
                        label={exam.type === 'coding' ? 'Thi code' : 'Tự luận'}
                        size="small"
                        color={exam.type === 'coding' ? 'secondary' : 'primary'}
                        variant="outlined"
                        sx={{ height: 20 }}
                      />
                    </Stack>
                  }
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimerIcon sx={{ fontSize: 14 }} />
                      <Typography variant="caption">
                        {exam.time}
                      </Typography>
                      <Chip
                        label={getStatusText(exam.status)}
                        size="small"
                        color={getStatusColor(exam.status)}
                        sx={{ height: 20 }}
                      />
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Side - Exam Selection */}
        <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h5" gutterBottom>
            Bắt đầu thi
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Chọn môn thi
            </Typography>
            <Autocomplete
              options={todayExams}
              getOptionLabel={(option) => option.subject}
              value={selectedSubject}
              onChange={(event, newValue) => {
                setSelectedSubject(newValue);
                setError(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Môn thi"
                  variant="outlined"
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SubjectIcon color="primary" />
                    <Box>
                      <Typography>{option.subject}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.time} • {option.duration} phút
                      </Typography>
                    </Box>
                  </Stack>
                </li>
              )}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleStartExam}
              sx={{ mt: 3 }}
              disabled={!selectedSubject}
            >
              Bắt đầu thi
            </Button>
          </Paper>

          {selectedSubject && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin môn thi
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Môn thi
                  </Typography>
                  <Typography variant="body1">
                    {selectedSubject.subject}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Hình thức thi
                  </Typography>
                  <Typography variant="body1">
                    {selectedSubject.type === 'programming' ? 'Thi tự luận' : 'Thi trắc nghiệm'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedSubject.description}
                  </Typography>
                </Box>
                {selectedSubject.type === 'theory' && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Số câu hỏi
                    </Typography>
                    <Typography variant="body1">
                      {selectedSubject.questions} câu
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Thời gian
                  </Typography>
                  <Typography variant="body1">
                    {selectedSubject.time} ({selectedSubject.duration} phút)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Số lượng thí sinh
                  </Typography>
                  <Typography variant="body1">
                    {selectedSubject.totalStudents} thí sinh
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}
        </Box>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon color="warning" />
            <Typography>Xác nhận bắt đầu thi</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn bắt đầu thi môn {selectedSubject?.subject}?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            • Hình thức: {selectedSubject?.type === 'programming' ? 'Thi tự luận' : 'Thi trắc nghiệm'}
            <br />
            • Thời gian làm bài: {selectedSubject?.duration} phút
            <br />
            • Không được phép thoát trang khi đang thi
            <br />
            • Bài thi sẽ tự động nộp khi hết thời gian
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>
            Hủy
          </Button>
          <Button 
            variant="contained"
            onClick={handleConfirmExam}
            color={selectedSubject?.type === 'programming' ? 'secondary' : 'primary'}
          >
            Bắt đầu thi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamPage; 