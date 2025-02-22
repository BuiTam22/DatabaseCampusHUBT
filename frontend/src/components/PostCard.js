import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import PostMedia from './PostMedia';

const PostCard = ({ post, onDelete }) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar 
            src={post.user.avatarUrl} 
            alt={post.user.username}
          />
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={post.user.fullName || post.user.username}
        subheader={`@${post.user.username} • ${formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}`}
      />

      {post.content && (
        <CardContent>
          <Typography variant="body1" component="p">
            {post.content}
          </Typography>
        </CardContent>
      )}

      <PostMedia media={post.mediaList || post.media || []} />

      <CardActions disableSpacing>
        <IconButton color={post.isLiked ? "primary" : "default"}>
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {post.likesCount || 0}
        </Typography>
        
        <Box ml={2}>
          <IconButton>
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            {post.commentsCount || 0}
          </Typography>
        </Box>

        <Box ml={2}>
          <IconButton>
            <ShareIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PostCard; 