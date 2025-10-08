/*
 * RegisterForm.jsx
 * Purpose: Registration form component for Squadbox app
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
import { useAuth } from './SimpleAuthContext';

const RegisterForm = ({ onToggleForm }) => {
  const { register, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !name || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Basic username validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const result = await register(username, email, password, name);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" withBorder>
      <Title order={2} ta="center" mb="md">
        Create a Squadbox account
      </Title>
      
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Username"
          placeholder="yourusername"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb="md"
        />
        
        <TextInput
          label="Full Name"
          placeholder="Your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb="md"
        />
        
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
          placeholder="Password (min 8 characters)"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="md"
        />
        
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          Register
        </Button>
      </form>
      
      <Divider my="md" label="Or" labelPosition="center" />
      
      <Group justify="center">
        <Text size="sm">
          Already have an account?{' '}
          <Anchor component="button" onClick={onToggleForm}>
            Log in
          </Anchor>
        </Text>
      </Group>
    </Paper>
  );
};

export default RegisterForm;