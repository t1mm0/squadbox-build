/*
 * SupportPage.jsx
 * Purpose: Comprehensive support page with FAQ, tips & tricks, and user forum
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
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
  Accordion,
  Stack,
  Paper,
  Divider,
  ActionIcon,
  Textarea,
  TextInput,
  Select,
  List,
  ThemeIcon,
  Box,
  Image
} from '@mantine/core';
import { 
  IconHelp, 
  IconBulb, 
  IconMessageCircle, 
  IconSearch,
  IconMail,
  IconPhone,
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandGithub,
  IconBook,
  IconVideo,
  IconDownload,
  IconCheck,
  IconAlertCircle,
  IconShield
} from '@tabler/icons-react';
import dataPoliceBot from './public/1.0png/data-police-bot.png';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      value: 'getting-started',
      title: 'Getting Started',
      content: [
        {
          question: 'How do I create my first project?',
          answer: 'Select a template from our library, customize it with your requirements, and click "Build Project". Our AI will generate a complete, ready-to-deploy application for you.'
        },
        {
          question: 'What templates are available?',
          answer: 'We offer templates for E-commerce platforms, SaaS dashboards, Blog CMS, AI chatbots, Landing pages, and more. Each template is optimized for specific use cases.'
        },
        {
          question: 'How long does it take to build a project?',
          answer: 'Most projects complete within 2-5 minutes. Complex projects with extensive customization may take up to 10 minutes. You can monitor progress in real-time.'
        }
      ]
    },
    {
      value: 'templates',
      title: 'Templates & Customization',
      content: [
        {
          question: 'Can I customize templates?',
          answer: 'Yes! Every template can be customized with your specific requirements. Add features, change styling, integrate APIs, or modify functionality to match your needs.'
        },
        {
          question: 'What if I need a custom template?',
          answer: 'Use our "Custom Project" option to describe your requirements in natural language. Our AI will create a completely custom solution based on your description.'
        },
        {
          question: 'Are templates mobile-responsive?',
          answer: 'All our templates are built with responsive design principles and work seamlessly across desktop, tablet, and mobile devices.'
        }
      ]
    },
    {
      value: 'subscription',
      title: 'Subscription & Billing',
      content: [
        {
          question: 'What\'s included in the free plan?',
          answer: 'Free users can build 3 projects per month with basic templates. All projects include full source code and deployment instructions.'
        },
        {
          question: 'How do I upgrade my subscription?',
          answer: 'Go to Settings > Subscription to view available plans. Click "Upgrade" on your preferred plan and follow the payment process.'
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel anytime from Settings > Subscription. Your access continues until the end of your billing period.'
        }
      ]
    },
    {
      value: 'technical',
      title: 'Technical Support',
      content: [
        {
          question: 'What if my build fails?',
          answer: 'Failed builds are automatically logged with detailed error information. Check the build console for specific issues, or contact support for assistance.'
        },
        {
          question: 'How do I deploy my project?',
          answer: 'Each project includes deployment instructions and configuration files for popular platforms like Vercel, Netlify, and Heroku.'
        },
        {
          question: 'Can I get the source code?',
          answer: 'Yes! All projects include complete source code that you can download, modify, and deploy to your own hosting platform.'
        }
      ]
    }
  ];

  const tipsData = [
    {
      category: 'Build Optimization',
      tips: [
        'Be specific in your requirements - detailed descriptions lead to better results',
        'Use bullet points for feature lists - it helps AI understand your needs',
        'Mention your target audience and use case for more relevant code',
        'Specify preferred technologies when possible (React, Vue, etc.)'
      ]
    },
    {
      category: 'Template Selection',
      tips: [
        'Start with a similar template and customize rather than building from scratch',
        'Check template ratings and usage statistics for reliability',
        'Premium templates often have better performance and features',
        'Use the preview feature to understand template capabilities'
      ]
    },
    {
      category: 'Customization',
      tips: [
        'Add API integrations early in the process for better results',
        'Specify color schemes and branding requirements clearly',
        'Mention responsive design needs for mobile optimization',
        'Include authentication requirements if needed'
      ]
    },
    {
      category: 'Deployment',
      tips: [
        'Test locally before deploying to production',
        'Update environment variables for your specific setup',
        'Configure custom domains in your hosting platform',
        'Set up monitoring and analytics after deployment'
      ]
    }
  ];

  const forumTopics = [
    {
      title: 'Best practices for e-commerce templates',
      author: 'Sarah M.',
      replies: 12,
      views: 156,
      lastActivity: '2 hours ago',
      category: 'Templates'
    },
    {
      title: 'Integrating custom APIs with generated projects',
      author: 'Mike R.',
      replies: 8,
      views: 89,
      lastActivity: '5 hours ago',
      category: 'Development'
    },
    {
      title: 'Deployment guide for Vercel',
      author: 'Admin',
      replies: 23,
      views: 234,
      lastActivity: '1 day ago',
      category: 'Deployment'
    },
    {
      title: 'Troubleshooting build failures',
      author: 'John D.',
      replies: 15,
      views: 187,
      lastActivity: '2 days ago',
      category: 'Support'
    },
    {
      title: 'Feature request: Dark mode templates',
      author: 'Lisa K.',
      replies: 6,
      views: 67,
      lastActivity: '3 days ago',
      category: 'Feature Request'
    }
  ];

  const contactMethods = [
    {
      icon: <IconMail size={20} />,
      title: 'Email Support',
      description: 'Get help via email',
      action: 'hello@squadbox.uk',
      color: 'blue'
    },
    {
      icon: <IconBrandDiscord size={20} />,
      title: 'Discord Community',
      description: 'Join our community',
      action: 'Join Server',
      color: 'violet'
    },
    {
      icon: <IconBrandTwitter size={20} />,
      title: 'Twitter',
      description: 'Follow for updates',
      action: '@squadbox_uk',
      color: 'blue'
    },
    {
      icon: <IconBrandGithub size={20} />,
      title: 'GitHub',
      description: 'Report issues',
      action: 'View Issues',
      color: 'gray'
    }
  ];

  return (
    <Container size="xl">
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconHelp size={32} color="var(--mantine-color-brand-6)" />
        Support Center
      </Title>

      {/* Important Disclaimer - Collapsible */}
      <Accordion variant="contained" mb="xl">
        <Accordion.Item value="disclaimer">
          <Accordion.Control>
            <Group>
              <ThemeIcon color="gray" size={32} radius="md">
                <IconAlertCircle size={20} />
              </ThemeIcon>
              <Title order={4} c="dimmed">Important Disclaimer</Title>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Card p="md" withBorder style={{ 
              borderColor: 'var(--mantine-color-gray-6)',
              backgroundColor: 'var(--mantine-color-dark-4)'
            }}>
              <Text size="lg" mb="md" fw={500} c="white">
                While Squadbox stands by the quality and reliability of our platform, we cannot provide support or technical guidance for the outputs generated through user customizations.
              </Text>
              
              <Text size="sm" c="dimmed" mb="md">
                <strong>What we support:</strong> Platform functionality, template usage, build processes, deployment issues, and account-related matters.
              </Text>
              
              <Text size="sm" c="dimmed">
                <strong>What we cannot support:</strong> Custom code generated by our AI, third-party integrations you add, modifications you make to generated code, or any issues arising from user customizations beyond our control.
              </Text>

              <Divider my="md" />
              
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                <strong>Legal Disclaimer:</strong> By using Squadbox, you acknowledge that any code, applications, or outputs generated through our platform are created at your own risk. Squadbox Ltd. disclaims all warranties, express or implied, regarding the fitness, merchantability, or suitability of generated outputs for any particular purpose. Users are solely responsible for testing, validating, and ensuring compliance of generated code with applicable laws, regulations, and security standards. Squadbox is not liable for any damages, losses, or issues arising from the use, modification, or deployment of generated outputs.
              </Text>
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* Online Safety and Ethical Use - Collapsible */}
      <Accordion variant="contained" mb="xl">
        <Accordion.Item value="online-safety">
          <Accordion.Control>
            <Group>
              <ThemeIcon color="red" size={32} radius="md">
                <IconShield size={20} />
              </ThemeIcon>
              <Title order={4} c="red">Online Safety and Ethical Use</Title>
            </Group>
          </Accordion.Control>
                          <Accordion.Panel>
                  <Card p="xl" withBorder style={{ 
                    borderColor: 'var(--mantine-color-red-6)',
                    backgroundColor: 'var(--mantine-color-dark-8)',
                    position: 'relative',
                    overflow: 'visible',
                    minHeight: '300px'
                  }}>
                                  <div style={{
                      position: 'absolute',
                      top: '-75px',
                      right: '50px',
                      width: '300px',
                      height: '450px',
                      zIndex: 1
                    }}>
                <Image
                  src={dataPoliceBot}
                  alt="Data Police Bot"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '65%' }}>
                <Text size="lg" mb="md" fw={500} c="red">
                  We do not allow use of our platform to generate products fueled by ill-will and bad intentions.
                </Text>
                
                <Text size="sm" c="dimmed" mb="md">
                  <strong>Our Commitment:</strong> Squadbox reserves the right to refuse, terminate, or remove any builds that we detect are intended for harmful purposes, including but not limited to:
                </Text>
                
                <List size="sm" c="dimmed" mb="md">
                  <List.Item>Malicious software or applications</List.Item>
                  <List.Item>Content designed to harm, deceive, or exploit others</List.Item>
                  <List.Item>Applications intended for illegal activities</List.Item>
                  <List.Item>Tools designed to circumvent security measures</List.Item>
                  <List.Item>Applications that violate privacy or data protection laws</List.Item>
                </List>
                
                <Text size="sm" c="dimmed">
                  <strong>Detection & Action:</strong> Our automated systems and human review teams actively monitor for such content. We reserve the right to immediately terminate accounts and remove any projects that violate this policy without prior notice.
                </Text>
              </div>
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="faq" leftSection={<IconHelp size={16} />}>
            FAQ
          </Tabs.Tab>
          <Tabs.Tab value="tips" leftSection={<IconBulb size={16} />}>
            Tips & Tricks
          </Tabs.Tab>
          <Tabs.Tab value="forum" leftSection={<IconMessageCircle size={16} />}>
            Community Forum
          </Tabs.Tab>
          <Tabs.Tab value="contact" leftSection={<IconMail size={16} />}>
            Contact Us
          </Tabs.Tab>
        </Tabs.List>

        {/* FAQ TAB */}
        <Tabs.Panel value="faq">
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card p="xl" withBorder>
                <Group justify="space-between" mb="lg">
                  <Title order={3}>Frequently Asked Questions</Title>
                  <TextInput
                    placeholder="Search FAQ..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 300 }}
                  />
                </Group>
                
                <Accordion variant="contained">
                  {faqData.map((section) => (
                    <Accordion.Item key={section.value} value={section.value}>
                      <Accordion.Control>
                        <Text fw={500}>{section.title}</Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="md">
                          {section.content.map((item, index) => (
                            <div key={index}>
                              <Text fw={600} mb="xs" c="brand">
                                {item.question}
                              </Text>
                              <Text size="sm" c="dimmed">
                                {item.answer}
                              </Text>
                            </div>
                          ))}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Card p="xl" withBorder>
                  <Title order={4} mb="md">Quick Help</Title>
                  <Stack gap="sm">
                    <Button variant="light" leftSection={<IconVideo size={14} />} disabled>
                      Watch Tutorials
                    </Button>
                    <Button variant="light" leftSection={<IconBook size={14} />} disabled>
                      Documentation
                    </Button>
                    <Button variant="light" leftSection={<IconDownload size={14} />} disabled>
                      Download Examples
                    </Button>
                  </Stack>
                  <Text size="sm" c="dimmed" mt="md" ta="center">
                    Coming Soon
                  </Text>
                </Card>

                <Card p="xl" withBorder>
                  <Title order={4} mb="md">Still Need Help?</Title>
                  <Text size="sm" c="dimmed" mb="md">
                    Can't find what you're looking for? Our support team is here to help.
                  </Text>
                  <Button color="brand" fullWidth leftSection={<IconMail size={14} />}>
                    Contact Support
                  </Button>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* TIPS TAB */}
        <Tabs.Panel value="tips">
          <Grid gutter="lg">
            {tipsData.map((category, index) => (
              <Grid.Col span={{ base: 12, md: 6 }} key={index}>
                <Card p="xl" withBorder>
                  <Group mb="lg">
                    <IconBulb size={24} color="var(--mantine-color-yellow-6)" />
                    <Title order={3}>{category.category}</Title>
                  </Group>
                  
                  <List
                    spacing="sm"
                    icon={
                      <ThemeIcon color="yellow" size={20} radius="xl">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    {category.tips.map((tip, tipIndex) => (
                      <List.Item key={tipIndex}>
                        <Text size="sm">{tip}</Text>
                      </List.Item>
                    ))}
                  </List>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        {/* FORUM TAB */}
        <Tabs.Panel value="forum">
          <Card p="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={3}>Community Forum</Title>
              <Button color="brand" leftSection={<IconMessageCircle size={14} />}>
                Start New Topic
              </Button>
            </Group>
            
            <Stack gap="md">
              {forumTopics.map((topic, index) => (
                                  <Paper key={index} p="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Text fw={500} mb="xs">{topic.title}</Text>
                        <Group gap="xs" mb="xs">
                          <Text size="sm" c="dimmed">by {topic.author}</Text>
                          <Badge size="sm" variant="light">{topic.category}</Badge>
                        </Group>
                      </div>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">{topic.replies} replies</Text>
                        <Text size="sm" c="dimmed">{topic.views} views</Text>
                        <Text size="sm" c="dimmed">{topic.lastActivity}</Text>
                      </Group>
                    </Group>
                  </Paper>
                ))}
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* CONTACT TAB */}
        <Tabs.Panel value="contact">
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card p="xl" withBorder>
                <Title order={3} mb="lg">Get in Touch</Title>
                
                <Grid>
                  {contactMethods.map((method, index) => (
                    <Grid.Col span={{ base: 12, md: 6 }} key={index}>
                      <Card p="md" withBorder>
                        <Group mb="md">
                          <ThemeIcon color={method.color} size={40} radius="md">
                            {method.icon}
                          </ThemeIcon>
                          <div>
                            <Text fw={500}>{method.title}</Text>
                            <Text size="sm" c="dimmed">{method.description}</Text>
                          </div>
                        </Group>
                        <Button variant="light" color={method.color} fullWidth>
                          {method.action}
                        </Button>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>

                <Divider my="xl" />
                
                <Title order={4} mb="lg">Send us a Message</Title>
                <Stack gap="md">
                  <Group grow>
                    <TextInput label="Name" placeholder="Your name" />
                    <TextInput label="Email" placeholder="your@email.com" />
                  </Group>
                  <Select
                    label="Subject"
                    placeholder="Select a topic"
                    data={[
                      'Technical Support',
                      'Billing Question',
                      'Feature Request',
                      'Bug Report',
                      'General Inquiry'
                    ]}
                  />
                  <Textarea
                    label="Message"
                    placeholder="Describe your issue or question..."
                    minRows={4}
                  />
                  <Button color="brand" size="lg">
                    Send Message
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Card p="xl" withBorder>
                  <Title order={4} mb="md">Response Times</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Email Support</Text>
                      <Badge color="green">Within 24h</Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Discord</Text>
                      <Badge color="blue">Within 2h</Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Urgent Issues</Text>
                      <Badge color="red">Within 4h</Badge>
                    </Group>
                  </Stack>
                </Card>

                <Card p="xl" withBorder>
                  <Title order={4} mb="md">Business Hours</Title>
                  <Stack gap="sm">
                    <Text size="sm">Monday - Friday: 9AM - 6PM GMT</Text>
                    <Text size="sm">Saturday: 10AM - 4PM GMT</Text>
                    <Text size="sm">Sunday: Closed</Text>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default SupportPage;