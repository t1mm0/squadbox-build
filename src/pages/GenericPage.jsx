import React from 'react';
import { Container, Title, Text } from '@mantine/core';

const GenericPage = ({ icon = null, title = 'Page', children }) => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      {icon}
      {title}
    </Title>
    {children || <Text c="dimmed">Content coming soon.</Text>}
  </Container>
);

export default GenericPage;


