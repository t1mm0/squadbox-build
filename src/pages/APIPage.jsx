import React from 'react';
import { Container, Title, Text, Card, Code, Stack } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';

const APIPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconCode size={32} color="var(--mantine-color-brand-6)" />
      API
    </Title>
    <Card p="xl" withBorder>
      <Stack gap="sm">
        <Text>Base URL: https://api.squadbox.uk</Text>
        <Text>Auth: Bearer <Code>JWT</Code></Text>
        <div>
          <Text fw={600} mb={4}>List Templates</Text>
          <Code block>{`GET /templates\nAuthorization: Bearer <token>`}</Code>
        </div>
        <div>
          <Text fw={600} mb={4}>Generate Project</Text>
          <Code block>{`POST /generate-project\nAuthorization: Bearer <token>\nContent-Type: multipart/form-data\n\nfields:\n- project_name: string\n- requirements: string[]\n- template_id: string (optional)`}</Code>
        </div>
      </Stack>
    </Card>
  </Container>
);

export default APIPage;


