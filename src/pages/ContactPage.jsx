import React from 'react';
import { Container, Title, Text, Card, TextInput, Textarea, Button, Grid } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import MeetingScheduler from '../components/MeetingScheduler';

const ContactPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconMail size={32} color="var(--mantine-color-brand-6)" />
      Contact
    </Title>
    <Card p="xl" withBorder>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput label="Name" placeholder="Your name" required />
          <TextInput mt="md" label="Email" placeholder="you@example.com" required />
          <TextInput mt="md" label="Subject" placeholder="How can we help?" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea label="Message" placeholder="Write your message..." minRows={8} />
          <Button mt="md" color="brand">Send</Button>
        </Grid.Col>
      </Grid>
      <Text size="sm" c="dimmed" mt="md">Email: hello@squadbox.uk</Text>
    </Card>
    <Card p="xl" withBorder mt="xl">
      <Title order={3} ta="center" mb="sm">Prefer to talk? Book a demo call</Title>
      <Text ta="center" c="dimmed" mb="md">Pick a time that works for you and we’ll walk you through the platform.</Text>
      <MeetingScheduler />
    </Card>
  </Container>
);

export default ContactPage;


