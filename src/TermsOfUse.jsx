/*
 * TermsOfUse.jsx
 * Purpose: Terms of use page for Squadbox
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React from 'react';
import { Container, Title, Text, Stack, Card, List, Divider } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';

const TermsOfUse = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconFileText size={32} color="var(--mantine-color-brand-6)" />
        Terms of Use
      </Title>

      <Stack gap="xl">
        <Card p="xl" withBorder>
          <Title order={2} mb="md">Last Updated: November 8, 2024</Title>
          <Text size="sm" c="dimmed">
            These Terms of Use govern your use of Squadbox's AI-powered platform. By using our service, you agree to these terms.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Acceptance of Terms</Title>
          <Text size="sm" c="dimmed">
            By accessing or using Squadbox's platform, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access our service.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Service Description</Title>
          <Text size="sm" c="dimmed" mb="md">
            Squadbox provides an AI-powered platform that generates fully functioning applications based on user requirements. Our service includes:
          </Text>
          <List spacing="sm">
            <List.Item>AI-powered code generation and customization</List.Item>
            <List.Item>Template library and project management</List.Item>
            <List.Item>MMRY compression technology for secure storage</List.Item>
            <List.Item>Project deployment and hosting options</List.Item>
            <List.Item>Customer support and documentation</List.Item>
          </List>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">User Accounts</Title>
          <Stack gap="md">
            <div>
              <Text fw={600} mb="xs">Account Creation</Text>
              <Text size="sm" c="dimmed">
                You must create an account to use our service. You are responsible for maintaining the confidentiality of your account credentials.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Account Security</Text>
              <Text size="sm" c="dimmed">
                You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Account Termination</Text>
              <Text size="sm" c="dimmed">
                We may terminate or suspend your account at any time for violations of these terms or for any other reason.
              </Text>
            </div>
          </Stack>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Acceptable Use</Title>
          <Text size="sm" c="dimmed" mb="md">
            You agree not to use our service to:
          </Text>
          <List spacing="sm">
            <List.Item>Violate any applicable laws or regulations</List.Item>
            <List.Item>Generate harmful, illegal, or malicious code</List.Item>
            <List.Item>Infringe on intellectual property rights</List.Item>
            <List.Item>Attempt to gain unauthorized access to our systems</List.Item>
            <List.Item>Interfere with the operation of our platform</List.Item>
            <List.Item>Use our service for spam or harassment</List.Item>
            <List.Item>Share account credentials with others</List.Item>
          </List>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Intellectual Property</Title>
          <Stack gap="md">
            <div>
              <Text fw={600} mb="xs">Your Content</Text>
              <Text size="sm" c="dimmed">
                You retain ownership of the code and projects you create using our platform. You grant us a license to use your content to provide our service.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Our Platform</Text>
              <Text size="sm" c="dimmed">
                Our platform, including MMRY technology, templates, and interface, is protected by intellectual property laws. You may not copy or reverse engineer our technology.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Third-Party Content</Text>
              <Text size="sm" c="dimmed">
                Our platform may include third-party libraries and tools. Their use is governed by their respective licenses.
              </Text>
            </div>
          </Stack>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Payment and Subscriptions</Title>
          <Stack gap="md">
            <div>
              <Text fw={600} mb="xs">Pricing</Text>
              <Text size="sm" c="dimmed">
                Subscription fees are charged in advance. Prices may change with notice. Free tier users have limited access to features.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Billing</Text>
              <Text size="sm" c="dimmed">
                Payments are processed securely through our payment partners. Failed payments may result in service suspension.
              </Text>
            </div>
            <div>
              <Text fw={600} mb="xs">Refunds</Text>
              <Text size="sm" c="dimmed">
                Refunds are provided at our discretion. Unused portions of prepaid periods may be refunded.
              </Text>
            </div>
          </Stack>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Service Availability</Title>
          <Text size="sm" c="dimmed">
            We strive to maintain high service availability but do not guarantee uninterrupted access. We may perform maintenance that temporarily affects service.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Limitation of Liability</Title>
          <Text size="sm" c="dimmed">
            To the maximum extent permitted by law, Squadbox shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Indemnification</Title>
          <Text size="sm" c="dimmed">
            You agree to indemnify and hold harmless Squadbox from any claims arising from your use of our service or violation of these terms.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Governing Law</Title>
          <Text size="sm" c="dimmed">
            These terms are governed by the laws of the United Kingdom. Any disputes shall be resolved in the courts of the United Kingdom.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Changes to Terms</Title>
          <Text size="sm" c="dimmed">
            We may update these terms from time to time. We will notify you of material changes via email or through our platform.
          </Text>
        </Card>

        <Card p="xl" withBorder>
          <Title order={3} mb="md">Contact Information</Title>
          <Text size="sm" c="dimmed">
            If you have questions about these Terms of Use, please contact us at hello@squadbox.uk
          </Text>
        </Card>
      </Stack>
    </Container>
  );
};

export default TermsOfUse;
