/*
 * UserProfile.jsx
 * Purpose: User profile component for Squadbox app
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
import { 
  Group, 
  Avatar, 
  Text, 
  Menu, 
  Button, 
  Divider,
  UnstyledButton,
  Box,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
  Anchor
} from '@mantine/core';
import { 
  IconUser, 
  IconLogout, 
  IconChevronDown, 
  IconSettings, 
  IconCrown,
  IconReceipt,
  IconLogin,
  IconUserPlus
} from '@tabler/icons-react';
import { useAuth } from './SimpleAuthContext';

const UserProfile = ({ onNavigateToSettings }) => {
  const { currentUser, logout, login, register } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setLoginModalOpen(false);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await register(registerForm.name, registerForm.email, registerForm.password);
      setRegisterModalOpen(false);
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show login button if not authenticated
  if (!currentUser) {
    return (
      <>
        <Group gap="sm">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconLogin size={16} />}
            onClick={() => setLoginModalOpen(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            Login
          </Button>
          <Button
            variant="filled"
            size="sm"
            leftSection={<IconUserPlus size={16} />}
            onClick={() => setRegisterModalOpen(true)}
            color="brand"
          >
            Sign Up
          </Button>
        </Group>
        
        {/* Login Modal */}
        <Modal
          opened={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          title="Login to Squadbox"
          centered
        >
          <form onSubmit={handleLogin}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                type="email"
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <Group justify="space-between">
                <Anchor size="sm" c="dimmed">
                  Forgot password?
                </Anchor>
                <Group>
                  <Button variant="light" onClick={() => setLoginModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={isLoading}>
                    Login
                  </Button>
                </Group>
              </Group>
            </Stack>
          </form>
        </Modal>
        
        {/* Register Modal */}
        <Modal
          opened={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          title="Create Squadbox Account"
          centered
        >
          <form onSubmit={handleRegister}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                type="email"
              />
              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                required
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setRegisterModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading}>
                  Create Account
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </>
    );
  }
  
  // Get initials for avatar
  const getInitials = () => {
    if (!currentUser.name) return '?';
    return currentUser.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Get badge color based on subscription
  const getSubscriptionColor = () => {
    switch (currentUser.subscription) {
      case 'basic':
        return 'blue';
      case 'unlimited':
        return 'violet';
      default:
        return 'gray';
    }
  };
  
  // Get subscription display name
  const getSubscriptionName = () => {
    switch (currentUser.subscription) {
      case 'basic':
        return 'Basic';
      case 'unlimited':
        return 'Unlimited';
      default:
        return 'Free';
    }
  };

  return (
    <Menu position="bottom-end" withArrow width={280}>
      <Menu.Target>
                <UnstyledButton style={{ 
          padding: '0.4rem 0.6rem', 
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          width: 'auto',
          maxWidth: '220px'
        }}>
          <Avatar color="brand" radius="xl" size="sm" style={{
            backgroundColor: 'rgba(100, 180, 255, 0.2)',
            border: '1px solid rgba(100, 180, 255, 0.3)',
            flexShrink: 0,
            marginRight: '8px'
          }}>
            {getInitials()}
          </Avatar>
          <Box style={{ flex: 1, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
            <Text size="sm" fw={500} truncate style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1, whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconCrown size={12} color={`var(--mantine-color-${getSubscriptionColor()}-6)`} style={{ flexShrink: 0 }} />
              <Text size="xs" c={getSubscriptionColor()} truncate style={{ opacity: 0.8, lineHeight: 1, whiteSpace: 'nowrap' }}>
                {getSubscriptionName()}
              </Text>
            </div>
          </Box>
          <IconChevronDown size={14} style={{ color: 'rgba(255, 255, 255, 0.7)', flexShrink: 0, marginLeft: '6px' }} />
        </UnstyledButton>
      </Menu.Target>
      
      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconUser size={14} />} onClick={() => onNavigateToSettings('profile')}>
          Profile
        </Menu.Item>
        <Menu.Item leftSection={<IconSettings size={14} />} onClick={() => onNavigateToSettings('settings')}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconCrown size={14} />} onClick={() => onNavigateToSettings('subscription')}>
          Subscription
        </Menu.Item>
        <Menu.Item leftSection={<IconReceipt size={14} />} onClick={() => onNavigateToSettings('billing')}>
          Billing
        </Menu.Item>
        <Divider />
        <Menu.Item 
          leftSection={<IconLogout size={14} />} 
          color="red"
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserProfile;