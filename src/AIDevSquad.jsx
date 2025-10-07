/*
 * AIDevSquad.jsx
 * Purpose: AI Dev Squad landing page for logged-out users
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
  Grid,
  Box,
  Center,
  Image,
  Card,
  SimpleGrid,
  Divider,
  Anchor
} from '@mantine/core';
import { 
  IconCheck, 
  IconRocket, 
  IconBuilding, 
  IconCrown, 
  IconBuildingSkyscraper,
  IconStar,
  IconUsers,
  IconCode,
  IconDatabase,
  IconShield,
  IconBolt,
  IconBrain,
  IconRobot,
  IconTarget,
  IconTrendingUp,
  IconSettings,
  IconHeadset,
  IconLock,
  IconInfinity
} from '@tabler/icons-react';

export default function AIDevSquad() {
  const [isAnnual, setIsAnnual] = useState(true);

  const features = [
    {
      icon: IconBrain,
      title: 'AI-Powered Development',
      description: 'Build apps using natural language. Our AI understands your requirements and generates production-ready code.',
      color: 'blue',
      botImage: '/images/bots/buiilder-bot.png'
    },
    {
      icon: IconBolt,
      title: 'Lightning Fast',
      description: 'Create full-stack applications in minutes, not months. Deploy instantly with our cloud infrastructure.',
      color: 'yellow',
      botImage: '/images/bots/deployment-bot.png'
    },
    {
      icon: IconTarget,
      title: 'Precision Built',
      description: 'Every app is optimized for performance, security, and scalability. No technical debt, just clean code.',
      color: 'green',
      botImage: '/images/bots/data-police-bot.png'
    },
    {
      icon: IconTrendingUp,
      title: 'Scale Automatically',
      description: 'Your apps grow with your business. Built-in monitoring, analytics, and auto-scaling capabilities.',
      color: 'violet',
      botImage: '/images/bots/project-manager.png'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      annualPrice: 0,
      description: 'Perfect for learning and testing',
      icon: IconStar,
      color: 'gray',
      popular: false,
      features: [
        '5 AI builds per month',
        '1,000 AI tokens per build',
        'Basic templates',
        'Community support',
        'Core features included'
      ],
      cta: 'Start Free',
      ctaColor: 'gray'
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
        '25 AI builds per month',
        '5,000 AI tokens per build',
        'Premium templates',
        'Email support',
        'Custom domains',
        'Priority processing'
      ],
      cta: 'Get Started',
      ctaColor: 'blue'
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
        '100 AI builds per month',
        '10,000 AI tokens per build',
        'All templates + custom',
        'Priority support',
        'Team collaboration (3 users)',
        'API access',
        'Advanced analytics'
      ],
      cta: 'Start Building',
      ctaColor: 'green'
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
        'Unlimited AI builds',
        '20,000 AI tokens per build',
        'Advanced AI models',
        'White-label options',
        'Team collaboration (10 users)',
        'Dedicated support',
        'Custom integrations'
      ],
      cta: 'Go Pro',
      ctaColor: 'violet'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: IconBuildingSkyscraper,
      title: 'Enterprise Infrastructure',
      description: 'Dedicated servers, custom domains, and enterprise-grade security'
    },
    {
      icon: IconLock,
      title: 'Advanced Security',
      description: 'SOC 2 compliance, SSO integration, and custom security policies'
    },
    {
      icon: IconHeadset,
      title: 'Dedicated Support',
      description: '24/7 support with dedicated account managers and technical architects'
    },
    {
      icon: IconSettings,
      title: 'Custom Solutions',
      description: 'Tailored AI models, custom integrations, and on-premise deployment'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechStart',
      content: 'Squadbox reduced our development time by 80%. We can now prototype and deploy new features in hours instead of weeks.',
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Johnson',
      role: 'Founder, BuildFast',
      content: 'The AI understands our requirements perfectly. It\'s like having a senior developer who never sleeps.',
      avatar: '👨‍💼'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Product Manager, ScaleUp',
      content: 'We\'ve built 15 production apps in 3 months. The quality and performance are outstanding.',
      avatar: '👩‍🚀'
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Hero Section */}
        <Center>
          <Stack gap="lg" ta="center" maw={800}>
            <Badge size="lg" color="brand" variant="light">
              🤖 AI Dev Squad
            </Badge>
            <Title order={1} size="4rem" fw={900} lh={1.1}>
              Build Apps with
              <Text span c="brand" inherit> AI Power</Text>
            </Title>
            <Text size="xl" c="dimmed" lh={1.6}>
              The world's first AI development squad that builds production-ready applications 
              from natural language descriptions. No coding required.
            </Text>
            <Group justify="center" gap="md">
              <Button size="lg" color="brand">
                Start Building Free
              </Button>
              <Button size="lg" variant="outline" color="brand">
                Watch Demo
              </Button>
            </Group>
            <Text size="sm" c="dimmed">
              No credit card required • 5 free builds per month
            </Text>
          </Stack>
        </Center>

        {/* Bot Showcase Section */}
        <Box py="xl">
          <Title order={2} ta="center" mb="xl">
            Meet Your AI Development Squad
          </Title>
          <Text size="lg" c="dimmed" ta="center" mb="xl">
            Our specialized AI bots work together to build your applications
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="lg">
            {[
              { name: 'Builder Bot', image: '/images/bots/buiilder-bot.png', role: 'Code Generation' },
              { name: 'Deployment Bot', image: '/images/bots/deployment-bot.png', role: 'Deployment' },
              { name: 'Data Police', image: '/images/bots/data-police-bot.png', role: 'Data Security' },
              { name: 'Designer Bot', image: '/images/bots/deisgnger-bot.png', role: 'UI/UX Design' },
              { name: 'Project Manager', image: '/images/bots/project-manager.png', role: 'Project Management' },
              { name: 'Logic Weaver', image: '/images/bots/logic-weaver-bot.png', role: 'Logic Flow' }
            ].map((bot, index) => (
              <Card key={index} p="md" shadow="sm" radius="md" ta="center">
                <Stack gap="sm">
                  <Image
                    src={bot.image}
                    alt={bot.name}
                    height={index === 0 ? 200 : index === 1 ? 160 : 120} // Builder Bot 250%, Deployment Bot 200%, others 150%
                    width="auto"
                    fit="contain"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                  />
                  <Text fw={600} size="sm">{bot.name}</Text>
                  <Text size="xs" c="dimmed">{bot.role}</Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Features Section */}
        <Box py="xl">
          <Title order={2} ta="center" mb="xl">
            Why Choose AI Dev Squad?
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {features.map((feature, index) => (
              <Card key={index} p="lg" shadow="sm" radius="md">
                <Stack gap="md" ta="center">
       <Box style={{ position: 'relative', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <Image
           src={feature.botImage}
           alt={`${feature.title} Bot`}
           height={index === 0 ? 150 : index === 1 ? 120 : 90} // Builder Bot 250%, Deployment Bot 200%, others 150%
           width="auto"
           fit="contain"
           style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
         />
         <ThemeIcon 
           size={50} 
           color={feature.color} 
           variant="light" 
           style={{ 
             position: 'absolute', 
             top: -10, 
             right: -10,
             backdropFilter: 'blur(10px)',
             backgroundColor: 'rgba(0,0,0,0.7)'
           }}
         >
           <feature.icon size={25} />
         </ThemeIcon>
       </Box>
                  <Title order={4}>{feature.title}</Title>
                  <Text size="sm" c="dimmed">
                    {feature.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Pricing Section */}
        <Box py="xl">
          <Stack gap="lg">
            <Center>
              <Stack gap="md" ta="center">
                <Title order={2}>Simple, Clear Pricing</Title>
                <Text size="lg" c="dimmed">
                  Pay per build. No complex feature matrices. Scale as you grow.
                </Text>
                
                {/* Billing Toggle */}
                <Group gap="md">
                  <Text fw={500}>Monthly</Text>
                  <Button
                    variant={isAnnual ? "filled" : "outline"}
                    color="brand"
                    size="sm"
                    onClick={() => setIsAnnual(!isAnnual)}
                  >
                    Annual
                    <Badge color="green" size="sm" ml="xs">
                      Save 20%
                    </Badge>
                  </Button>
                </Group>
              </Stack>
            </Center>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
              {pricingPlans.map((plan) => {
                const Icon = plan.icon;
                const currentPrice = isAnnual ? plan.annualPrice : plan.price;
                const savings = isAnnual && plan.price > 0 ? Math.round((plan.price - plan.annualPrice) / plan.price * 100) : 0;

                return (
                  <Card
                    key={plan.name}
                    p="lg"
                    shadow={plan.popular ? "xl" : "sm"}
                    radius="md"
                    style={{
                      border: plan.popular ? '2px solid var(--mantine-color-brand-6)' : '1px solid var(--mantine-color-gray-3)',
                      position: 'relative'
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
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Icon size={24} color={`var(--mantine-color-${plan.color}-6)`} />
                          <Text fw={700} size="lg">{plan.name}</Text>
                        </Group>
                      </Group>

                      <Box>
                        <Group gap="xs" align="baseline">
                          <Text size="2rem" fw={900} c={`${plan.color}.6`}>
                            ${currentPrice}
                          </Text>
                          <Text size="sm" c="dimmed">{isAnnual ? '/year' : '/month'}</Text>
                        </Group>
                        {isAnnual && savings > 0 && (
                          <Text size="xs" c="green" fw={500}>
                            Save {savings}% annually
                          </Text>
                        )}
                      </Box>

                      <Text size="sm" c="dimmed">
                        {plan.description}
                      </Text>

                      <Stack gap="xs">
                        {plan.features.map((feature, index) => (
                          <Group gap="sm" key={index}>
                            <ThemeIcon size="sm" color="green" variant="light">
                              <IconCheck size={12} />
                            </ThemeIcon>
                            <Text size="sm">{feature}</Text>
                          </Group>
                        ))}
                      </Stack>

                      <Button
                        size="md"
                        color={plan.ctaColor}
                        variant={plan.popular ? "filled" : "outline"}
                        fullWidth
                        mt="auto"
                      >
                        {plan.cta}
                      </Button>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Box>

        {/* Enterprise Section */}
        <Paper p="xl" radius="lg" bg="dark.8" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Stack gap="lg">
            <Center>
              <Stack gap="md" ta="center">
                <Title order={2} c="white">Enterprise Solutions</Title>
                <Text size="lg" c="dimmed">
                  Custom AI development for large organizations
                </Text>
              </Stack>
            </Center>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
              {enterpriseFeatures.map((feature, index) => (
                <Card key={index} p="lg" shadow="sm" radius="md" bg="dark.7" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Stack gap="md" ta="center">
                    <ThemeIcon size={50} color="brand" variant="light" mx="auto">
                      <feature.icon size={24} />
                    </ThemeIcon>
                    <Title order={5} c="white">{feature.title}</Title>
                    <Text size="sm" c="dimmed">
                      {feature.description}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            <Center>
              <Button size="lg" color="brand" variant="outline">
                Contact Enterprise Sales
              </Button>
            </Center>
          </Stack>
        </Paper>

        {/* Testimonials */}
        <Box py="xl">
          <Title order={2} ta="center" mb="xl">
            Trusted by Developers Worldwide
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {testimonials.map((testimonial, index) => (
              <Card key={index} p="lg" shadow="sm" radius="md">
                <Stack gap="md">
                  <Text size="lg" style={{ fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Text>
                  <Group gap="sm">
                    <Text size="2rem">{testimonial.avatar}</Text>
                    <Box>
                      <Text fw={600} size="sm">{testimonial.name}</Text>
                      <Text size="xs" c="dimmed">{testimonial.role}</Text>
                    </Box>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Paper p="xl" radius="lg" bg="dark.8" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255, 255, 255, 0.1)' }} ta="center">
          <Stack gap="md">
            <Title order={2} c="white">Ready to Build with AI?</Title>
            <Text size="lg" c="dimmed">
              Join thousands of developers who are already building faster with AI Dev Squad
            </Text>
            <Group justify="center" gap="md">
              <Button size="lg" color="brand">
                Start Free Today
              </Button>
              <Button size="lg" variant="outline" color="brand">
                Schedule Demo
              </Button>
            </Group>
            <Text size="sm" c="dimmed">
              No credit card required • 5 free builds per month • Cancel anytime
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
