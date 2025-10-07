import React from 'react';
import { Container, Title, Text, Card, Grid, List, Button, Group, Badge, Image, Stack, Box } from '@mantine/core';
import { IconReceipt } from '@tabler/icons-react';

const plans = [
  { name: 'Free', price: '$0', features: ['3 builds/mo', 'Template library', 'Community support'], cta: 'Get Started' },
  { name: 'Basic', price: '$9', features: ['50 builds/mo', 'Priority queue', 'Email support'], cta: 'Choose Basic' },
  { name: 'Unlimited', price: '$29', features: ['Unlimited builds', 'All templates', 'Priority support'], cta: 'Choose Unlimited' },
];

const PricingPage = () => {
  return (
    <Container size="xl" py="xl">
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconReceipt size={32} color="var(--mantine-color-brand-6)" />
        Pricing
      </Title>

      {/* Bot Showcase */}
      <Box mb="xl" ta="center">
        <Text size="lg" c="dimmed" mb="md">Powered by our AI Development Squad</Text>
        <Group gap="md" justify="center">
          {[
            { name: 'Builder', image: '/images/bots/buiilder-bot.png' },
            { name: 'Deployer', image: '/images/bots/deployment-bot.png' },
            { name: 'Security', image: '/images/bots/data-police-bot.png' },
            { name: 'Designer', image: '/images/bots/deisgnger-bot.png' }
          ].map((bot, index) => (
            <Stack key={index} gap="xs" align="center">
              <Image
                src={bot.image}
                alt={bot.name}
                height={index === 0 ? 100 : index === 1 ? 80 : 60} // Builder Bot 250%, Deployment Bot 200%, others 150%
                width="auto"
                fit="contain"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
              />
              <Text size="xs" c="dimmed">{bot.name}</Text>
            </Stack>
          ))}
        </Group>
      </Box>

      <Grid gutter="lg">
        {plans.map((p) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={p.name}>
            <Card p="lg" style={{ border: 'none', backgroundColor: '#1a1a1a' }}>
              <Group justify="space-between" mb="sm">
                <Title order={3} m={0}>{p.name}</Title>
                <Badge size="lg" variant="light">{p.price}/mo</Badge>
              </Group>
              <List spacing="xs">
                {p.features.map((f) => (<List.Item key={f}>{f}</List.Item>))}
              </List>
              <Button fullWidth mt="md" color="brand" onClick={() => window.dispatchEvent(new CustomEvent('sbox:navigate', { detail: { view: 'subscriptions' } }))}>{p.cta}</Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Text ta="center" c="dimmed" mt="lg">All plans include full source code downloads.</Text>
    </Container>
  );
};

export default PricingPage;


