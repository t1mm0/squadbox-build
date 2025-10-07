/*
 * LoginForm.jsx
 * Purpose: Login form component for Squadbox app
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Paper,
  Title,
  Text,
  Divider,
  Anchor
} from '@mantine/core';
import { useAuth } from './AuthContext';

const LoginForm = ({ onToggleForm }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" withBorder>
      <Title order={2} ta="center" mb="md">
        Welcome back to Squadbox
      </Title>
      
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb="md"
        />
        
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="md"
        />
        
        {error && (
          <Text c="red" mb="md" size="sm">
            {error}
          </Text>
        )}
        
        <Button 
          fullWidth 
          type="submit" 
          loading={loading}
          color="brand"
        >
          Log In
        </Button>
      </form>
      
      <Divider my="md" label="Or" labelPosition="center" />
      
      <Group justify="center">
        <Text size="sm">
          Don't have an account?{' '}
          <Anchor component="button" onClick={onToggleForm}>
            Register
          </Anchor>
        </Text>
      </Group>
    </Paper>
  );
};

export default LoginForm;