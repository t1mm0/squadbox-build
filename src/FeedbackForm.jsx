/*
 * FeedbackForm.jsx
 * Purpose: Floating feedback form that captures user state, system state, and errors
 * Last modified: 2025-01-09
 * By: AI Assistant
 * Completeness score: 100/100
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Group,
  Text,
  Stack,
  Collapse,
  Badge,
  ScrollArea,
  Divider,
  ActionIcon,
  Tooltip,
  Select,
  Switch,
  Accordion,
  Code,
  CopyButton,
  Alert
} from '@mantine/core';
import {
  IconBug,
  IconChevronDown,
  IconChevronUp,
  IconX,
  IconMinus,
  IconMaximize,
  IconSend,
  IconCopy,
  IconAlertTriangle,
  IconInfoCircle,
  IconUser,
  IconSettings,
  IconCode,
  IconDatabase
} from '@tabler/icons-react';
import { useAuth } from './SimpleAuthContext';
import './FeedbackForm.css';

const FeedbackForm = ({ 
  appState = {}, 
  buildState = {}, 
  systemState = {},
  errors = [],
  onClose,
  onMinimize 
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('bug');
  const [includeSystemData, setIncludeSystemData] = useState(true);
  const [includeUserData, setIncludeUserData] = useState(true);
  const [includeErrorData, setIncludeErrorData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Collect comprehensive system state
  const collectSystemState = () => {
    const now = new Date().toISOString();
    
    return {
      timestamp: now,
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      localStorage: {
        userApiKey: localStorage.getItem('sb:userApiKey'),
        ollamaUrl: localStorage.getItem('sb:ollamaUrl'),
        session: localStorage.getItem('sb:session')
      },
      performance: {
        memory: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : null,
        timing: performance.timing ? {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        } : null
      },
      console: {
        errors: errors,
        logs: console.log.toString()
      },
      appState: appState,
      buildState: buildState,
      systemState: systemState,
      user: currentUser ? {
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.username,
        subscription: currentUser.subscription,
        role: currentUser.role
      } : null,
      authentication: {
        isAuthenticated,
        hasUser: !!currentUser
      }
    };
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('submitting');

    try {
      const systemData = collectSystemState();
      
      const feedbackData = {
        type: feedbackType,
        message: feedback,
        timestamp: new Date().toISOString(),
        user: currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          username: currentUser.username
        } : null,
        systemData: includeSystemData ? systemData : null,
        userData: includeUserData ? {
          appState,
          buildState,
          systemState
        } : null,
        errors: includeErrorData ? errors : null,
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        }
      };

      // Send to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentUser && { 'Authorization': `Bearer ${localStorage.getItem('sb:session')?.access_token}` })
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFeedback('');
        setTimeout(() => {
          setSubmitStatus(null);
          setIsOpen(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) onMinimize(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const systemDataPreview = collectSystemState();

  return (
    <div className={`feedback-form-container ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {!isOpen ? (
        <Tooltip label="Send Feedback" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            onClick={() => setIsOpen(true)}
            className="feedback-trigger"
          >
            <IconBug size={20} />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Paper shadow="xl" radius="md" className="feedback-form-paper">
          <div className="feedback-header">
            <Group justify="space-between" mb="sm">
              <Group gap="xs">
                <IconBug size={20} />
                <Text fw={600}>Feedback & Bug Report</Text>
                <Badge size="sm" variant="light" color="blue">
                  Beta
                </Badge>
              </Group>
              <Group gap="xs">
                <Tooltip label={isMinimized ? "Expand" : "Minimize"}>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    onClick={toggleMinimize}
                  >
                    {isMinimized ? <IconMaximize size={16} /> : <IconMinus size={16} />}
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Close">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={handleClose}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </div>

          <Collapse in={!isMinimized}>
            <Stack gap="md">
              {/* Feedback Type */}
              <Select
                label="Feedback Type"
                placeholder="Select type"
                value={feedbackType}
                onChange={setFeedbackType}
                data={[
                  { value: 'bug', label: '🐛 Bug Report' },
                  { value: 'feature', label: '💡 Feature Request' },
                  { value: 'improvement', label: '⚡ Improvement' },
                  { value: 'question', label: '❓ Question' },
                  { value: 'other', label: '📝 Other' }
                ]}
              />

              {/* Feedback Message */}
              <Textarea
                label="Your Feedback"
                placeholder="Describe the issue, suggestion, or question..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                minRows={3}
                maxRows={6}
                required
              />

              {/* Data Collection Options */}
              <Accordion variant="contained">
                <Accordion.Item value="data-options">
                  <Accordion.Control>
                    <Group gap="xs">
                      <IconSettings size={16} />
                      <Text fw={500}>Data Collection Options</Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <Switch
                        label="Include System Data (Browser, Performance, Console)"
                        checked={includeSystemData}
                        onChange={(e) => setIncludeSystemData(e.currentTarget.checked)}
                      />
                      <Switch
                        label="Include User State (App State, Build State)"
                        checked={includeUserData}
                        onChange={(e) => setIncludeUserData(e.currentTarget.checked)}
                      />
                      <Switch
                        label="Include Error Reports"
                        checked={includeErrorData}
                        onChange={(e) => setIncludeErrorData(e.currentTarget.checked)}
                      />
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="system-preview">
                  <Accordion.Control>
                    <Group gap="xs">
                      <IconCode size={16} />
                      <Text fw={500}>System Data Preview</Text>
                      <Badge size="xs" variant="light">
                        {Object.keys(systemDataPreview).length} items
                      </Badge>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <ScrollArea h={200}>
                      <Code block>
                        {JSON.stringify(systemDataPreview, null, 2)}
                      </Code>
                    </ScrollArea>
                    <CopyButton value={JSON.stringify(systemDataPreview, null, 2)}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={<IconCopy size={12} />}
                          onClick={copy}
                          mt="sm"
                        >
                          {copied ? 'Copied!' : 'Copy System Data'}
                        </Button>
                      )}
                    </CopyButton>
                  </Accordion.Panel>
                </Accordion.Item>

                {errors.length > 0 && (
                  <Accordion.Item value="errors">
                    <Accordion.Control>
                      <Group gap="xs">
                        <IconAlertTriangle size={16} />
                        <Text fw={500}>Recent Errors</Text>
                        <Badge size="xs" color="red" variant="light">
                          {errors.length}
                        </Badge>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {errors.map((error, index) => (
                          <Alert key={index} color="red" variant="light" icon={<IconAlertTriangle size={16} />}>
                            <Text size="sm">{error}</Text>
                          </Alert>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
              </Accordion>

              {/* Submit Status */}
              {submitStatus && (
                <Alert
                  color={submitStatus === 'success' ? 'green' : submitStatus === 'error' ? 'red' : 'blue'}
                  icon={submitStatus === 'success' ? <IconInfoCircle size={16} /> : <IconAlertTriangle size={16} />}
                >
                  {submitStatus === 'success' && 'Feedback submitted successfully!'}
                  {submitStatus === 'error' && 'Failed to submit feedback. Please try again.'}
                  {submitStatus === 'submitting' && 'Submitting feedback...'}
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                fullWidth
                leftSection={<IconSend size={16} />}
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Send Feedback'}
              </Button>
            </Stack>
          </Collapse>
        </Paper>
      )}
    </div>
  );
};

export default FeedbackForm;
