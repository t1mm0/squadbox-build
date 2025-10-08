/*
 * Investors.jsx
 * Purpose: Investors page for Squadbox
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Card, 
  Grid, 
  Button, 
  Group, 
  Badge,
  List,
  ThemeIcon,
  Paper,
  Box,
  TextInput
} from '@mantine/core';
import { 
  IconTrendingUp, 
  IconUsers, 
  IconBrain, 
  IconRocket,
  IconChartBar,
  IconTarget,
  IconCheck,
  IconMail,
  IconDownload,
  IconCalendar
} from '@tabler/icons-react';
import MeetingScheduler from './components/MeetingScheduler';
import CalElementTrigger from './components/CalElementTrigger';

import { useAuth } from './SimpleAuthContext';

const MEETING_SCHEDULER_URL = import.meta.env.VITE_SCHEDULER_URL || 'https://cal.com/teknoledg-g/30min?embed=true';

const Investors = () => {
  const { profile } = useAuth();
  const metrics = {
    users: '2,847',
    projects: '12,456',
    revenue: '$89,400',
    growth: '312%',
    retention: '94%',
    satisfaction: '4.8/5'
  };

  const technology = {
    mmryCompression: '47,164:1',
    buildTime: '2.3s avg',
    successRate: '98.7%',
    scalability: '10M+ users'
  };

  const marketData = {
    marketSize: '$45.2B',
    growthRate: '23.4% CAGR',
    targetSegment: 'SMB & Enterprise',
    competitiveAdvantage: 'MMRY Technology'
  };

  const [unlocked, setUnlocked] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [error, setError] = useState('');

  return (
    <Container size="xl" py="xl">
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconTrendingUp size={32} color="var(--mantine-color-brand-6)" />
        Investors
      </Title>

      <Stack gap="xl">
        {/* Hero Section */}
        <Card p="xl" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Title order={2} mb="md">Revolutionizing Software Development</Title>
              <Text size="lg" c="dimmed" mb="lg">
                Squadbox is pioneering the future of AI-powered software development with our proprietary 
                MMRY Neural Folding technology. We're democratizing software creation, enabling anyone 
                to build enterprise-grade applications in minutes, not months.
              </Text>
              <Group>
                <Button component="a" href="mailto:Hello@teknoledg.com" color="brand" leftSection={<IconMail size={16} />}> 
                  Contact Investment Team
                </Button>
                <CalElementTrigger>
                  <Button
                    variant="light"
                    leftSection={<IconCalendar size={16} />}
                    data-cal-link="teknoledg-g/30min"
                    data-cal-namespace="30min"
                    data-cal-config='{"layout":"month_view"}'
                  >
                    Book a Meeting
                  </Button>
                </CalElementTrigger>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Text fw={600} mb="xs">Investment Highlights</Text>
                <List spacing="xs">
                  <List.Item>Proprietary MMRY compression technology</List.Item>
                  <List.Item>Rapid user growth and retention</List.Item>
                  <List.Item>Large addressable market</List.Item>
                  <List.Item>Strong competitive moats</List.Item>
                </List>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Request Investor Access card hidden per user request */}

        <Box style={{ position: 'relative' }}>
          <div style={{ filter: unlocked ? 'none' : 'blur(10px)', transition: 'filter 0.2s ease', pointerEvents: unlocked ? 'auto' : 'none' }}>

        {/* Key Metrics */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Key Performance Metrics</Title>
          <Grid>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="brand">{metrics.users}</Text>
                <Text size="sm" c="dimmed">Active Users</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="green">{metrics.projects}</Text>
                <Text size="sm" c="dimmed">Projects Built</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="blue">{metrics.revenue}</Text>
                <Text size="sm" c="dimmed">Monthly Revenue</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="orange">{metrics.growth}</Text>
                <Text size="sm" c="dimmed">YoY Growth</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Technology Advantage */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Proprietary Technology Advantage</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Group mb="xs">
                    <IconBrain size={20} color="var(--mantine-color-purple-6)" />
                    <Text fw={600}>MMRY Neural Folding 3.0</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Our proprietary compression technology achieves 47,164:1 compression ratios, 
                    enabling efficient storage and retrieval of complex codebases.
                  </Text>
                </div>
                <div>
                  <Group mb="xs">
                    <IconRocket size={20} color="var(--mantine-color-green-6)" />
                    <Text fw={600}>AI-Powered Generation</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Advanced AI models generate production-ready code with 98.7% success rate 
                    and average build times under 3 seconds.
                  </Text>
                </div>
                <div>
                  <Group mb="xs">
                    <IconUsers size={20} color="var(--mantine-color-blue-6)" />
                    <Text fw={600}>Scalable Architecture</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Cloud-native infrastructure supports millions of concurrent users with 
                    99.9% uptime and global CDN distribution.
                  </Text>
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Technology Metrics</Text>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm">MMRY Compression Ratio</Text>
                    <Badge color="purple" variant="light">{technology.mmryCompression}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Average Build Time</Text>
                    <Badge color="green" variant="light">{technology.buildTime}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Success Rate</Text>
                    <Badge color="blue" variant="light">{technology.successRate}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Scalability Target</Text>
                    <Badge color="orange" variant="light">{technology.scalability}</Badge>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Market Opportunity */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Market Opportunity</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <div>
                  <Text fw={600} mb="xs">Total Addressable Market</Text>
                  <Text size="lg" fw={700} c="brand">{marketData.marketSize}</Text>
                  <Text size="sm" c="dimmed">Global software development market</Text>
                </div>
                <div>
                  <Text fw={600} mb="xs">Growth Rate</Text>
                  <Text size="lg" fw={700} c="green">{marketData.growthRate}</Text>
                  <Text size="sm" c="dimmed">Compound annual growth rate</Text>
                </div>
                <div>
                  <Text fw={600} mb="xs">Target Segment</Text>
                  <Text size="lg" fw={700} c="blue">{marketData.targetSegment}</Text>
                  <Text size="sm" c="dimmed">Small business to enterprise</Text>
                </div>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Competitive Advantages</Text>
                <List spacing="sm">
                  <List.Item>Proprietary MMRY compression technology</List.Item>
                  <List.Item>AI-powered code generation</List.Item>
                  <List.Item>Rapid deployment capabilities</List.Item>
                  <List.Item>Enterprise-grade security</List.Item>
                  <List.Item>Scalable cloud infrastructure</List.Item>
                  <List.Item>Strong user retention</List.Item>
                </List>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Business Model */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Business Model & Revenue Streams</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Group mb="md">
                  <ThemeIcon color="blue" size={40} radius="md">
                    <IconUsers size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Subscription Revenue</Text>
                    <Text size="sm" c="dimmed">Monthly/annual plans</Text>
                  </div>
                </Group>
                <Text size="sm" c="dimmed">
                  Tiered subscription model with free, basic, and unlimited plans. 
                  Enterprise customers pay premium rates for advanced features.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Group mb="md">
                  <ThemeIcon color="green" size={40} radius="md">
                    <IconRocket size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Enterprise Services</Text>
                    <Text size="sm" c="dimmed">Custom solutions</Text>
                  </div>
                </Group>
                <Text size="sm" c="dimmed">
                  Custom enterprise deployments, white-label solutions, and 
                  dedicated support services for large organizations.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper p="md" withBorder>
                <Group mb="md">
                  <ThemeIcon color="purple" size={40} radius="md">
                    <IconBrain size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Technology Licensing</Text>
                    <Text size="sm" c="dimmed">MMRY technology</Text>
                  </div>
                </Group>
                <Text size="sm" c="dimmed">
                  Licensing our MMRY compression technology to other 
                  software companies and cloud providers.
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Team */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Leadership Team</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="md" withBorder>
                <Text fw={600} mb="xs">CEO & Founder</Text>
                <Text size="sm" c="dimmed">
                  Experienced software engineer and entrepreneur with 15+ years 
                  in AI and cloud computing. Previously led engineering teams at 
                  major tech companies.
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="md" withBorder>
                <Text fw={600} mb="xs">CTO & Co-Founder</Text>
                <Text size="sm" c="dimmed">
                  AI/ML expert with deep expertise in neural networks and 
                  compression algorithms. Inventor of MMRY technology with 
                  multiple patents pending.
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Investment Use of Funds */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Use of Funds</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="blue">40%</Text>
                <Text size="sm" c="dimmed">Product Development</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="green">30%</Text>
                <Text size="sm" c="dimmed">Sales & Marketing</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="orange">20%</Text>
                <Text size="sm" c="dimmed">Operations</Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper p="md" withBorder textAlign="center">
                <Text size="xl" fw={700} c="purple">10%</Text>
                <Text size="sm" c="dimmed">Working Capital</Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Contact */}
        <Card p="xl" withBorder>
          <Title order={3} mb="lg">Investment Inquiries</Title>
          <Text size="sm" c="dimmed" mb="lg">
            We're actively seeking strategic investors who share our vision of democratizing 
            software development. For detailed financial information and investment opportunities, 
            please contact our investment team.
          </Text>
          <Group>
            <Button color="brand" leftSection={<IconMail size={16} />}>
              Contact Investment Team
            </Button>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              Download Financial Model
            </Button>
          </Group>
        </Card>
          </div>
          {!unlocked && (
            <Card
              p="xl"
              withBorder
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 24,
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(2px)'
              }}
            >
              <div style={{ width: 'min(100%, 980px)', margin: '0 auto' }}>
                <Title order={3} ta="center" mb="sm">Investor Access</Title>
                <Text size="sm" c="dimmed" ta="center" mb="md">
                  Schedule an investor call to receive your passcode. Enter the passcode below to reveal materials.
                </Text>
                <MeetingScheduler url={MEETING_SCHEDULER_URL} onBooked={() => setError('Passcode will be emailed after your booking.')} />
                <Group mt="md" align="flex-end" justify="center" wrap="nowrap">
                  <TextInput style={{ maxWidth: 320 }} type="password" placeholder="Enter passcode" value={attempt} onChange={(e) => setAttempt(e.currentTarget.value)} label="Passcode"/>
                  <CalElementTrigger>
                    <Button
                      data-cal-link="teknoledg-g/30min"
                      data-cal-namespace="30min"
                      data-cal-config='{"layout":"month_view"}'
                      variant="light"
                    >
                      Schedule a Meeting
                    </Button>
                  </CalElementTrigger>
                  <Button onClick={() => {
                    if (attempt === 'inv35tNsqdbx') { setUnlocked(true); setError(''); }
                    else { setError('Incorrect passcode'); }
                  }}>Unlock</Button>
                </Group>
                {error && (<Text size="xs" c="red" ta="center" mt={6}>{error}</Text>)}
              </div>
            </Card>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default Investors;
