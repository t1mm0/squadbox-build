import React from 'react';
import { Container, Title, Text, Card, List } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

const NDAPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconLock size={32} color="var(--mantine-color-brand-6)" />
      Beta Non‑Disclosure Agreement (NDA)
    </Title>

    <Card p="xl" withBorder>
      <Title order={2} mb="sm">1. Confidential Information</Title>
      <Text c="dimmed" mb="md">
        “Confidential Information” includes any non‑public information disclosed by Squadbox Ltd or Teknoled‑G
        (together, “Company”) relating to products, features, data, source code, models, documentation, pricing,
        business plans, roadmaps, and feedback derived from beta use.
      </Text>

      <Title order={2} mb="sm">2. Obligations</Title>
      <List spacing="xs" mb="md">
        <List.Item>Use Confidential Information solely to evaluate or use the beta services.</List.Item>
        <List.Item>Do not disclose, publish, or share Confidential Information with third parties.</List.Item>
        <List.Item>Protect it with at least the same care you use for your own confidential data (and not less than reasonable care).</List.Item>
        <List.Item>Notify Company promptly of any unauthorized access or disclosure.</List.Item>
      </List>

      <Title order={2} mb="sm">3. Feedback</Title>
      <Text c="dimmed" mb="md">
        You grant Company a perpetual, irrevocable, worldwide, royalty‑free license to use feedback you provide
        to improve products and services, without obligation or attribution.
      </Text>

      <Title order={2} mb="sm">4. Exclusions</Title>
      <Text c="dimmed" mb="md">
        Confidential Information does not include information that (a) becomes public through no fault of you,
        (b) you already lawfully knew, (c) was independently developed without use of the Confidential Information,
        or (d) was rightfully received from a third party without duty of confidentiality.
      </Text>

      <Title order={2} mb="sm">5. Term and Return</Title>
      <Text c="dimmed" mb="md">
        This NDA applies during the beta and for 3 years thereafter. Upon request, promptly delete or return
        Confidential Information and certify deletion.
      </Text>

      <Title order={2} mb="sm">6. No Warranty; No Publicity</Title>
      <Text c="dimmed" mb="md">
        Beta services are provided “as is” without warranties. You will not issue press releases or public
        statements about the beta without prior written consent.
      </Text>

      <Title order={2} mb="sm">7. Remedies</Title>
      <Text c="dimmed">
        Unauthorized use or disclosure may cause irreparable harm. Company may seek injunctive relief in
        addition to other remedies available at law.
      </Text>
    </Card>
  </Container>
);

export default NDAPage;


