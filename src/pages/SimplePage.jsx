import React from 'react';
import { Title, Text, Stack, Paper, Divider } from '@mantine/core';

const SimplePage = ({ title, description }) => {
  return (
    <Stack gap="md">
      <Title order={1} ta="center">{title}</Title>
      {description && (
        <Text size="sm" c="dimmed" style={{ lineHeight: 1.7, maxWidth: 800 }}>
          {description}
        </Text>
      )}
      <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-8)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Text size="sm" c="dimmed">This page is under construction.</Text>
      </Paper>
      <Divider my="sm" />
    </Stack>
  );
};

export default SimplePage;


