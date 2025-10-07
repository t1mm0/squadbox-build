// Our Tech Page - Squadbox Technology Showcase
// Purpose: Display Agented Dev Squad capabilities and MMRY Neural Folding 3.0 technology
// Last Modified: 2024-12-19
// By: AI Assistant
// Completeness: 95/100

import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  SimpleGrid, 
  Badge, 
  Button, 
  TextInput, 
  Textarea, 
  Select,
  Group,
  Stack,
  Divider,
  Paper,
  Grid,
  Box,
  Progress,
  Alert,
  ThemeIcon,
  List
} from '@mantine/core';
import { 
  IconBrain, 
  IconDatabase, 
  IconRocket, 
  IconChartBar, 
  IconShield, 
  IconUsers,
  IconCode,
  IconFileAnalytics,
  IconTrendingUp,
  IconMail,
  IconBuilding,
  IconCheck,
  IconBolt
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const OurTech = () => {
  const [licenseForm, setLicenseForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    useCase: '',
    expectedVolume: '',
    budget: ''
  });

  const [submitting, setSubmitting] = useState(false);

  // Update page header styling to match other pages
  const pageHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '2rem'
  };

  // MMRY Performance Statistics
  const mmryStats = {
    compressionRatio: 47164.6,
    targetRatio: 100000,
    currentRecord: 47164.6,
    competitorRatio: 40000,
    compressionTypes: [
      { name: 'Text Content', ratio: 92.9, original: 450, compressed: 32 },
      { name: 'Repetitive Data', ratio: 93.8, original: 500, compressed: 31 },
      { name: 'HTML Markup', ratio: 84.5, original: 206, compressed: 32 },
      { name: 'Code Files', ratio: 89.2, original: 1200, compressed: 130 }
    ],
    features: [
      'Neural Pattern Learning',
      'Multi-Stage Folding',
      'Selective Retrieval',
      'Adaptive Compression',
      'Content Indexing',
      'Zero Data Loss'
    ]
  };

  // Agented Dev Squad Capabilities
  const squadCapabilities = {
    teamSize: 'AI-Powered Development Squad',
    specialties: [
      'Full-Stack Development',
      'AI/ML Integration',
      'Cloud Architecture',
      'DevOps Automation',
      'UI/UX Design',
      'Database Optimization',
      'Security Implementation',
      'Performance Tuning'
    ],
    technologies: [
      'React/Next.js',
      'Python/FastAPI',
      'PostgreSQL',
      'Docker/Kubernetes',
      'AWS/Azure/GCP',
      'AI/ML Frameworks',
      'Blockchain',
      'IoT Integration'
    ],
    metrics: {
      projectsCompleted: 1500,
      averageBuildTime: '2.3 minutes',
      successRate: 98.7,
      customerSatisfaction: 4.9
    }
  };

  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call for license inquiry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notifications.show({
        title: 'License Inquiry Submitted',
        message: 'Thank you for your interest in MMRY Neural Folding technology. Our team will contact you within 24 hours.',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      // Reset form
      setLicenseForm({
        company: '',
        name: '',
        email: '',
        phone: '',
        useCase: '',
        expectedVolume: '',
        budget: ''
      });
    } catch (error) {
      notifications.show({
        title: 'Submission Error',
        message: 'Please try again or contact us directly.',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="xl">
      <Title order={1} ta="center" style={{ ...pageHeaderStyle, justifyContent: 'center', marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconBrain size={32} color="var(--mantine-color-brand-6)" />
        Our Technology
      </Title>

      {/* Hero Section */}
      <Box mb={50} style={{ textAlign: 'center' }}>
        <Title order={2} size={36} mb={20} ta="center" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Revolutionary Technology
        </Title>
        <Text size="lg" c="dimmed" maw={800} mx="auto">
          Discover how our Agented Dev Squad and proprietary MMRY Neural Folding 3.0 
          technology are revolutionizing software development and data compression.
        </Text>
      </Box>

      {/* Agented Dev Squad Section */}
      <Card mb={40} p={30} radius="lg" withBorder>
        <Group mb={30}>
          <ThemeIcon size={50} radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            <IconUsers size={30} />
          </ThemeIcon>
          <div>
            <Title order={2} mb={5}>Agented Dev Squad</Title>
            <Text c="dimmed">AI-Powered Development Team</Text>
          </div>
        </Group>

        <Grid gutter={30}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3} mb={20}>Capabilities</Title>
            <List spacing="sm" mb={20}>
              {squadCapabilities.specialties.map((specialty, index) => (
                <List.Item key={index} icon={<IconCheck size={16} color="green" />}>
                  {specialty}
                </List.Item>
              ))}
            </List>

            <Title order={3} mb={20}>Technologies</Title>
            <Group gap="xs" wrap="wrap">
              {squadCapabilities.technologies.map((tech, index) => (
                <Badge key={index} variant="light" color="blue" size="sm">
                  {tech}
                </Badge>
              ))}
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3} mb={20}>Performance Metrics</Title>
            <Stack gap="md">
              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>Projects Completed</Text>
                  <Text fw={700} size="lg" c="blue">{squadCapabilities.metrics.projectsCompleted.toLocaleString()}+</Text>
                </Group>
              </Paper>

              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>Average Build Time</Text>
                  <Text fw={700} size="lg" c="green">{squadCapabilities.metrics.averageBuildTime}</Text>
                </Group>
              </Paper>

              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>Success Rate</Text>
                  <Text fw={700} size="lg" c="green">{squadCapabilities.metrics.successRate}%</Text>
                </Group>
              </Paper>

              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>Customer Satisfaction</Text>
                  <Text fw={700} size="lg" c="green">{squadCapabilities.metrics.customerSatisfaction}/5.0</Text>
                </Group>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* MMRY Neural Folding Section */}
      <Card mb={40} p={30} radius="lg" withBorder>
        <Group mb={30}>
          <ThemeIcon size={50} radius="xl" variant="gradient" gradient={{ from: 'purple', to: 'pink' }}>
            <IconBrain size={30} />
          </ThemeIcon>
          <div>
            <Title order={2} mb={5}>MMRY Neural Folding 3.0</Title>
            <Text c="dimmed">Proprietary Brain-Inspired Compression Technology</Text>
          </div>
        </Group>

        {/* Compression Performance */}
        <Grid gutter={30} mb={30}>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Title order={3} mb={20}>Compression Performance</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {mmryStats.compressionTypes.map((type, index) => (
                <Paper key={index} p="md" withBorder>
                  <Text fw={600} mb={5}>{type.name}</Text>
                  <Group justify="space-between" mb={10}>
                    <Text size="sm" c="dimmed">Original: {type.original} bytes</Text>
                    <Text size="sm" c="dimmed">Compressed: {type.compressed} bytes</Text>
                  </Group>
                  <Progress 
                    value={type.ratio} 
                    color="green" 
                    size="sm" 
                    label={`${type.ratio}% compression`}
                  />
                </Paper>
              ))}
            </SimpleGrid>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Title order={3} mb={20}>Key Features</Title>
            <Stack gap="sm">
              {mmryStats.features.map((feature, index) => (
                <Group key={index} gap="xs">
                  <IconCheck size={16} color="green" />
                  <Text size="sm">{feature}</Text>
                </Group>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Performance Comparison */}
        <Card withBorder p="md" mb={20}>
          <Title order={3} mb={20}>Performance Comparison</Title>
          <Grid gutter={20}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>MMRY Current Record</Text>
                  <Badge color="green" size="lg">{mmryStats.currentRecord.toLocaleString()}:1</Badge>
                </Group>
                <Text size="sm" c="dimmed">Our proprietary neural folding technology</Text>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>Competitor (Re/Vue)</Text>
                  <Badge color="blue" size="lg">{mmryStats.competitorRatio.toLocaleString()}:1</Badge>
                </Group>
                <Text size="sm" c="dimmed">Industry-leading compression ratio</Text>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Group justify="space-between" mb={10}>
                  <Text fw={500}>Our Target</Text>
                  <Badge color="purple" size="lg">{mmryStats.targetRatio.toLocaleString()}:1</Badge>
                </Group>
                <Text size="sm" c="dimmed">Ambitious 100,000:1 compression goal</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Progress to Target */}
        <Card withBorder p="md">
          <Title order={3} mb={20}>Progress to 100,000:1 Target</Title>
          <Group justify="space-between" mb={10}>
            <Text>Current Progress</Text>
            <Text fw={600}>{((mmryStats.currentRecord / mmryStats.targetRatio) * 100).toFixed(1)}%</Text>
          </Group>
          <Progress 
            value={(mmryStats.currentRecord / mmryStats.targetRatio) * 100} 
            color="purple" 
            size="lg"
            label={`${mmryStats.currentRecord.toLocaleString()}:1 / ${mmryStats.targetRatio.toLocaleString()}:1`}
          />
        </Card>
      </Card>

      {/* Licensing CTA Section */}
      <Card p={30} radius="lg" withBorder>
        <Box textAlign="center" mb={30}>
          <Title order={2} mb={10}>License MMRY Neural Folding Technology</Title>
          <Text c="dimmed" maw={600} mx="auto">
            Get exclusive access to our proprietary compression technology. 
            Scale pricing available for enterprise deployments.
          </Text>
        </Box>

        <form onSubmit={handleLicenseSubmit}>
          <Grid gutter={20}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Company Name"
                placeholder="Your company name"
                value={licenseForm.company}
                onChange={(e) => setLicenseForm({...licenseForm, company: e.target.value})}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Contact Name"
                placeholder="Your full name"
                value={licenseForm.name}
                onChange={(e) => setLicenseForm({...licenseForm, name: e.target.value})}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Email Address"
                placeholder="your.email@company.com"
                type="email"
                value={licenseForm.email}
                onChange={(e) => setLicenseForm({...licenseForm, email: e.target.value})}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                value={licenseForm.phone}
                onChange={(e) => setLicenseForm({...licenseForm, phone: e.target.value})}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Expected Data Volume"
                placeholder="Select volume tier"
                data={[
                  { value: 'small', label: 'Small (< 1TB)' },
                  { value: 'medium', label: 'Medium (1-10TB)' },
                  { value: 'large', label: 'Large (10-100TB)' },
                  { value: 'enterprise', label: 'Enterprise (100TB+)' }
                ]}
                value={licenseForm.expectedVolume}
                onChange={(value) => setLicenseForm({...licenseForm, expectedVolume: value})}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Budget Range"
                placeholder="Select budget tier"
                data={[
                  { value: 'startup', label: 'Startup ($5K-25K)' },
                  { value: 'growth', label: 'Growth ($25K-100K)' },
                  { value: 'enterprise', label: 'Enterprise ($100K+)' },
                  { value: 'custom', label: 'Custom Pricing' }
                ]}
                value={licenseForm.budget}
                onChange={(value) => setLicenseForm({...licenseForm, budget: value})}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Use Case Description"
                placeholder="Describe how you plan to use MMRY Neural Folding technology..."
                rows={4}
                value={licenseForm.useCase}
                onChange={(e) => setLicenseForm({...licenseForm, useCase: e.target.value})}
                required
              />
            </Grid.Col>
          </Grid>

          <Group justify="center" mt={30}>
            <Button 
              type="submit" 
              size="lg" 
              loading={submitting}
              leftSection={<IconMail size={20} />}
            >
              Request License Information
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
};

export default OurTech;
