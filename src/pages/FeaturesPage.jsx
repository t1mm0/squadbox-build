import React from 'react';
import { Container, Title, Text, Card, SimpleGrid, Group, Badge, Button, Stack, ThemeIcon, Image, Box } from '@mantine/core';
import { IconBolt, IconCode, IconRocket, IconShield, IconCloud, IconPuzzle } from '@tabler/icons-react';

const features = [
  { icon: <IconBolt size={22} />, title: 'Lightning Builds', desc: 'Generate full-stack apps in minutes with optimized pipelines.' },
  { icon: <IconCode size={22} />, title: 'Production-Ready Code', desc: 'Human-quality, readable code with testing and linting.' },
  { icon: <IconShield size={22} />, title: 'Secure by Default', desc: 'JWT auth, role-based access, and sensible security presets.' },
  { icon: <IconCloud size={22} />, title: 'One-Click Deploy', desc: 'Ship to your favorite cloud providers with minimal setup.' },
  { icon: <IconPuzzle size={22} />, title: 'Template Library', desc: 'Start from curated templates for common use-cases.' },
  { icon: <IconRocket size={22} />, title: 'MMRY Compression', desc: 'Proprietary compression for efficient storage and retrieval.' },
];

const FeaturesPage = () => {
  return (
    <Container size="xl" py="xl">
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconBolt size={32} color="var(--mantine-color-brand-6)" />
        Features
      </Title>

      <Text ta="center" c="dimmed" mb="xl">
        Build secure, scalable applications faster than ever with our AI-powered developer platform.
      </Text>

      {/* Bot Showcase */}
      <Box mb="xl" ta="center">
        <Text size="lg" c="dimmed" mb="md">Powered by our specialized AI bots</Text>
        <Group gap="md" justify="center">
          {[
            { name: 'Builder', image: '/images/bots/buiilder-bot.png' },
            { name: 'Deployer', image: '/images/bots/deployment-bot.png' },
            { name: 'Security', image: '/images/bots/data-police-bot.png' },
            { name: 'Designer', image: '/images/bots/deisgnger-bot.png' }
          ].map((bot, index) => (
            <Box key={index} ta="center">
              <Image
                src={bot.image}
                alt={bot.name}
                height={index === 0 ? 125 : index === 1 ? 100 : 75} // Builder Bot 250%, Deployment Bot 200%, others 150%
                width="auto"
                fit="contain"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
              />
              <Text size="xs" c="dimmed" mt="xs">{bot.name}</Text>
            </Box>
          ))}
        </Group>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {features.map((f) => (
          <Card key={f.title} p="lg" withBorder>
            <Group gap="sm" mb="xs">
              <ThemeIcon size={36} radius="md" color="brand" variant="light">{f.icon}</ThemeIcon>
              <Title order={4} m={0}>{f.title}</Title>
            </Group>
            <Text c="dimmed" size="sm">{f.desc}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Stack align="center" mt="xl">
        <Group>
          <Badge size="lg" variant="light" color="cyan">Free trial available</Badge>
          <Badge size="lg" variant="light" color="violet">No credit card required</Badge>
        </Group>
        <Button color="brand" size="md" component="a" href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('sbox:navigate', { detail: { view: 'main' } })); }}>Start Building</Button>
      </Stack>
    </Container>
  );
};

export default FeaturesPage;


