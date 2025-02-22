import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Button,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  MoreVert as MoreVertIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
  Analytics as AnalyzeIcon,
  ExpandMore,
  ExpandLess,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import ApiService from '../../services/apiService';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { chat } from '../../services/geminiService';

const PostCard = ({ post, onDelete, currentUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    mainPoints: false,
    insights: false,
    sentiment: false,
    topics: false
  });
  const [anchorElAnalysis, setAnchorElAnalysis] = useState(null);
  const openAnalysis = Boolean(anchorElAnalysis);

  // Kiểm tra xem bài viết có phải của user hiện tại không
  const isOwnPost = post.user?.userID === currentUser?.userID;

  // Log để debug
  console.log('PostCard received post:', post);
  console.log('PostCard user data:', post.user);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await ApiService.deletePost(post.id);
      onDelete?.(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    handleMenuClose();
  };

  const handleReport = () => {
    // Xử lý report post
    console.log('Reporting post:', post.id);
    handleMenuClose();
  };

  const handleLike = async () => {
    // Store current state before update
    const currentLiked = liked;
    const currentLikesCount = likesCount;
    
    try {
        // Optimistic update
        setLiked(!currentLiked);
        setLikesCount(currentLiked ? currentLikesCount - 1 : currentLikesCount + 1);

        const response = await ApiService.likePost(post.id);
        
        if (response?.data) {
            // Update with actual server state
            setLiked(response.data.liked);
            setLikesCount(response.data.likesCount);
        } else {
            // Revert on failure
            setLiked(currentLiked);
            setLikesCount(currentLikesCount);
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        // Revert on error
        setLiked(currentLiked);
        setLikesCount(currentLikesCount);
    }
  };

  const handleCommentClick = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      await fetchComments();
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await ApiService.getPostComments(post.id);
      if (response?.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await ApiService.addComment(post.id, commentText);
      if (response?.data) {
        setComments(prev => [response.data, ...prev]);
        setCommentsCount(prev => prev + 1);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Thêm hàm detectLanguage để nhận diện ngôn ngữ
  const detectLanguage = (text) => {
    // Đếm số ký tự tiếng Việt trong văn bản
    const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi;
    const vietnameseCount = (text.match(vietnamesePattern) || []).length;
    
    // Nếu có nhiều ký tự tiếng Việt, coi như là văn bản tiếng Việt
    return vietnameseCount > 5 ? 'vi' : 'en';
  };

  // Thêm prompts cho phân tích form chữ
  const formAnalysisPrompts = {
    vi: `
      Phân tích hình thức văn bản sau và đưa ra 4 điểm chính:

      1. Cấu trúc văn bản:
      - Phân tích cách tổ chức và trình bày văn bản
      - Đánh giá tính mạch lạc và logic của bố cục

      2. Ngôn ngữ sử dụng:
      - Đánh giá cách dùng từ và đặc điểm ngôn ngữ
      - Xem xét tính chính xác và phù hợp của từ ngữ

      3. Phong cách viết:
      - Nhận xét về giọng điệu và cách thể hiện
      - Đánh giá tính nhất quán của phong cách

      4. Hiệu quả truyền đạt:
      - Đánh giá khả năng truyền tải thông điệp
      - Nhận xét về tính thuyết phục và tác động

      Nội dung cần phân tích:
      ${post.content}

      Hãy phân tích chi tiết từng điểm, tập trung vào hình thức và cách thể hiện.
    `,
    en: `
      Analyze the form and style of the following text with 4 key points:

      1. Text Structure:
      - Analyze the organization and presentation
      - Evaluate coherence and logical flow

      2. Language Usage:
      - Assess word choice and language features
      - Examine accuracy and appropriateness

      3. Writing Style:
      - Comment on tone and expression
      - Evaluate style consistency

      4. Communication Effectiveness:
      - Assess message delivery
      - Comment on persuasiveness and impact

      Text to analyze:
      ${post.content}

      Please provide detailed analysis for each point, focusing on form and presentation.
    `
  };

  // Thêm prompts cho việc đọc nội dung
  const readingPrompts = {
    vi: `
      Đọc và trình bày lại nội dung sau một cách rõ ràng, dễ hiểu:

      1. Tóm tắt nội dung:
      - Trình bày ngắn gọn các ý chính
      - Giữ nguyên thông điệp quan trọng

      2. Giải thích thuật ngữ:
      - Làm rõ các khái niệm chuyên môn
      - Giải thích các từ ngữ phức tạp

      3. Bố cục lại nội dung:
      - Sắp xếp thông tin theo logic
      - Phân chia đoạn văn rõ ràng

      4. Kết luận chính:
      - Nhấn mạnh điểm quan trọng
      - Tổng hợp ý nghĩa chính

      Nội dung cần xử lý:
      ${post.content}

      Hãy trình bày lại nội dung theo cấu trúc trên, đảm bảo dễ đọc và dễ hiểu.
    `,
    en: `
      Read and present the following content clearly and comprehensibly:

      1. Content Summary:
      - Present main points concisely
      - Maintain key messages

      2. Term Explanation:
      - Clarify technical concepts
      - Explain complex terminology

      3. Content Restructuring:
      - Organize information logically
      - Clear paragraph division

      4. Main Conclusions:
      - Emphasize important points
      - Synthesize main meanings

      Content to process:
      ${post.content}

      Please present the content following this structure, ensuring readability and comprehension.
    `
  };

  // Sửa lại hàm handleAnalyze để chỉ phân tích nội dung
  const handleAnalyze = async (event) => {
    try {
      if (!post.content || post.content.length < 200) {
        setAnalyzing(true);
        setAnchorElAnalysis(event.currentTarget);
        const message = detectLanguage(post.content) === 'vi' 
          ? "Bài viết quá ngắn để phân tích. Vui lòng phân tích bài viết có ít nhất 200 ký tự."
          : "This post is too short for meaningful analysis. Please analyze posts with at least 200 characters.";
        setAnalysis(message);
        return;
      }

      setAnalyzing(true);
      setAnchorElAnalysis(event.currentTarget);
      
      const language = detectLanguage(post.content);
      
      const prompts = {
        vi: `
          Phân tích bài viết sau và đưa ra 4 điểm chính:

          1. Thông điệp chính:
          - Nội dung và mục đích chính của bài viết là gì?

          2. Bối cảnh:
          - Bối cảnh và thông tin nền tảng quan trọng của nội dung?

          3. Phân tích tác động:
          - Những ảnh hưởng và tác động tiềm tàng của bài viết?

          4. Điểm đáng chú ý:
          - Những insight và điểm đáng chú ý nhất?

          Nội dung bài viết:
          ${post.content}

          Hãy phân tích ngắn gọn và rõ ràng cho từng điểm. Giữ cấu trúc 4 điểm đánh số như trên.
        `,
        en: `
          Analyze the following social media post and provide exactly 4 key points:

          1. Main Message:
          - What is the core message or purpose of this post?

          2. Key Context:
          - What is the important context or background of this content?

          3. Impact Analysis:
          - What are the potential implications or effects of this post?

          4. Notable Insights:
          - What are the most interesting or valuable takeaways?

          Post content:
          ${post.content}

          Please provide a concise analysis for each point. Keep each point focused and clear.
          Format your response with exactly these 4 numbered points, maintaining this structure.
        `
      };

      const response = await chat(prompts[language]);
      setAnalysis(response);
    } catch (error) {
      console.error('Error analyzing post:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCloseAnalysis = () => {
    setAnchorElAnalysis(null);
  };

  const handleToggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    console.log('Rendering media:', post.media); // Log để kiểm tra dữ liệu

    return (
      <Box sx={{ mt: 2, display: 'grid', gap: 1, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {post.media.map((media, index) => {
          console.log('Rendering media item:', media); // Log từng item

          return (
            <Box 
              key={index}
              component="img"
              src={media.url}
              alt={`Post media ${index + 1}`}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                borderRadius: 1,
                objectFit: 'cover'
              }}
              onError={(e) => {
                console.error('Error loading image:', media.url);
                e.target.src = '/default-post-image.jpg';
              }}
            />
          );
        })}
      </Box>
    );
  };

  // Sửa lại hàm formatAnalysis để kiểm tra kiểu dữ liệu
  const formatAnalysis = (text) => {
    // Kiểm tra nếu text là null hoặc undefined
    if (!text) return [];
    
    // Đảm bảo text là string
    const analysisText = String(text);
    
    const language = detectLanguage(post.content);
    
    const titles = {
      vi: [
        'Thông điệp chính',
        'Bối cảnh',
        'Phân tích tác động',
        'Điểm đáng chú ý'
      ],
      en: [
        'Main Message',
        'Key Context',
        'Impact Analysis',
        'Notable Insights'
      ]
    };
    
    try {
      // Tách các phần theo số thứ tự và lọc bỏ phần tử rỗng
      const sections = analysisText.split(/\d+\./g).filter(Boolean);
      
      // Map các phần thành đối tượng có title và content
      return sections.map((section, index) => ({
        title: titles[language][index] || `Point ${index + 1}`,
        content: section.replace(/[#*-]/g, '').trim()
      })).slice(0, 4);
    } catch (error) {
      console.error('Error formatting analysis:', error);
      // Trả về mảng rỗng nếu có lỗi
      return [];
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar 
            src={post.user?.image}
            sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40
            }}
          >
            {post.user?.fullName?.[0]}
          </Avatar>
        }
        title={
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              {post.user?.fullName}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                color: 'text.secondary',
                mt: -0.5 
              }}
            >
              @{post.user?.username}
            </Typography>
          </Box>
        }
        subheader={
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Typography>
        }
        action={
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        }
        sx={{
          '& .MuiCardHeader-content': {
            overflow: 'hidden'
          }
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isOwnPost ? (
          // Menu cho bài viết của chính mình
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        ) : (
          // Menu cho bài viết của người khác
          <MenuItem onClick={handleReport}>
            <ListItemIcon>
              <ReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </MenuItem>
        )}
      </Menu>

      <CardContent>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2,
            whiteSpace: 'pre-wrap',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif',
            fontSize: '1rem',
            lineHeight: 1.75,
            letterSpacing: '0.00938em',
            '& p': {
              marginBottom: '1em',
              '&:last-child': {
                marginBottom: 0
              }
            }
          }}
        >
          {post.content.split('\n').map((paragraph, index) => {
            // Xử lý và chuẩn hóa text
            const normalizedText = paragraph
              .normalize('NFC')  // Chuẩn hóa Unicode
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/#(\w+)/g, '<a href="/tag/$1">#$1</a>');
            
            return (
              <p 
                key={index}
                dangerouslySetInnerHTML={{ 
                  __html: normalizedText
                }}
                style={{
                  margin: 0,
                  padding: 0,
                  wordBreak: 'break-word'
                }}
              />
            );
          })}
        </Typography>
        {renderMedia()}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton 
            onClick={handleLike}
            color={liked ? "error" : "default"}
            sx={{ 
                '&:hover': { 
                    bgcolor: liked ? 'error.light' : 'action.hover' 
                }
            }}
          >
            {liked ? <FavoriteIcon sx={{ color: '#f44336' }} /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likesCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
          <IconButton 
            onClick={handleCommentClick}
            color={showComments ? "primary" : "default"}
          >
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {commentsCount}
          </Typography>
        </Box>

        <Tooltip title="AI Analysis">
          <IconButton 
            onClick={handleAnalyze}
            disabled={analyzing}
            color="primary"
          >
            {analyzing ? (
              <CircularProgress size={24} />
            ) : (
              <AnalyzeIcon />
            )}
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Comment Input */}
          <Box 
            component="form" 
            onSubmit={handleAddComment}
            sx={{ 
              display: 'flex',
              gap: 1,
              mb: 2 
            }}
          >
            <Avatar 
              src={currentUser?.image}
              sx={{ width: 32, height: 32 }}
            >
              {currentUser?.fullName?.[0]}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              InputProps={{
                sx: { borderRadius: 3 }
              }}
            />
            <Button 
              variant="contained"
              type="submit"
              disabled={!commentText.trim()}
              sx={{ borderRadius: 2 }}
            >
              Post
            </Button>
          </Box>

          {/* Comments List */}
          {loadingComments ? (
            <CircularProgress size={20} sx={{ ml: 2 }} />
          ) : (
            <List>
              {comments.map((comment) => (
                <ListItem 
                  key={comment.id}
                  alignItems="flex-start"
                  sx={{ px: 0 }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={comment.user?.image}
                      sx={{ width: 32, height: 32 }}
                    >
                      {comment.user?.fullName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {comment.user?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.content}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Collapse>

      {/* Dialog hiển thị kết quả phân tích */}
      <Menu
        anchorEl={anchorElAnalysis}
        open={openAnalysis}
        onClose={handleCloseAnalysis}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            width: '400px',
            padding: '16px',
            borderRadius: '12px',
            ml: 1,
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            pb: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h6">AI Analysis</Typography>
            <IconButton size="small" onClick={handleCloseAnalysis}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Phần hiển thị phân tích trong Menu */}
          <Box>
            {(!post.content || post.content.length < 200) ? (
              <Box 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                <Typography>
                  {detectLanguage(post.content) === 'vi' 
                    ? "Bài viết quá ngắn để phân tích. Vui lòng phân tích bài viết có ít nhất 200 ký tự."
                    : "This post is too short for meaningful analysis. Please analyze posts with at least 200 characters."}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  {detectLanguage(post.content) === 'vi' ? 'Phân tích nội dung' : 'Content Analysis'}
                </Typography>
                {formatAnalysis(analysis).map((section, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      mb: 2,
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 500,
                        color: 'primary.main',
                        mb: 1
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6 
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Menu>
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string,
    user: PropTypes.shape({
      userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      fullName: PropTypes.string,
      username: PropTypes.string,
      image: PropTypes.string,
      avatarUrl: PropTypes.string
    }).isRequired,
    createdAt: PropTypes.string,
    likesCount: PropTypes.number,
    commentsCount: PropTypes.number,
    isLiked: PropTypes.bool,
    media: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string.isRequired,
          type: PropTypes.string
        })
      ])
    )
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fullName: PropTypes.string,
    image: PropTypes.string
  })
};

export default PostCard;