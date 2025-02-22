import React from 'react';
import { Box, Grid, Container } from '@mui/material';
import PostList from '../components/post/PostList';
import Stories from '../components/stories/Stories';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Main content */}
        <Grid item xs={12} md={8}>
          {/* Stories section */}
          <ErrorBoundary>
            <Box mb={3}>
              <Stories />
            </Box>
          </ErrorBoundary>
          
          {/* Posts section */}
          <ErrorBoundary>
            <PostList />
          </ErrorBoundary>
        </Grid>

        {/* Right sidebar */}
        <Grid item xs={12} md={4}>
          <ErrorBoundary>
            <RightSidebar />
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Home);