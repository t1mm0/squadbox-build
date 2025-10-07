/*
 * PricingPage.jsx
 * Purpose: Squadbox pricing page with Base44-inspired simplified pricing
 * Last modified: 2025-01-27
 * By: AI Assistant
 * Completeness: 100/100
 */

import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Stack, 
  Paper, 
  Button, 
  Badge, 
  List, 
  ThemeIcon, 
  Switch,
  Box,
  Divider,
  Center
} from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconRocket, 
  IconBuilding, 
  IconCrown, 
  IconBuildingSkyscraper,
  IconStar,
  IconUsers,
  IconCode,
  IconDatabase,
  IconShield,
  IconZap
} from '@tabler/icons-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      price: 0,
      annualPrice: 0,
      description: 'Perfect for students, hobbyists, and testing ideas',
      icon: IconStar,
      color: 'gray',
      popular: false,
      features: [
        '5 builds per month',
        '1,000 AI tokens per build',
        'Basic templates',
        'Community support',
        'Core Squadbox features'
      ],
      limitations: [
        'Limited to basic templates',
        'Community support only'
      ]
    },
    {
      name: 'Starter',
      price: 19,
      annualPrice: 15,
      description: 'Perfect for freelancers and small projects',
      icon: IconRocket,
      color: 'blue',
      popular: true,
      features: [
        '25 builds per month',
        '5,000 AI tokens per build',
        'Premium templates',
        'Email support',
        'Custom domains',
        'All core features'
      ],
      limitations: []
    },
    {
      name: 'Builder',
      price: 49,
      annualPrice: 39,
      description: 'Perfect for agencies and growing businesses',
      icon: IconBuilding,
      color: 'green',
      popular: false,
      features: [
        '100 builds per month',
        '10,000 AI tokens per build',
        'All templates + custom',
        'Priority support',
        'Team collaboration (3 users)',
        'API access',
        'Advanced analytics'
      ],
      limitations: []
    },
    {
      name: 'Pro',
      price: 99,
      annualPrice: 79,
      description: 'Perfect for enterprises and large teams',
      icon: IconCrown,
      color: 'violet',
      popular: false,
      features: [
        'Unlimited builds',
        '20,000 AI tokens per build',
        'Advanced AI models',
        'White-label options',
        'Team collaboration (10 users)',
        'Dedicated support',
        'Custom integrations',
        'Priority processing'
      ],
      limitations: []
    }
  ];

  const commonFeatures = [
    { icon: IconZap, text: 'AI-powered app building' },
    { icon: IconCode, text: 'Responsive design' },
    { icon: IconDatabase, text: 'Database integration' },
    { icon: IconUsers, text: 'User authentication' },
    { icon: IconShield, text: 'Cloud hosting' },
    { icon: IconStar, text: 'Version control' }
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Center>
          <Stack gap="md" ta="center">
            <Title order={1} size="3rem" fw={900}>
              Simple, Clear Pricing
            </Title>
            <Text size="xl" c="dimmed" maw={600}>
              Build AI-powered apps with our credit-based system. 
              No complex feature matrices, just pay for what you build.
            </Text>
          </Stack>
        </Center>

        {/* Billing Toggle */}
        <Center>
          <Group gap="md">
            <Text fw={500}>Monthly</Text>
            <Switch
              checked={isAnnual}
              onChange={(event) => setIsAnnual(event.currentTarget.checked)}
              size="lg"
              color="brand"
            />
            <Text fw={500}>
              Annual 
              <Badge color="green" size="sm" ml="xs">
                Save 20%
              </Badge>
            </Text>
          </Group>
        </Center>

        {/* Pricing Cards */}
        <Group align="stretch" gap="lg" justify="center">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = isAnnual ? plan.annualPrice : plan.price;
            const savings = isAnnual && plan.price > 0 ? Math.round((plan.price - plan.annualPrice) / plan.price * 100) : 0;

            return (
              <Paper
                key={plan.name}
                p="xl"
                radius="lg"
                shadow={plan.popular ? "xl" : "sm"}
                style={{
                  position: 'relative',
                  border: 'none',
                  borderWidth: 0,
                  outline: 'none',
                  backgroundColor: '#1a1a1a',
                  minHeight: '500px',
                  width: '280px'
                }}
              >
                {plan.popular && (
                  <Badge
                    color="brand"
                    size="lg"
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    Most Popular
                  </Badge>
                )}

                <Stack gap="md">
                  {/* Plan Header */}
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                      <Group gap="sm">
                        <Icon size={24} color={`var(--mantine-color-${plan.color}-6)`} />
                        <Text fw={700} size="xl">
                          {plan.name}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {plan.description}
                      </Text>
                    </Stack>
                  </Group>

                  {/* Price */}
                  <Box>
                    <Group gap="xs" align="baseline">
                      <Text size="2.5rem" fw={900} c={`${plan.color}.6`}>
                        ${currentPrice}
                      </Text>
                      <Text size="lg" c="dimmed">
                        {isAnnual ? '/year' : '/month'}
                      </Text>
                    </Group>
                    {isAnnual && savings > 0 && (
                      <Text size="sm" c="green" fw={500}>
                        Save {savings}% annually
                      </Text>
                    )}
                  </Box>

                  {/* Features */}
                  <Stack gap="sm">
                    {plan.features.map((feature, index) => (
                      <Group gap="sm" key={index}>
                        <ThemeIcon size="sm" color="green" variant="light">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">{feature}</Text>
                      </Group>
                    ))}
                  </Stack>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    color={plan.color}
                    variant={plan.popular ? "filled" : "outline"}
                    fullWidth
                    mt="auto"
                  >
                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Group>

        {/* Common Features */}
        <Paper p="xl" radius="lg" bg="gray.0">
          <Stack gap="md">
            <Title order={3} ta="center">
              Everything included in every plan
            </Title>
            <Group gap="xl" justify="center">
              {commonFeatures.map((feature, index) => (
                <Group gap="sm" key={index}>
                  <ThemeIcon size="md" color="brand" variant="light">
                    <feature.icon size={16} />
                  </ThemeIcon>
                  <Text fw={500}>{feature.text}</Text>
                </Group>
              ))}
            </Group>
          </Stack>
        </Paper>

        {/* FAQ Section */}
        <Stack gap="lg">
          <Title order={2} ta="center">
            Frequently Asked Questions
          </Title>
          
          <Paper p="lg" radius="md">
            <Text fw={600} mb="sm">What's included in the free plan?</Text>
            <Text size="sm" c="dimmed">
              The free plan gives you 5 builds per month with 1,000 AI tokens per build. 
              You have access to all core features, allowing you to build fully functional 
              applications with user authentication, database integration, and more, all at no cost.
            </Text>
          </Paper>

          <Paper p="lg" radius="md">
            <Text fw={600} mb="sm">What are AI tokens?</Text>
            <Text size="sm" c="dimmed">
              AI tokens are used when your app makes AI-powered requests like generating content, 
              processing images, or making intelligent decisions. Each AI operation costs tokens 
              based on complexity. Simple operations use fewer tokens, complex operations use more.
            </Text>
          </Paper>

          <Paper p="lg" radius="md">
            <Text fw={600} mb="sm">What happens if I reach my plan limits?</Text>
            <Text size="sm" c="dimmed">
              You can upgrade to a higher tier plan at any time from your dashboard. 
              If you hit your monthly limit, you can wait until the next month or upgrade 
              immediately to continue building.
            </Text>
          </Paper>
        </Stack>

        {/* Enterprise CTA */}
        <Paper p="xl" radius="lg" bg="brand.0" ta="center">
          <Stack gap="md">
            <Title order={2}>Need something custom?</Title>
            <Text size="lg" c="dimmed">
              Enterprise plans with unlimited everything, custom AI models, 
              on-premise deployment, and dedicated support.
            </Text>
            <Button size="lg" variant="outline" color="brand">
              Contact Sales
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
