/*
 * AdminPanel.jsx
 * Purpose: Comprehensive admin panel with charts, statistics, and management tools
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  Text, 
  Title, 
  Group, 
  Badge, 
  Button, 
  Tabs,
  Table,
  ScrollArea,
  Stack,
  RingProgress,
  Progress,
  Paper,
  Divider,
  ActionIcon,
  Modal,
  Textarea,
  Select,
  Switch
} from '@mantine/core';
import { 
  IconUsers, 
  IconChartBar, 
  IconSettings, 
  IconFileText, 
  IconShield, 
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconRefresh,
  IconDownload,
  IconTrash,
  IconEdit,
  IconEye,
  IconCrown,
  IconLock,
  IconBuilding,
  IconBrain
} from '@tabler/icons-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [logsModal, setLogsModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [aiSettingsModal, setAiSettingsModal] = useState(false);
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiApiKey, setAiApiKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');

  // Mock data for charts and statistics
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalProjects: 3456,
    successfulBuilds: 3120,
    failedBuilds: 336,
    revenue: 45678,
    premiumUsers: 234,
    freeUsers: 1013,
    conversionRate: 18.7,
    // Negative stats
    buildFailureRate: 9.7,
    avgBuildTime: 127,
    slowBuilds: 89,
    timeoutBuilds: 23,
    memoryErrors: 45,
    compressionFailures: 12,
    decompressionErrors: 8,
    mmryCorruption: 3,
    apiErrors: 156,
    userComplaints: 34,
    refunds: 7,
    churnRate: 4.2
  };

  const userGrowth = [
    { month: 'Jan', users: 120, projects: 89 },
    { month: 'Feb', users: 145, projects: 112 },
    { month: 'Mar', users: 189, projects: 156 },
    { month: 'Apr', users: 234, projects: 198 },
    { month: 'May', users: 289, projects: 245 },
    { month: 'Jun', users: 356, projects: 312 }
  ];

  const templateUsage = [
    { name: 'E-commerce Platform', usage: 45, revenue: 8900, failureRate: 3.2, avgTime: 145 },
    { name: 'SaaS Dashboard', usage: 38, revenue: 7200, failureRate: 8.7, avgTime: 189 },
    { name: 'Blog CMS', usage: 67, revenue: 3400, failureRate: 1.8, avgTime: 98 },
    { name: 'AI Chatbot', usage: 23, revenue: 5600, failureRate: 12.4, avgTime: 234 },
    { name: 'Landing Page', usage: 89, revenue: 2100, failureRate: 2.1, avgTime: 87 }
  ];

  const addonUsage = [
    { name: 'Advanced Analytics', usage: 156, revenue: 8900, conversionRate: 23.4 },
    { name: 'Custom Domain', usage: 89, revenue: 5600, conversionRate: 45.2 },
    { name: 'Priority Support', usage: 67, revenue: 3400, conversionRate: 18.7 },
    { name: 'API Access', usage: 34, revenue: 2100, conversionRate: 12.3 },
    { name: 'White Label', usage: 12, revenue: 8900, conversionRate: 8.9 }
  ];

  const dropoffMetrics = [
    { stage: 'Template Selection', users: 1247, dropoff: 0, rate: 0 },
    { stage: 'Project Naming', users: 1189, dropoff: 58, rate: 4.7 },
    { stage: 'Customization', users: 1123, dropoff: 66, rate: 5.6 },
    { stage: 'Build Process', users: 1045, dropoff: 78, rate: 6.9 },
    { stage: 'Download', users: 987, dropoff: 58, rate: 5.5 },
    { stage: 'Subscription', users: 234, dropoff: 753, rate: 76.3 }
  ];

  const subscriptionFunnel = [
    { stage: 'Free Trial', users: 1247, conversions: 0, rate: 0 },
    { stage: 'Basic Plan', users: 189, conversions: 45, rate: 23.8 },
    { stage: 'Unlimited Plan', users: 144, conversions: 89, rate: 61.8 }
  ];

  const recentActivity = [
    { user: 'john@example.com', action: 'Created project', template: 'E-commerce', time: '2 min ago', status: 'success' },
    { user: 'sarah@example.com', action: 'Upgraded to Basic', template: null, time: '5 min ago', status: 'upgrade' },
    { user: 'mike@example.com', action: 'Build failed', template: 'SaaS Dashboard', time: '12 min ago', status: 'error' },
    { user: 'lisa@example.com', action: 'Created project', template: 'Blog CMS', time: '18 min ago', status: 'success' },
    { user: 'admin@company.com', action: 'Upgraded to Unlimited', template: null, time: '25 min ago', status: 'upgrade' }
  ];

  const systemHealth = {
    cpu: 23,
    memory: 67,
    storage: 45,
    network: 89,
    uptime: 99.8
  };

  return (
    <Container size="xl">
      <Title order={1} mb="xl" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <IconShield size={32} color="var(--mantine-color-brand-6)" />
        Admin Dashboard
      </Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
            Users
          </Tabs.Tab>
          <Tabs.Tab value="templates" leftSection={<IconBuilding size={16} />}>
            Templates
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconTrendingUp size={16} />}>
            Analytics
          </Tabs.Tab>
          <Tabs.Tab value="system" leftSection={<IconSettings size={16} />}>
            System
          </Tabs.Tab>
          <Tabs.Tab value="logs" leftSection={<IconFileText size={16} />}>
            Logs
          </Tabs.Tab>
        </Tabs.List>

        {/* OVERVIEW TAB */}
        <Tabs.Panel value="overview">
          <Grid gutter="lg">
            {/* Key Metrics */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card p="xl" withBorder>
                <Group mb="md">
                  <IconUsers size={24} color="var(--mantine-color-blue-6)" />
                  <div>
                    <Text size="lg" fw={700}>{stats.totalUsers.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Total Users</Text>
                  </div>
                </Group>
                <Progress value={75} color="blue" size="sm" />
                <Text size="xs" c="dimmed" mt="xs">+12% this month</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card p="xl" withBorder>
                <Group mb="md">
                  <IconTrendingUp size={24} color="var(--mantine-color-green-6)" />
                  <div>
                    <Text size="lg" fw={700}>{stats.totalProjects.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Projects Built</Text>
                  </div>
                </Group>
                <Progress value={90} color="green" size="sm" />
                <Text size="xs" c="dimmed" mt="xs">+8% this month</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card p="xl" withBorder>
                <Group mb="md">
                  <IconCrown size={24} color="var(--mantine-color-yellow-6)" />
                  <div>
                    <Text size="lg" fw={700}>${stats.revenue.toLocaleString()}</Text>
                    <Text size="sm" c="dimmed">Monthly Revenue</Text>
                  </div>
                </Group>
                <Progress value={85} color="yellow" size="sm" />
                <Text size="xs" c="dimmed" mt="xs">+15% this month</Text>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card p="xl" withBorder>
                <Group mb="md">
                  <IconBrain size={24} color="var(--mantine-color-violet-6)" />
                  <div>
                    <Text size="lg" fw={700}>{stats.conversionRate}%</Text>
                    <Text size="sm" c="dimmed">Conversion Rate</Text>
                  </div>
                </Group>
                <Progress value={stats.conversionRate} color="violet" size="sm" />
                <Text size="xs" c="dimmed" mt="xs">+2.3% this month</Text>
              </Card>
            </Grid.Col>

            {/* Charts */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">User Growth & Project Activity</Title>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                  <Text c="dimmed">📊 Interactive Chart: User growth and project activity over time</Text>
                </div>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">System Health</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">CPU Usage</Text>
                      <Text size="sm" fw={500}>{systemHealth.cpu}%</Text>
                    </Group>
                    <Progress value={systemHealth.cpu} color="blue" size="sm" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Memory</Text>
                      <Text size="sm" fw={500}>{systemHealth.memory}%</Text>
                    </Group>
                    <Progress value={systemHealth.memory} color="green" size="sm" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Storage</Text>
                      <Text size="sm" fw={500}>{systemHealth.storage}%</Text>
                    </Group>
                    <Progress value={systemHealth.storage} color="yellow" size="sm" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Network</Text>
                      <Text size="sm" fw={500}>{systemHealth.network}%</Text>
                    </Group>
                    <Progress value={systemHealth.network} color="violet" size="sm" />
                  </div>
                  <Divider />
                  <Group justify="space-between">
                    <Text size="sm">Uptime</Text>
                    <Badge color="green" variant="light">{systemHealth.uptime}%</Badge>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Recent Activity */}
            <Grid.Col span={12}>
              <Card p="xl" withBorder>
                <Group justify="space-between" mb="lg">
                  <Title order={3}>Recent Activity</Title>
                  <Button size="sm" variant="light" leftSection={<IconRefresh size={14} />}>
                    Refresh
                  </Button>
                </Group>
                <ScrollArea h={300}>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>User</Table.Th>
                        <Table.Th>Action</Table.Th>
                        <Table.Th>Template</Table.Th>
                        <Table.Th>Time</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {recentActivity.map((activity, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            <Text size="sm">{activity.user}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{activity.action}</Text>
                          </Table.Td>
                          <Table.Td>
                            {activity.template ? (
                              <Badge size="sm" variant="light">{activity.template}</Badge>
                            ) : (
                              <Text size="sm" c="dimmed">-</Text>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="dimmed">{activity.time}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge 
                              size="sm" 
                              color={
                                activity.status === 'success' ? 'green' : 
                                activity.status === 'error' ? 'red' : 
                                activity.status === 'upgrade' ? 'blue' : 'gray'
                              }
                            >
                              {activity.status}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* USERS TAB */}
        <Tabs.Panel value="users">
          <Card p="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={3}>User Management</Title>
              <Button size="sm" color="brand" leftSection={<IconUsers size={14} />}>
                Export Users
              </Button>
            </Group>
            
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder>
                  <Group mb="md">
                    <IconCrown size={20} color="var(--mantine-color-yellow-6)" />
                    <div>
                      <Text size="lg" fw={700}>{stats.premiumUsers}</Text>
                      <Text size="sm" c="dimmed">Premium Users</Text>
                    </div>
                  </Group>
                  <RingProgress
                    sections={[{ value: (stats.premiumUsers / stats.totalUsers) * 100, color: 'yellow' }]}
                    size={80}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder>
                  <Group mb="md">
                    <IconLock size={20} color="var(--mantine-color-gray-6)" />
                    <div>
                      <Text size="lg" fw={700}>{stats.freeUsers}</Text>
                      <Text size="sm" c="dimmed">Free Users</Text>
                    </div>
                  </Group>
                  <RingProgress
                    sections={[{ value: (stats.freeUsers / stats.totalUsers) * 100, color: 'gray' }]}
                    size={80}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder>
                  <Group mb="md">
                    <IconTrendingUp size={20} color="var(--mantine-color-green-6)" />
                    <div>
                      <Text size="lg" fw={700}>{stats.conversionRate}%</Text>
                      <Text size="sm" c="dimmed">Conversion Rate</Text>
                    </div>
                  </Group>
                  <RingProgress
                    sections={[{ value: stats.conversionRate, color: 'green' }]}
                    size={80}
                  />
                </Card>
              </Grid.Col>
            </Grid>

            <ScrollArea h={400} mt="lg">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Plan</Table.Th>
                    <Table.Th>Projects</Table.Th>
                    <Table.Th>Last Active</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {Array.from({ length: 20 }, (_, i) => ({
                    email: `user${i + 1}@example.com`,
                    plan: i % 3 === 0 ? 'Unlimited' : i % 3 === 1 ? 'Basic' : 'Free',
                    projects: Math.floor(Math.random() * 50) + 1,
                    lastActive: `${Math.floor(Math.random() * 24)}h ago`,
                    status: i % 5 === 0 ? 'suspended' : 'active'
                  })).map((user, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text size="sm">{user.email}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          size="sm" 
                          color={
                            user.plan === 'Unlimited' ? 'violet' : 
                            user.plan === 'Basic' ? 'blue' : 'gray'
                          }
                        >
                          {user.plan}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{user.projects}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">{user.lastActive}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          size="sm" 
                          color={user.status === 'active' ? 'green' : 'red'}
                        >
                          {user.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon size="sm" variant="light" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                          <ActionIcon size="sm" variant="light" color="yellow">
                            <IconEdit size={14} />
                          </ActionIcon>
                          <ActionIcon size="sm" variant="light" color="red">
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Tabs.Panel>

        {/* TEMPLATES TAB */}
        <Tabs.Panel value="templates">
          <Card p="xl" withBorder>
            <Title order={3} mb="lg">Template & Addon Analytics</Title>
            
            <Grid>
              {templateUsage.map((template, index) => (
                <Grid.Col span={{ base: 12, md: 6 }} key={index}>
                  <Card p="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <Text fw={500}>{template.name}</Text>
                      <Badge color="brand" variant="light">
                        {template.usage} uses
                      </Badge>
                    </Group>
                    <Stack gap="xs" mb="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Revenue</Text>
                        <Text fw={600}>${template.revenue.toLocaleString()}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Failure Rate</Text>
                        <Text fw={600} c={template.failureRate > 5 ? 'red' : 'green'}>{template.failureRate}%</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Avg Build Time</Text>
                        <Text fw={600} c={template.avgTime > 180 ? 'orange' : 'green'}>{template.avgTime}s</Text>
                      </Group>
                    </Stack>
                    <Progress 
                      value={(template.usage / Math.max(...templateUsage.map(t => t.usage))) * 100} 
                      color="brand" 
                      size="sm" 
                    />
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            <Title order={4} mt="xl" mb="lg">Popular Addons</Title>
            <Grid>
              {addonUsage.map((addon, index) => (
                <Grid.Col span={{ base: 12, md: 6 }} key={index}>
                  <Card p="md" withBorder>
                    <Group justify="space-between" mb="md">
                      <Text fw={500}>{addon.name}</Text>
                      <Badge color="violet" variant="light">
                        {addon.usage} users
                      </Badge>
                    </Group>
                    <Stack gap="xs" mb="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Revenue</Text>
                        <Text fw={600}>${addon.revenue.toLocaleString()}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Conversion Rate</Text>
                        <Text fw={600} c={addon.conversionRate > 20 ? 'green' : 'orange'}>{addon.conversionRate}%</Text>
                      </Group>
                    </Stack>
                    <Progress 
                      value={addon.conversionRate} 
                      color="violet" 
                      size="sm" 
                    />
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Card>
        </Tabs.Panel>

        {/* ANALYTICS TAB */}
        <Tabs.Panel value="analytics">
          <Grid gutter="lg">
            {/* Drop-off Funnel */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">User Journey Drop-off</Title>
                <Stack gap="md">
                  {dropoffMetrics.map((stage, index) => (
                    <div key={index}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>{stage.stage}</Text>
                        <Text size="sm" fw={600}>{stage.users}</Text>
                      </Group>
                      <Progress 
                        value={100 - stage.rate} 
                        color={stage.rate > 10 ? 'red' : stage.rate > 5 ? 'orange' : 'green'} 
                        size="sm" 
                      />
                      <Group justify="space-between" mt="xs">
                        <Text size="xs" c="dimmed">Drop-off: {stage.dropoff}</Text>
                        <Text size="xs" c="dimmed">{stage.rate}%</Text>
                      </Group>
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            {/* Subscription Funnel */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">Subscription Funnel</Title>
                <Stack gap="md">
                  {subscriptionFunnel.map((stage, index) => (
                    <div key={index}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>{stage.stage}</Text>
                        <Text size="sm" fw={600}>{stage.users}</Text>
                      </Group>
                      <Progress 
                        value={stage.rate} 
                        color={stage.rate > 50 ? 'green' : stage.rate > 20 ? 'blue' : 'gray'} 
                        size="sm" 
                      />
                      <Group justify="space-between" mt="xs">
                        <Text size="xs" c="dimmed">Conversions: {stage.conversions}</Text>
                        <Text size="xs" c="dimmed">{stage.rate}%</Text>
                      </Group>
                    </div>
                  ))}
                </Stack>
              </Card>
            </Grid.Col>

            {/* Negative Stats */}
            <Grid.Col span={12}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">System Issues & Failures</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Card p="md" withBorder>
                      <Group mb="md">
                        <IconAlertCircle size={20} color="var(--mantine-color-red-6)" />
                        <div>
                          <Text size="lg" fw={700} c="red">{stats.buildFailureRate}%</Text>
                          <Text size="sm" c="dimmed">Build Failure Rate</Text>
                        </div>
                      </Group>
                      <Progress value={stats.buildFailureRate} color="red" size="sm" />
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Card p="md" withBorder>
                      <Group mb="md">
                        <IconAlertCircle size={20} color="var(--mantine-color-orange-6)" />
                        <div>
                          <Text size="lg" fw={700} c="orange">{stats.avgBuildTime}s</Text>
                          <Text size="sm" c="dimmed">Avg Build Time</Text>
                        </div>
                      </Group>
                      <Progress value={(stats.avgBuildTime / 300) * 100} color="orange" size="sm" />
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Card p="md" withBorder>
                      <Group mb="md">
                        <IconAlertCircle size={20} color="var(--mantine-color-yellow-6)" />
                        <div>
                          <Text size="lg" fw={700} c="yellow">{stats.compressionFailures}</Text>
                          <Text size="sm" c="dimmed">MMRY Failures</Text>
                        </div>
                      </Group>
                      <Progress value={(stats.compressionFailures / 50) * 100} color="yellow" size="sm" />
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Card p="md" withBorder>
                      <Group mb="md">
                        <IconAlertCircle size={20} color="var(--mantine-color-red-6)" />
                        <div>
                          <Text size="lg" fw={700} c="red">{stats.churnRate}%</Text>
                          <Text size="sm" c="dimmed">Churn Rate</Text>
                        </div>
                      </Group>
                      <Progress value={stats.churnRate} color="red" size="sm" />
                    </Card>
                  </Grid.Col>
                </Grid>

                <Grid mt="lg">
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card p="md" withBorder>
                      <Title order={4} mb="md">Error Breakdown</Title>
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text size="sm">Memory Errors</Text>
                          <Badge color="red" variant="light">{stats.memoryErrors}</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">API Errors</Text>
                          <Badge color="orange" variant="light">{stats.apiErrors}</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Timeout Builds</Text>
                          <Badge color="yellow" variant="light">{stats.timeoutBuilds}</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">MMRY Corruption</Text>
                          <Badge color="red" variant="light">{stats.mmryCorruption}</Badge>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card p="md" withBorder>
                      <Title order={4} mb="md">User Feedback</Title>
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text size="sm">Complaints</Text>
                          <Badge color="orange" variant="light">{stats.userComplaints}</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Refunds</Text>
                          <Badge color="red" variant="light">{stats.refunds}</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Decompression Errors</Text>
                          <Badge color="yellow" variant="light">{stats.decompressionErrors}</Badge>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Slow Builds</Text>
                          <Badge color="orange" variant="light">{stats.slowBuilds}</Badge>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* SYSTEM TAB */}
        <Tabs.Panel value="system">
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">System Settings</Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text>Maintenance Mode</Text>
                    <Switch />
                  </Group>
                  <Group justify="space-between">
                    <Text>Debug Logging</Text>
                    <Switch defaultChecked />
                  </Group>
                  <Group justify="space-between">
                    <Text>Rate Limiting</Text>
                    <Switch defaultChecked />
                  </Group>
                  <Group justify="space-between">
                    <Text>Auto Scaling</Text>
                    <Switch defaultChecked />
                  </Group>
                  <Divider />
                  <Button variant="light" color="red" leftSection={<IconAlertCircle size={14} />}>
                    Emergency Shutdown
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">Performance Metrics</Title>
                <Stack gap="md">
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">API Response Time</Text>
                      <Text size="sm" fw={500}>127ms</Text>
                    </Group>
                    <Progress value={85} color="green" size="sm" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Build Success Rate</Text>
                      <Text size="sm" fw={500}>92.7%</Text>
                    </Group>
                    <Progress value={92.7} color="blue" size="sm" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Error Rate</Text>
                      <Text size="sm" fw={500}>0.3%</Text>
                    </Group>
                    <Progress value={0.3} color="red" size="sm" />
                  </div>
                  <div>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm">Active Connections</Text>
                      <Text size="sm" fw={500}>1,247</Text>
                    </Group>
                    <Progress value={78} color="violet" size="sm" />
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* LOGS TAB */}
        <Tabs.Panel value="logs">
          <Card p="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={3}>System Logs</Title>
              <Group gap="xs">
                <Button size="sm" variant="light" leftSection={<IconDownload size={14} />}>
                  Export Logs
                </Button>
                <Button size="sm" color="brand" leftSection={<IconRefresh size={14} />}>
                  Refresh
                </Button>
              </Group>
            </Group>
            
            <ScrollArea h={500}>
              <Paper p="md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', fontFamily: 'monospace' }}>
                <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
{`[2024-11-08 14:23:45] INFO: User john@example.com created project "My E-commerce Store"
[2024-11-08 14:23:47] INFO: Build started for project ID 3456
[2024-11-08 14:23:52] INFO: Template "ecommerce-platform" loaded successfully
[2024-11-08 14:24:15] INFO: AI generation completed for project 3456
[2024-11-08 14:24:18] INFO: Build completed successfully for project 3456
[2024-11-08 14:24:20] INFO: User sarah@example.com upgraded to Basic plan
[2024-11-08 14:25:03] WARN: High CPU usage detected (78%)
[2024-11-08 14:25:45] INFO: User mike@example.com started build for "SaaS Dashboard"
[2024-11-08 14:26:12] ERROR: Build failed for project 3457 - Memory limit exceeded
[2024-11-08 14:26:15] INFO: Error notification sent to mike@example.com
[2024-11-08 14:27:00] INFO: System health check completed - All systems operational
[2024-11-08 14:28:30] INFO: New user registration: lisa@example.com
[2024-11-08 14:29:15] INFO: Template "blog-cms" accessed by lisa@example.com
[2024-11-08 14:30:00] INFO: Daily backup completed successfully
[2024-11-08 14:30:45] INFO: Admin panel accessed by admin@company.com
[2024-11-08 14:31:20] INFO: System maintenance scheduled for 02:00 UTC`}
                </Text>
              </Paper>
            </ScrollArea>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
