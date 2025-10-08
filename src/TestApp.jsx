import React from 'react';
import { AppShell, Container, Title, Text, Button } from '@mantine/core';

function TestApp() {
  return (
    <AppShell>
      <AppShell.Main>
        <Container size="lg" pt={50}>
          <Title order={1} ta="center" mb="xl">
            🚀 Squadbox Test Page
          </Title>
          <Text size="lg" ta="center" mb="xl">
            If you can see this, the frontend is working!
          </Text>
          <Text ta="center" mb="xl">
            Backend URL: {import.meta.env.VITE_API_URL || 'Not set'}
          </Text>
          <Button 
            onClick={() => {
              console.log('Test button clicked');
              alert('Frontend is working!');
            }}
            size="lg"
            mx="auto"
            display="block"
          >
            Test Button
          </Button>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default TestApp;