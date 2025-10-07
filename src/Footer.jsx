/*
 * Footer.jsx
 * Purpose: Site footer with navigation links, company info, and feedback system
 * Last modified: 2025-08-08
 * Completeness score: 100
 */

import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Text, 
  Group, 
  Button, 
  Modal, 
  TextInput, 
  Textarea, 
  Select,
  Stack,
  ActionIcon,
  Divider,
  Image
} from '@mantine/core';
import { 
  IconHeart, 
  IconBrandTwitter, 
  IconBrandDiscord, 
  IconBrandLinkedin, 
  IconBrandGithub,
  IconMail,
  IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const Footer = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    type: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Send feedback to backend
      const apiBase = import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk';
      const response = await fetch(`${apiBase.replace(/\/$/, '')}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackForm,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Thank you!',
          message: 'Your feedback has been submitted successfully.',
          color: 'green'
        });
        setFeedbackModalOpen(false);
        setFeedbackForm({ name: '', email: '', type: '', message: '' });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to submit feedback. Please try again.',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const footerLinks = {
    product: [
      { label: 'Features', href: '#', view: 'features' },
      { label: 'Templates', href: '#', view: 'main' },
      { label: 'Pricing', href: '#', view: 'pricing' },
      { label: 'Our Tech', href: '#', view: 'tech' }
    ],
    resources: [
      { label: 'Documentation', href: '#', view: 'docs' },
      { label: 'Support', href: '#', view: 'support' },
      { label: 'Community', href: '#', view: 'community' },
      { label: 'Security', href: '#', view: 'security' },
      { label: 'API', href: '#', view: 'api' },
      { label: 'Report Issue', href: '#', view: 'support' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#', view: 'privacy' },
      { label: 'Terms of Use', href: '#', view: 'terms' },
      { label: 'Beta NDA', href: '#', view: 'beta-nda' },
      { label: 'Liability', href: '#', view: 'liability' },
      { label: 'Cookie Policy', href: '#', view: 'cookies' }
    ],
    company: [
      { label: 'About', href: '#', view: 'about' },
      { label: 'Investors', href: '#', view: 'investors' },
      { label: 'Contact', href: '#', view: 'contact' },
      { label: 'Blog', href: '#', view: 'blog' }
    ]
  };

  const socialLinks = [
    { icon: <IconBrandTwitter size={20} />, href: 'https://twitter.com/squadbox_uk', label: 'Twitter' },
    { icon: <IconBrandDiscord size={20} />, href: 'https://discord.gg/squadbox', label: 'Discord' },
    { icon: <IconBrandLinkedin size={20} />, href: 'https://linkedin.com/company/squadbox', label: 'LinkedIn' },
    { icon: <IconBrandGithub size={20} />, href: 'https://github.com/squadbox', label: 'GitHub' }
  ];

  return (
    <>
      <footer style={{ 
        backgroundColor: '#1a1a1a', 
        borderTop: '1px solid #333',
        marginTop: 'auto',
        paddingTop: '50px',
        paddingBottom: '20px',
        paddingLeft: '40px'
      }}>
        <Container size="xl" >
          <Grid gutter={40}>
            {/* Left Section - Company Info */}
            <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
              <div style={{ marginBottom: '24px' }}>
                <Group mb={20} justify="flex-start" align="flex-start" style={{ width: '100%' }}>
                  <Image
                    src="/images/squadboxboxed.svg"
                    alt="Squadbox Logo"
                    width={180}
                    height={60}
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                      objectFit: 'contain',
                      display: 'block',
                      marginLeft: -10
                    }}
                  />
                </Group>
                
                <Text size="sm" c="dimmed" mb={24} style={{ lineHeight: 1.6, maxWidth: '300px' }}>
                  Squadbox is the AI-powered platform that lets users build fully functioning apps in minutes. 
                  Using our proprietary MMRY Neural Folding technology, Squadbox enables anyone to turn their 
                  words into personal productivity apps, back-office tools, customer portals, or complete 
                  enterprise products that are ready to use, no integrations required.
                </Text>

                <Button 
                  leftSection={<IconHeart size={16} />}
                  variant="light" 
                  color="red"
                  onClick={() => setFeedbackModalOpen(true)}
                  mb={24}
                  size="sm"
                >
                  We ♥️ Feedback
                </Button>

                <Group gap="md">
                  {socialLinks.map((link, index) => (
                    <ActionIcon
                      key={index}
                      variant="subtle"
                      size="lg"
                      component="a"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      color="brand"
                    >
                      {link.icon}
                    </ActionIcon>
                  ))}
                </Group>
              </div>
            </Grid.Col>

            {/* Right Section - Navigation Links */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid gutter={40}>
                <Grid.Col span={{ base: 6, md: 4 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
                    Product
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.product.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.view) window.dispatchEvent(new CustomEvent('sbox:navigate', { detail: { view: link.view } }));
                        }}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                {/* Resources column - hidden */}
                {/* <Grid.Col span={{ base: 6, md: 3 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
                    Resources
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.resources.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col> */}

                <Grid.Col span={{ base: 6, md: 4 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
                    Legal
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.legal.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.view) window.dispatchEvent(new CustomEvent('sbox:navigate', { detail: { view: link.view } }));
                        }}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 6, md: 4 }}>
                  <Text fw={700} size="sm" mb={16} style={{ textTransform: 'uppercase' }} c="brand">
                    Company
                  </Text>
                  <Stack gap={8}>
                    {footerLinks.company.map((link, index) => (
                      <Text 
                        key={index} 
                        size="sm" 
                        component="a" 
                        href={link.href}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--mantine-color-brand-6)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                        onClick={(e) => {
                          e.preventDefault();
                          if (link.view) window.dispatchEvent(new CustomEvent('sbox:navigate', { detail: { view: link.view } }));
                        }}
                      >
                        {link.label}
                      </Text>
                    ))}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          <Divider my={24} style={{ borderColor: 'rgba(100, 180, 255, 0.15)' }} />
          
          <Text size="sm" c="dimmed">
            © Squadbox, a Teknoled-G company 2025
          </Text>
        </Container>
      </footer>

      {/* Feedback Modal */}
      <Modal 
        opened={feedbackModalOpen} 
        onClose={() => setFeedbackModalOpen(false)}
        title="We ♥️ Your Feedback"
        size="md"
      >
        <form onSubmit={handleFeedbackSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Name"
                placeholder="Your name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                required
              />
              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                required
              />
            </Group>

            <Select
              label="Feedback Type"
              placeholder="Select feedback type"
              data={[
                'Bug Report',
                'Feature Request',
                'General Feedback',
                'Compliment',
                'Complaint',
                'Other'
              ]}
              value={feedbackForm.type}
              onChange={(value) => setFeedbackForm({...feedbackForm, type: value})}
              required
            />

            <Textarea
              label="Message"
              placeholder="Tell us what you think..."
              minRows={4}
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
              required
            />

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setFeedbackModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                color="brand"
                loading={submitting}
                leftSection={<IconMail size={16} />}
              >
                Send Feedback
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default Footer;
