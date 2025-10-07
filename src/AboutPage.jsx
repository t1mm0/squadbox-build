/*
 * AboutPage.jsx
 * Purpose: Company about page with Squadbox description, Teknoled-G holdings, and product CTAs
 * Last modified: 2025-08-13
 * By: AI Assistant
 * Completeness score: 85
 */

import React from 'react';
import { Title, Text, Group, Image, Paper, Button, Stack, Divider, Badge } from '@mantine/core';
// Local assets (use accurate filenames found under src/public)
import teknoledgHoldings from './public/teknoledge-g-holdings_verion 2.png';
import teknoledgHoldingsSquare from './public/teknoledge-holdings-G-sqare.png';
import dataguardX from './public/DGX-LOGO-FULL.svg';
import tpdxBlue from './public/TPDX-stubby.white.blue.png';
import tpdxPink from './public/TPDX-stubby.prin-orage.buisnes.png';
import thrpyAi from './public/Thrpy.ai-logo@0.5x-white.png';

const AboutPage = () => {
  return (
    <Stack gap="lg" align="center">
      <Title order={1} ta="center">About Squadbox</Title>
      <Text size="md" c="dimmed" style={{ lineHeight: 1.6, maxWidth: 720, textAlign: 'center' }}>
        Squadbox is the AI-powered platform that lets users build fully functioning apps in minutes.
        Using our proprietary MMRY Neural Folding technology, Squadbox enables anyone to turn their
        words into personal productivity apps, back-office tools, customer portals, or complete
        enterprise products that are ready to use, no integrations required.
      </Text>

      {/* Bot Showcase */}
      <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-7)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Stack gap="md" align="center">
          <Title order={3} ta="center">Meet Our AI Development Squad</Title>
          <Text size="sm" c="dimmed" ta="center" maw={500}>
            Our specialized AI bots work together to build your applications
          </Text>
          <Group gap="lg" justify="center">
            {[
              { name: 'Builder Bot', image: '/images/bots/buiilder-bot.png', role: 'Code Generation' },
              { name: 'Deployment Bot', image: '/images/bots/deployment-bot.png', role: 'Deployment' },
              { name: 'Security Bot', image: '/images/bots/data-police-bot.png', role: 'Data Security' },
              { name: 'Designer Bot', image: '/images/bots/deisgnger-bot.png', role: 'UI/UX Design' }
            ].map((bot, index) => (
              <Stack key={index} gap="xs" align="center" style={{ minWidth: '120px' }}>
                <Image
                  src={bot.image}
                  alt={bot.name}
                  height={index === 0 ? 125 : index === 1 ? 100 : 75} // Builder Bot 250%, Deployment Bot 200%, others 150%
                  width="auto"
                  fit="contain"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                />
                <Text size="xs" fw={600}>{bot.name}</Text>
                <Text size="xs" c="dimmed">{bot.role}</Text>
              </Stack>
            ))}
          </Group>
        </Stack>
      </Paper>

      <Divider label="Holdings" labelPosition="center" my="sm" />

      <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-8)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Group gap="lg" align="center" justify="center">
          <Image
            src={teknoledgHoldings}
            alt="Teknoled-G Holdings"
            w={200}
            h={56}
            fit="contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <br />
          <Text size="sm" c="dimmed" ta="center">Part of the Teknoled-G family</Text>
        </Group>
      </Paper>

      <Text size="sm" c="dimmed" style={{ lineHeight: 1.7, maxWidth: 820, textAlign: 'center' }}>
        Teknoled‑G is a research‑led holdings company focused on applied AI, neural data compression,
        and developer productivity tooling. We incubate and acquire products such as Squadbox,
        DataguardX and TPDX, providing shared infrastructure, security, and go‑to‑market support.
        Our mission is to turn advanced AI into dependable, production‑ready products that teams can
        trust to ship faster, safer and at lower cost.
      </Text>

      <Divider label="Products" labelPosition="center" my="sm" />

      <Group wrap="wrap" gap="lg" justify="center">
        <Paper withBorder p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
          <Stack gap={8} align="center">
            <Image
              src={dataguardX}
              alt="DataguardX"
              w={160}
              h={44}
              fit="contain"
              style={{ opacity: 0.9 }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <Badge variant="light" color="cyan">Security</Badge>
            <Button size="xs" variant="light" color="brand" component="a" href="#">Try free</Button>
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md" style={{ backgroundColor: 'var(--mantine-color-dark-7)' }}>
          <Stack gap={8} align="center">
            <Image
              src={tpdxBlue}
              alt="TPDX Personal (Blue)"
              w={160}
              h={44}
              fit="contain"
              style={{ opacity: 0.85 }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <Badge variant="light" color="grape">Personal AI</Badge>
            <Button size="xs" variant="light" color="brand" component="a" href="#">Try free</Button>
          </Stack>
        </Paper>
      </Group>

      <Divider label="Other Teknoled-G products" labelPosition="center" my="md" />

      <Group gap="xl" wrap="wrap" align="center" justify="center">
        <Image
          src={dataguardX}
          alt="DataguardX"
          w={120}
          h={34}
          fit="contain"
          style={{
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        />
        <Image
          src={tpdxBlue}
          alt="TPDX Blue"
          w={120}
          h={34}
          fit="contain"
          style={{
            opacity: 0.65,
            transition: 'opacity 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.65')}
        />
        <Image
          src={tpdxPink}
          alt="TPDX Pink/Orange"
          w={120}
          h={34}
          fit="contain"
          style={{
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        />
        <Image
          src={thrpyAi}
          alt="thrpy.ai"
          w={120}
          h={34}
          fit="contain"
          style={{
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        />
      </Group>
    </Stack>
  );
};

export default AboutPage;


