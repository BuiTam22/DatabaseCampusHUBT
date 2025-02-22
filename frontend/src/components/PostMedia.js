import React from 'react';
import { Box, Image } from '@chakra-ui/react';

const PostMedia = ({ media }) => {
  if (!media || media.length === 0) return null;

  return (
    <Box mt={4}>
      {media.map((item) => (
        <Box key={item.id} mb={4}>
          {item.type === 'IMAGE' ? (
            <Image
              src={item.url}
              alt="Post media"
              borderRadius="md"
              width="100%"
              maxH="500px"
              objectFit="cover"
              loading="lazy"
            />
          ) : item.type === 'VIDEO' ? (
            <video
              src={item.url}
              controls
              style={{
                width: '100%',
                maxHeight: '500px',
                borderRadius: '8px'
              }}
            />
          ) : null}
        </Box>
      ))}
    </Box>
  );
};

export default PostMedia; 