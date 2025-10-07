import React, { useEffect, useRef } from 'react';
import { Box, Button, Group, Text } from '@mantine/core';

/**
 * MeetingScheduler
 * Production-ready, embeddable meeting scheduler via iframe.
 * - Uses VITE_SCHEDULER_URL if provided, else falls back to Cal.com example link
 * - Emits onBooked when the iFrame posts a booking message (generic listener)
 * - Provides an Open in new tab fallback button
 */
const DEFAULT_URL = 'https://cal.com/squadbox/investor-briefing?embed=true';

const MeetingScheduler = ({ url, height = 560, onBooked }) => {
  const resolvedUrl = url || import.meta.env.VITE_SCHEDULER_URL || DEFAULT_URL;
  const iframeRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      // Best-effort detection of booking events from popular schedulers
      try {
        const data = event?.data;
        const text = typeof data === 'string' ? data : JSON.stringify(data || {});
        if (text && /book|schedule|cal|calendly|meeting/i.test(text)) {
          if (typeof onBooked === 'function') onBooked(data);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onBooked]);

  return (
    <Box>
      <Box
        style={{
          width: '100%',
          height,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.15)'
        }}
      >
        <iframe
          ref={iframeRef}
          title="Meeting Scheduler"
          src={resolvedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera; microphone; clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
        />
      </Box>
      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          Having trouble? Open scheduler in a new tab.
        </Text>
        <Button size="xs" variant="light" component="a" href={resolvedUrl} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </Button>
      </Group>
    </Box>
  );
};

export default MeetingScheduler;


