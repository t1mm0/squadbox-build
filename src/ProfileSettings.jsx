/*
 * ProfileSettings.jsx
 * Purpose: Comprehensive user profile settings and account management
 * Last modified: 2025-01-07
 * Completeness score: 95
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Divider,
  Alert,
  Badge,
  Grid,
  Box,
  Switch,
  Select,
  Textarea,
  Modal,
  LoadingOverlay,
  Avatar,
  FileInput,
  Tabs,
  ActionIcon,
  Menu,
  Paper,
  List,
  ThemeIcon
} from '@mantine/core';
import {
  IconUser,
  IconLock,
  IconReceipt,
  IconCrown,
  IconShield,
  IconBell,
  IconTrash,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconUpload,
  IconPalette,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconBuilding,
  IconKey,
  IconCalendar,
  IconDownload
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from './SimpleAuthContext';

const ProfileSettings = ({ initialTab = 'profile' }) => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [billingModal, setBillingModal] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Update activeTab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    company: currentUser?.company || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    website: currentUser?.website || '',
    avatar: currentUser?.avatar || null,
    avatarColor: currentUser?.avatarColor || 'blue',
    avatarType: currentUser?.avatarType || 'initials' // 'initials', 'upload', 'gravatar'
  });
  
  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    theme: currentUser?.theme || 'system', // 'light', 'dark', 'system'
    buildDefaults: {
      autoSave: true,
      notifications: true,
      qualityLevel: 'high', // 'low', 'medium', 'high'
      defaultTemplate: 'web',
      maxFileSize: 10 // MB
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    apiKey: {
      openaiKey: currentUser?.openaiKey || '',
      usePersonalKey: currentUser?.usePersonalKey || false
    }
  });
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Billing form
  const [billingForm, setBillingForm] = useState({
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/27'
    },
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  
  // Subscription data
  const subscriptionData = {
    current: {
      plan: currentUser?.subscription || 'basic',
      status: 'active',
      nextBilling: '2025-02-07',
      projectsUsed: 12,
      projectsLimit: currentUser?.subscription === 'unlimited' ? 'Unlimited' : 50
    },
    plans: [
      {
        name: 'Basic',
        price: '$9/month',
        features: ['50 projects/month', 'Basic templates', 'Email support'],
        current: currentUser?.subscription === 'basic'
      },
      {
        name: 'Unlimited',
        price: '$29/month',
        features: ['Unlimited projects', 'All templates', 'Priority support', 'Advanced features'],
        current: currentUser?.subscription === 'unlimited'
      }
    ],
    addons: [
      {
        name: 'Priority Support',
        price: '$5/month',
        description: 'Get faster response times'
      },
      {
        name: 'Advanced Analytics',
        price: '$3/month',
        description: 'Detailed project insights'
      },
      {
        name: 'Custom Templates',
        price: '$10/month',
        description: 'Create your own templates'
      }
    ]
  };

  // Invoice history
  const invoiceHistory = [
    { id: 'INV-001', date: '2025-01-07', amount: 29.99, status: 'paid', plan: 'Unlimited' },
    { id: 'INV-002', date: '2024-12-07', amount: 29.99, status: 'paid', plan: 'Unlimited' },
    { id: 'INV-003', date: '2024-11-07', amount: 9.99, status: 'paid', plan: 'Basic' }
  ];

  // Avatar color options
  const avatarColors = [
    'blue', 'green', 'violet', 'red', 'orange', 'yellow', 'pink', 'gray'
  ];

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        notifications.show({
          title: 'Error',
          message: 'New passwords do not match',
          color: 'red',
          icon: <IconX size={16} />
        });
        return;
      }
      
      if (passwordForm.newPassword.length < 8) {
        notifications.show({
          title: 'Error',
          message: 'Password must be at least 8 characters long',
          color: 'red',
          icon: <IconX size={16} />
        });
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      notifications.show({
        title: 'Success',
        message: 'Password updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });
      
      setPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update password. Please try again.',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate API key if personal key is enabled
      if (settingsForm.apiKey.usePersonalKey) {
        if (!settingsForm.apiKey.openaiKey) {
          notifications.show({
            title: 'Error',
            message: 'Please provide an OpenAI API key when personal key is enabled.',
            color: 'red',
            icon: <IconX size={16} />
          });
          setLoading(false);
          return;
        }
        
        if (!settingsForm.apiKey.openaiKey.startsWith('sk-')) {
          notifications.show({
            title: 'Error',
            message: 'Invalid OpenAI API key format. Keys should start with "sk-".',
            color: 'red',
            icon: <IconX size={16} />
          });
          setLoading(false);
          return;
        }
      }
      
      // TODO: Send settings to backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notifications.show({
        title: 'Success',
        message: 'Settings updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update settings. Please try again.',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpgrade = async (plan) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notifications.show({
        title: 'Success',
        message: `Upgraded to ${plan} plan successfully`,
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to upgrade subscription. Please try again.',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!profileForm.name) return '?';
    return profileForm.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getThemeIcon = () => {
    switch (settingsForm.theme) {
      case 'light': return <IconSun size={16} />;
      case 'dark': return <IconMoon size={16} />;
      default: return <IconDeviceDesktop size={16} />;
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} ta="center" style={{ marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>Account Settings</Title>
      
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            Settings
          </Tabs.Tab>
          <Tabs.Tab value="subscription" leftSection={<IconCrown size={16} />}>
            Subscription
          </Tabs.Tab>
          <Tabs.Tab value="billing" leftSection={<IconReceipt size={16} />}>
            Billing
          </Tabs.Tab>
        </Tabs.List>

        {/* PROFILE TAB */}
        <Tabs.Panel value="profile">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                {/* Profile Information */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconUser size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Profile Information</Title>
                  </Group>
                  
                  <form onSubmit={handleProfileUpdate}>
                    <Stack gap="md">
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            required
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Email"
                            placeholder="Enter your email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            required
                          />
                        </Grid.Col>
                      </Grid>
                      
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Company"
                            placeholder="Enter your company name"
                            value={profileForm.company}
                            onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Phone"
                            placeholder="Enter your phone number"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Location"
                            placeholder="City, Country"
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Website"
                            placeholder="https://yourwebsite.com"
                            value={profileForm.website}
                            onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                          />
                        </Grid.Col>
                      </Grid>

                      <Textarea
                        label="Bio"
                        placeholder="Tell us about yourself..."
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                        rows={3}
                      />
                      
                      <Button type="submit" loading={loading} leftSection={<IconCheck size={16} />}>
                        Update Profile
                      </Button>
                    </Stack>
                  </form>
                </Card>

                {/* Security Card */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconShield size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Security</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>Password</Text>
                        <Text size="sm" c="dimmed">Last changed 30 days ago</Text>
                      </Box>
                      <Button 
                        variant="light" 
                        leftSection={<IconLock size={16} />}
                        onClick={() => setPasswordModal(true)}
                      >
                        Change Password
                      </Button>
                    </Group>
                    
                    <Divider />
                    
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>Two-Factor Authentication</Text>
                        <Text size="sm" c="dimmed">Add an extra layer of security</Text>
                      </Box>
                      <Switch />
                    </Group>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>

            {/* Avatar Sidebar */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xl">
                {/* Avatar Card */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconUser size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Avatar</Title>
                  </Group>
                  
                  <Stack gap="md" align="center">
                    <Avatar 
                      size={120} 
                      color={profileForm.avatarColor}
                      src={profileForm.avatarType === 'upload' ? profileForm.avatar : null}
                      style={{
                        backgroundColor: `var(--mantine-color-${profileForm.avatarColor}-6)`,
                        border: '3px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {profileForm.avatarType !== 'upload' && getInitials()}
                    </Avatar>
                    
                    <Button 
                      variant="light" 
                      leftSection={<IconUpload size={16} />}
                      onClick={() => setAvatarModal(true)}
                    >
                      Change Avatar
                    </Button>
                  </Stack>
                </Card>

                {/* Account Actions */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconUser size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Account</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Button 
                      variant="light" 
                      leftSection={<IconSwitchHorizontal size={16} />}
                      fullWidth
                    >
                      Switch Account
                    </Button>
                    
                    <Button 
                      variant="light" 
                      color="red"
                      leftSection={<IconLogout size={16} />}
                      onClick={logout}
                      fullWidth
                    >
                      Logout
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* SETTINGS TAB */}
        <Tabs.Panel value="settings">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                {/* Appearance Settings */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconPalette size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Appearance</Title>
                  </Group>
                  
                  <form onSubmit={handleSettingsUpdate}>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Box>
                          <Text fw={500}>Theme</Text>
                          <Text size="sm" c="dimmed">Choose your preferred theme</Text>
                        </Box>
                        <Select
                          value={settingsForm.theme}
                          onChange={(value) => setSettingsForm({...settingsForm, theme: value})}
                          data={[
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' },
                            { value: 'system', label: 'System' }
                          ]}
                          leftSection={getThemeIcon()}
                          style={{ width: 150 }}
                        />
                      </Group>
                      
                      <Button type="submit" loading={loading} leftSection={<IconCheck size={16} />}>
                        Update Settings
                      </Button>
                    </Stack>
                  </form>
                </Card>

                {/* Build Defaults */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconBuilding size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Build Defaults</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>Auto-save Projects</Text>
                        <Text size="sm" c="dimmed">Automatically save project progress</Text>
                      </Box>
                      <Switch 
                        checked={settingsForm.buildDefaults.autoSave}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm, 
                          buildDefaults: {
                            ...settingsForm.buildDefaults,
                            autoSave: e.target.checked
                          }
                        })}
                      />
                    </Group>
                    
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>Build Notifications</Text>
                        <Text size="sm" c="dimmed">Notify when builds complete</Text>
                      </Box>
                      <Switch 
                        checked={settingsForm.buildDefaults.notifications}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm, 
                          buildDefaults: {
                            ...settingsForm.buildDefaults,
                            notifications: e.target.checked
                          }
                        })}
                      />
                    </Group>
                    
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>Default Quality Level</Text>
                        <Text size="sm" c="dimmed">Set default build quality</Text>
                      </Box>
                      <Select
                        value={settingsForm.buildDefaults.qualityLevel}
                        onChange={(value) => setSettingsForm({
                          ...settingsForm, 
                          buildDefaults: {
                            ...settingsForm.buildDefaults,
                            qualityLevel: value
                          }
                        })}
                        data={[
                          { value: 'low', label: 'Fast (Low Quality)' },
                          { value: 'medium', label: 'Balanced (Medium Quality)' },
                          { value: 'high', label: 'Best (High Quality)' }
                        ]}
                        style={{ width: 200 }}
                      />
                    </Group>
                  </Stack>
                </Card>

                {/* API Key Management */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconKey size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>API Key Settings</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Alert color="blue" variant="light">
                      <Text size="sm">
                        <strong>Use Your Own OpenAI API Key:</strong> Add your personal OpenAI API key to use your own credits for building projects. This allows unlimited builds while using your own OpenAI quota.
                      </Text>
                    </Alert>
                    
                    <Group justify="space-between">
                      <Box style={{ flex: 1 }}>
                        <Text fw={500}>Use Personal API Key</Text>
                        <Text size="sm" c="dimmed">Enable to use your own OpenAI API key for builds</Text>
                      </Box>
                      <Switch 
                        checked={settingsForm.apiKey.usePersonalKey}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm, 
                          apiKey: {
                            ...settingsForm.apiKey,
                            usePersonalKey: e.target.checked
                          }
                        })}
                      />
                    </Group>
                    
                    {settingsForm.apiKey.usePersonalKey && (
                      <PasswordInput
                        label="OpenAI API Key"
                        placeholder="sk-..."
                        description="Your API key is encrypted and stored securely. Get your key from platform.openai.com"
                        value={settingsForm.apiKey.openaiKey}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm, 
                          apiKey: {
                            ...settingsForm.apiKey,
                            openaiKey: e.target.value
                          }
                        })}
                        leftSection={<IconKey size={16} />}
                        required={settingsForm.apiKey.usePersonalKey}
                      />
                    )}
                    
                    {settingsForm.apiKey.usePersonalKey && settingsForm.apiKey.openaiKey && (
                      <Group gap="xs">
                        <IconCheck size={16} color="green" />
                        <Text size="sm" c="green">API Key configured</Text>
                      </Group>
                    )}
                    
                    {!settingsForm.apiKey.usePersonalKey && (
                      <Alert color="yellow" variant="light">
                        <Text size="sm">
                          You're currently using platform credits. Enable personal API key to use your own OpenAI credits and remove monthly limits.
                        </Text>
                      </Alert>
                    )}
                    
                    <Group justify="flex-end">
                      <Button 
                        onClick={handleSettingsUpdate} 
                        loading={loading} 
                        leftSection={<IconCheck size={16} />}
                        disabled={settingsForm.apiKey.usePersonalKey && !settingsForm.apiKey.openaiKey}
                      >
                        Save API Settings
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>

            {/* Notifications Sidebar */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card p="xl" withBorder>
                <Group mb="lg">
                  <IconBell size={24} color="var(--mantine-color-brand-6)" />
                  <Title order={3}>Notifications</Title>
                </Group>
                
                <Stack gap="md">
                  <Group justify="space-between">
                    <Box>
                      <Text fw={500}>Email Notifications</Text>
                      <Text size="sm" c="dimmed">Receive notifications via email</Text>
                    </Box>
                    <Switch defaultChecked />
                  </Group>
                  
                  <Group justify="space-between">
                    <Box>
                      <Text fw={500}>Build Notifications</Text>
                      <Text size="sm" c="dimmed">Get notified when builds complete</Text>
                    </Box>
                    <Switch defaultChecked />
                  </Group>
                  
                  <Group justify="space-between">
                    <Box>
                      <Text fw={500}>Marketing Emails</Text>
                      <Text size="sm" c="dimmed">Receive updates about new features</Text>
                    </Box>
                    <Switch />
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* SUBSCRIPTION TAB */}
        <Tabs.Panel value="subscription">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                {/* Current Plan */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconCrown size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Current Plan</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Box>
                      <Badge 
                        color={subscriptionData.current.plan === 'unlimited' ? 'violet' : 'blue'}
                        size="lg"
                        mb="xs"
                      >
                        {subscriptionData.current.plan === 'unlimited' ? 'Unlimited' : 'Basic'} Plan
                      </Badge>
                      <Text size="sm" c="dimmed">
                        Next billing: {subscriptionData.current.nextBilling}
                      </Text>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Text size="sm" fw={500}>Usage</Text>
                      <Text size="sm" c="dimmed">
                        {subscriptionData.current.projectsUsed} / {subscriptionData.current.projectsLimit} projects
                      </Text>
                    </Box>
                  </Stack>
                </Card>

                {/* Available Plans */}
                <Card p="xl" withBorder>
                  <Title order={3} mb="lg">Available Plans</Title>
                  
                  <Grid>
                    {subscriptionData.plans.map((plan, index) => (
                      <Grid.Col span={{ base: 12, sm: 6 }} key={index}>
                        <Card 
                          p="lg" 
                          withBorder 
                          style={{ 
                            borderColor: plan.current ? 'var(--mantine-color-green-6)' : undefined
                          }}
                        >
                          <Stack gap="md">
                            <Group justify="space-between">
                              <Title order={4}>{plan.name}</Title>
                              <Text fw={700} size="lg">{plan.price}</Text>
                            </Group>
                            
                            <List size="sm" spacing="xs">
                              {plan.features.map((feature, fIndex) => (
                                <List.Item key={fIndex}>{feature}</List.Item>
                              ))}
                            </List>
                            
                            <Button 
                              variant={plan.current ? "light" : "filled"}
                              color={plan.current ? "green" : "brand"}
                              fullWidth
                              disabled={plan.current}
                              onClick={() => handleSubscriptionUpgrade(plan.name.toLowerCase())}
                            >
                              {plan.current ? 'Current Plan' : 'Upgrade'}
                            </Button>
                          </Stack>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Card>

                {/* Add-ons */}
                <Card p="xl" withBorder>
                  <Title order={3} mb="lg">Add-ons</Title>
                  
                  <Grid>
                    {subscriptionData.addons.map((addon, index) => (
                      <Grid.Col span={{ base: 12, sm: 4 }} key={index}>
                        <Card p="md" withBorder>
                          <Stack gap="sm">
                            <Title order={5}>{addon.name}</Title>
                            <Text size="sm" c="dimmed">{addon.description}</Text>
                            <Text fw={700} size="lg">{addon.price}</Text>
                            <Button size="sm" variant="light" fullWidth>
                              Add
                            </Button>
                          </Stack>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Card>
              </Stack>
            </Grid.Col>

            {/* Support Sidebar */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card p="xl" withBorder>
                <Group mb="lg">
                  <IconUser size={24} color="var(--mantine-color-brand-6)" />
                  <Title order={3}>Support</Title>
                </Group>
                
                <Stack gap="md">
                  <Text size="sm">
                    Need help? Contact our support team at{' '}
                    <Text component="a" href="mailto:hello@squadbox.uk" c="brand">
                      hello@squadbox.uk
                    </Text>
                  </Text>
                  
                  <Button variant="light" fullWidth>
                    Contact Support
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* BILLING TAB */}
        <Tabs.Panel value="billing">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                {/* Payment Method */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconReceipt size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Payment Method</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Box>
                        <Text fw={500}>Current Payment Method</Text>
                        <Text size="sm" c="dimmed">
                          {billingForm.paymentMethod.brand} ending in {billingForm.paymentMethod.last4}
                        </Text>
                      </Box>
                      <Button 
                        variant="light" 
                        leftSection={<IconReceipt size={16} />}
                        onClick={() => setBillingModal(true)}
                      >
                        Update Payment Method
                      </Button>
                    </Group>
                  </Stack>
                </Card>

                {/* Invoice History */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconReceipt size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Invoice History</Title>
                  </Group>
                  
                  <Stack gap="md">
                    {invoiceHistory.map((invoice) => (
                      <Paper key={invoice.id} p="md" withBorder>
                        <Group justify="space-between">
                          <Box>
                            <Text fw={500}>{invoice.id}</Text>
                            <Text size="sm" c="dimmed">
                              {invoice.date} • {invoice.plan} Plan
                            </Text>
                          </Box>
                          <Group gap="xs">
                            <Text fw={700}>${invoice.amount}</Text>
                            <Badge 
                              color={invoice.status === 'paid' ? 'green' : 'red'}
                              variant="light"
                            >
                              {invoice.status}
                            </Badge>
                            <ActionIcon 
                              variant="light" 
                              size="sm"
                              title="Download Invoice"
                            >
                              <IconDownload size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>

            {/* Billing Info Sidebar */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xl">
                {/* Billing Address */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconUser size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Billing Address</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      No billing address on file
                    </Text>
                    <Button variant="light" fullWidth>
                      Add Billing Address
                    </Button>
                  </Stack>
                </Card>

                {/* Next Billing */}
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconCalendar size={24} color="var(--mantine-color-brand-6)" />
                    <Title order={3}>Next Billing</Title>
                  </Group>
                  
                  <Stack gap="md">
                    <Box>
                      <Text size="lg" fw={700}>$29.99</Text>
                      <Text size="sm" c="dimmed">
                        Due on {subscriptionData.current.nextBilling}
                      </Text>
                    </Box>
                    
                    <Button variant="light" fullWidth>
                      View Invoice
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Password Change Modal */}
      <Modal 
        opened={passwordModal} 
        onClose={() => setPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePasswordChange}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              required
            />
            
            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              required
            />
            
            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              required
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setPasswordModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update Password
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Avatar Change Modal */}
      <Modal 
        opened={avatarModal} 
        onClose={() => setAvatarModal(false)}
        title="Change Avatar"
        size="md"
      >
        <Stack gap="xl">
          <Text size="sm" c="dimmed">
            Choose your avatar type and customize your appearance
          </Text>
          
          <Stack gap="md">
            <Text fw={500}>Avatar Type</Text>
            <Group>
              <Button 
                variant={profileForm.avatarType === 'initials' ? 'filled' : 'light'}
                onClick={() => setProfileForm({...profileForm, avatarType: 'initials'})}
              >
                Initials
              </Button>
              <Button 
                variant={profileForm.avatarType === 'upload' ? 'filled' : 'light'}
                onClick={() => setProfileForm({...profileForm, avatarType: 'upload'})}
              >
                Upload Photo
              </Button>
            </Group>
            
            {profileForm.avatarType === 'upload' && (
              <FileInput
                label="Upload Photo"
                placeholder="Choose a photo"
                accept="image/*"
                onChange={(file) => setProfileForm({...profileForm, avatar: file})}
              />
            )}
            
            <Text fw={500}>Avatar Color</Text>
            <Group>
              {avatarColors.map((color) => (
                <ActionIcon
                  key={color}
                  size="lg"
                  variant={profileForm.avatarColor === color ? 'filled' : 'light'}
                  color={color}
                  onClick={() => setProfileForm({...profileForm, avatarColor: color})}
                >
                  <IconCheck size={16} />
                </ActionIcon>
              ))}
            </Group>
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setAvatarModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setAvatarModal(false)}>
                Save Avatar
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Modal>

      {/* Billing Modal */}
      <Modal 
        opened={billingModal} 
        onClose={() => setBillingModal(false)}
        title="Update Payment Method"
        size="lg"
      >
        <Stack gap="xl">
          <Text size="sm" c="dimmed">
            Update your payment method for subscription billing
          </Text>
          
          <Stack gap="md">
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
            />
            
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Expiry Date"
                  placeholder="MM/YY"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="CVV"
                  placeholder="123"
                />
              </Grid.Col>
            </Grid>
            
            <TextInput
              label="Cardholder Name"
              placeholder="John Doe"
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setBillingModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setBillingModal(false)}>
                Update Payment Method
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ProfileSettings;
