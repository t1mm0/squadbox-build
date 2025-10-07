/*
 * PrivacyPolicy.jsx
 * Purpose: Privacy policy page for Squadbox
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React from 'react';
import { Container, Title, Text, Stack, Card, List, Divider } from '@mantine/core';
import { IconShield } from '@tabler/icons-react';

const PrivacyPolicy = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconShield size={32} color="var(--mantine-color-brand-6)" />
        Privacy Policy
      </Title>

      <Stack gap="xl">
        <Card p="xl" withBorder>
          <Title order={2} mb="md">Last Updated: November 8, 2024</Title>
          <Text size="sm" c="dimmed">
            This Privacy Policy describes how Squadbox Ltd ("we," "us," or "our") collects, uses, and shares your information when you use our AI-powered platform.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Information We Collect</Title>
          <Stack gap="md">
            <div>
              <Text fw={600} mb="xs">Account Information</Text>
              <Text size="sm" c="dimmed">
                When you create an account, we collect your name, email address, and password. We may also collect profile information you choose to provide.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Usage Data</Text>
              <Text size="sm" c="dimmed">
                We collect information about how you use our platform, including projects created, templates used, build times, and feature interactions.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Project Data</Text>
              <Text size="sm" c="dimmed">
                Your project requirements, generated code, and build logs are stored securely using our MMRY compression technology.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Technical Information</Text>
              <Text size="sm" c="dimmed">
                We collect device information, IP addresses, browser type, and usage analytics to improve our service.
              </Text>
            </div>
          </Stack>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">How We Use Your Information</Title>
          <List spacing="sm">
            <List.Item>Provide and maintain our AI-powered development platform</List.Item>
            <List.Item>Generate and customize projects based on your requirements</List.Item>
            <List.Item>Process payments and manage subscriptions</List.Item>
            <List.Item>Send important service updates and notifications</List.Item>
            <List.Item>Improve our AI models and platform features</List.Item>
            <List.Item>Provide customer support and respond to inquiries</List.Item>
            <List.Item>Ensure platform security and prevent fraud</List.Item>
          </List>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Data Storage and Security</Title>
          <Stack gap="md">
            <div>
              <Text fw={600} mb="xs">MMRY Compression Technology</Text>
              <Text size="sm" c="dimmed">
                Your project data is stored using our proprietary MMRY Neural Folding compression technology, ensuring both security and efficiency.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Encryption</Text>
              <Text size="sm" c="dimmed">
                All data is encrypted in transit and at rest using industry-standard encryption protocols.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Access Controls</Text>
              <Text size="sm" c="dimmed">
                We implement strict access controls and authentication measures to protect your data.
              </Text>
            </div>
          </Stack>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Data Sharing</Title>
          <Text size="sm" c="dimmed" mb="md">
            We do not sell your personal information. We may share your information in the following circumstances:
          </Text>
          <List spacing="sm">
            <List.Item>With your explicit consent</List.Item>
            <List.Item>To comply with legal obligations</List.Item>
            <List.Item>To protect our rights and safety</List.Item>
            <List.Item>With trusted service providers who assist in platform operations</List.Item>
          </List>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Your Rights</Title>
          <Stack gap="md">
            <div>
              <Text fw={600} mb="xs">Access and Portability</Text>
              <Text size="sm" c="dimmed">
                You can access and download your project data at any time through our platform.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Correction</Text>
              <Text size="sm" c="dimmed">
                You can update your account information and project details through your dashboard.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Deletion</Text>
              <Text size="sm" c="dimmed">
                You can delete your account and associated data, though some information may be retained for legal purposes.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Opt-out</Text>
              <Text size="sm" c="dimmed">
                You can unsubscribe from marketing communications while maintaining essential service notifications.
              </Text>
            </div>
          </Stack>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Cookies and Tracking</Title>
          <Text size="sm" c="dimmed" mb="md">
            We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized features.
          </Text>
          <List spacing="sm">
            <List.Item>Essential cookies for platform functionality</List.Item>
            <List.Item>Analytics cookies to improve our service</List.Item>
            <List.Item>Preference cookies to remember your settings</List.Item>
          </List>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Children's Privacy</Title>
          <Text size="sm" c="dimmed">
            Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">International Transfers</Title>
          <Text size="sm" c="dimmed">
            Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Changes to This Policy</Title>
          <Text size="sm" c="dimmed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our platform.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Contact Us</Title>
          <Text size="sm" c="dimmed">
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </Text>
          <Text size="sm" mt="md">
            Email: hello@squadbox.uk<br />
            Address: Squadbox Ltd, [Address], United Kingdom
          </Text>
        </Card>
      </Stack>
    </Container>
  );
};

export default PrivacyPolicy;
