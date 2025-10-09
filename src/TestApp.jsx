import React from 'react';
import { Text, Container } from '@mantine/core';

const TestApp = () => {
  return (
    <Container>
      <Text size="xl" c="white">
        🚀 Squadbox Test - React is working!
      </Text>
      <Text size="md" c="dimmed">
        If you can see this, the React app is mounting correctly.
      </Text>
    </Container>
  );
};

export default TestApp;
