/*
 * SubscriptionPlans.jsx
 * Purpose: Display subscription plan options for Squadbox
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React from 'react';
import { 
  Card, 
  Text, 
  Button, 
  Group, 
  SimpleGrid, 
  List, 
  ThemeIcon,
  rem,
  useMantineTheme,
  Badge
} from '@mantine/core';
import { IconCheck, IconCrown } from '@tabler/icons-react';
import { useAuth } from './SimpleAuthContext';

function SubscriptionPlans() {
  const theme = useMantineTheme();
  const { currentUser, updateSubscription } = useAuth();
  
  const plans = [
    {
      title: 'Free',
      price: '0',
      features: [
        'Save 1 project',
        'Basic AI generation',
        'Standard templates',
        'Community support'
      ],
      cta: 'Get Started',
      variant: 'outline',
      highlight: false
    },
    {
      title: 'Basic',
      price: '9.99',
      features: [
        'Save 10 projects',
        'Advanced AI generation',
        'All templates',
        'Email support',
        'Priority build queue'
      ],
      cta: 'Subscribe',
      variant: 'filled',
      highlight: true
    },
    {
      title: 'Unlimited',
      price: '19.99',
      features: [
        'Unlimited projects',
        'Premium AI generation',
        'Custom templates',
        'Priority support',
        'Advanced analytics',
        'No build queue'
      ],
      cta: 'Go Unlimited',
      variant: 'filled',
      highlight: false
    }
  ];

  // Handler for subscription selection
  const handleSubscribe = async (planType) => {
    await updateSubscription(planType);
  };

  return (
    <div>
      <Text size="xl" ta="center" fw={700} mb="lg">Choose Your Plan</Text>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Subscribe to unlock more AI-powered projects and advanced features
      </Text>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" style={{ overflow: 'visible' }}>
        {plans.map((plan) => {
          const isCurrentPlan = currentUser?.subscription === plan.title.toLowerCase();
          
          return (
            <Card
              key={plan.title}
              padding="xl"
              radius="md"
              style={{
                border: 'none',
                backgroundColor: '#1a1a1a',
                transform: plan.highlight ? 'scale(1.03)' : undefined,
                boxShadow: plan.highlight ? `0 10px 30px -10px ${theme.colors.brand[2]}` : 
                           isCurrentPlan ? `0 10px 30px -10px ${theme.colors.green[2]}` : undefined,
                position: 'relative',
                overflow: 'visible'
              }}
            >
              {plan.highlight && !isCurrentPlan && plan.title !== 'Unlimited' && (
                <div style={{ 
                  position: 'absolute', 
                  top: -15, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 10
                }}>
                  <IconCrown style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-brand-6)' }} />
                  <Text size="sm" fw={600} c="brand.6">RECOMMENDED</Text>
                </div>
              )}
              
              {isCurrentPlan && (
                <div style={{ 
                  position: 'absolute', 
                  top: -15, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 10
                }}>
                  <IconCheck style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-green-6)' }} />
                  <Text size="sm" fw={600} c="green.6">CURRENT PLAN</Text>
                </div>
              )}
            
            <Text size="xl" fw={700} mb="xs">{plan.title}</Text>
            
            <Group mb="md">
              <Text size="xl" span fw={700} style={{ fontSize: rem(35) }}>
                ${plan.price}
              </Text>
              <Text size="sm" c="dimmed" mt={7}>
                / month
              </Text>
            </Group>
            
            <List
              spacing="sm"
              size="sm"
              mb="xl"
              center
              icon={
                <ThemeIcon color="brand" size={20} radius="xl">
                  <IconCheck style={{ width: rem(12), height: rem(12) }} />
                </ThemeIcon>
              }
            >
              {plan.features.map((feature) => (
                <List.Item key={feature}>{feature}</List.Item>
              ))}
            </List>
            
            <Button 
              variant={isCurrentPlan ? 'light' : plan.variant} 
              color={isCurrentPlan ? 'green' : 'brand'}
              fullWidth
              radius="md"
              disabled={isCurrentPlan}
              onClick={() => handleSubscribe(plan.title.toLowerCase())}
            >
              {isCurrentPlan ? 'Current Plan' : plan.cta}
            </Button>
          </Card>
          );
        })}
      </SimpleGrid>
    </div>
  );
}

export default SubscriptionPlans;