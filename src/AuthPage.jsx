/*
 * AuthPage.jsx
 * Purpose: Authentication page component for Squadbox app
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
import { Container, Paper, Image, Box, Center } from '@mantine/core';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <Container size="xs" py="xl">
      <Center mb="xl">
        <Image 
          src="/images/squadboxboxed.svg" 
          alt="Squadbox Logo" 
          w={150}
          fit="contain"
        />
      </Center>
      
      <Paper radius="md" p={0} mt="md">
        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </Paper>
      
      <Box component="footer" py="md" ta="center" mt="xl">
        &copy; {new Date().getFullYear()} Squadbox AI Builder
      </Box>
    </Container>
  );
};

export default AuthPage;