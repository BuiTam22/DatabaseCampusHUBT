import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

const PostActions = ({ postId, isLiked, likesCount, commentsCount, onLike, onComment }) => {
  return (
    <Flex mt={4} gap={4}>
      <Button
        leftIcon={isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
        variant="ghost"
        onClick={() => onLike && onLike(postId)}
      >
        <Text>{likesCount || 0}</Text>
      </Button>
      <Button
        leftIcon={<FaComment />}
        variant="ghost"
        onClick={() => onComment && onComment(postId)}
      >
        <Text>{commentsCount || 0}</Text>
      </Button>
    </Flex>
  );
};

export default PostActions; 