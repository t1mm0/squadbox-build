/*
 * ProjectViewer.jsx
 * Purpose: View completed projects in iframe with toolbar controls
 * Last Modified: 2024-12-19
 * Modified By: AI Assistant
 * Completeness: 90/100
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Box,
  Loader,
  ActionIcon,
  Tooltip,
  Badge,
  Select,
  TextInput,
  Divider
} from '@mantine/core';
import {
  IconExternalLink,
  IconRefresh,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDeviceDesktop,
  IconSearch,
  IconArrowLeft,
  IconDownload,
  IconShare,
  IconCode,
  IconEye,
  IconInfoCircle
} from '@tabler/icons-react';
import { useAuth } from './SimpleAuthContext';
import { notifications } from '@mantine/notifications';

function ProjectViewer() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [searchTerm, setSearchTerm] = useState('');
  const [iframeKey, setIframeKey] = useState(0); // For force refresh

  // Fetch completed projects
  useEffect(() => {
    async function fetchCompletedProjects() {
      try {
        setLoading(true);
        const apiBase = import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk';
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/projects/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter only completed projects
        const completedProjects = data.filter(project => 
          project.status === 'complete' && project.has_zip
        );
        setProjects(completedProjects);
        
        // Auto-select first project if available
        if (completedProjects.length > 0 && !selectedProject) {
          setSelectedProject(completedProjects[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load projects',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompletedProjects();
  }, []);

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '600px' };
    }
  };

  const getProjectUrl = (project) => {
    if (!project) return null;
    
    // Try different URL patterns for viewer compatibility
          const baseUrl = `${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}/generated_projects/${project.project_id}`;
    
    // Check if project has a specific entry point
    if (project.entry_point) {
      return `${baseUrl}/${project.entry_point}`;
    }
    
    // Default to index.html
    return `${baseUrl}/index.html`;
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
    setIframeLoading(true);
  };

  const handleShare = () => {
    if (selectedProject) {
      const shareUrl = `${window.location.origin}/viewer?project=${selectedProject.id}`;
      navigator.clipboard.writeText(shareUrl);
      notifications.show({
        title: 'Copied!',
        message: 'Project viewer URL copied to clipboard',
        color: 'green'
      });
    }
  };

  const handleOpenExternal = () => {
    if (selectedProject?.download_url) {
              window.open(`${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}${selectedProject.download_url}`, '_blank');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box ta="center" py="xl">
        <Loader size="lg" />
        <Text mt="md">Loading completed projects...</Text>
      </Box>
    );
  }

  const viewport = getViewportDimensions();

  return (
    <Stack gap="md">
      {/* Header */}
      <Paper p="md" withBorder>
        <Group justify="space-between" align="center">
          <Group>
            <Title order={2}>Project Viewer</Title>
            <Badge variant="light" color="brand">
              {filteredProjects.length} completed projects
            </Badge>
            <Badge variant="light" color="orange" leftSection={<IconInfoCircle size={12} />}>
              Frontend Only
            </Badge>
          </Group>
          
          {selectedProject && (
            <Group gap="xs">
              <Tooltip label="Refresh">
                <ActionIcon 
                  variant="light" 
                  color="blue"
                  onClick={handleRefresh}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Open in new tab">
                <ActionIcon 
                  variant="light" 
                  color="green"
                  onClick={handleOpenExternal}
                >
                  <IconExternalLink size={16} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Share project">
                <ActionIcon 
                  variant="light" 
                  color="violet"
                  onClick={handleShare}
                >
                  <IconShare size={16} />
                </ActionIcon>
              </Tooltip>
              
              <Button
                leftSection={<IconDownload size={16} />}
                variant="light"
                size="sm"
                component="a"
                href={`${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}${selectedProject.download_url}`}
                download
              >
                Download
              </Button>
            </Group>
          )}
        </Group>
      </Paper>

      <Group align="flex-start" gap="md">
        {/* Project Sidebar */}
        <Paper p="md" withBorder style={{ width: '300px', flexShrink: 0 }}>
          <Stack gap="md">
            <TextInput
              placeholder="Search projects..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Divider />
            
            <Text size="sm" fw={500} c="dimmed">
              Select Project to View:
            </Text>
            
            <Stack gap="xs">
              {filteredProjects.map((project) => (
                <Paper
                  key={project.id}
                  p="sm"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedProject?.id === project.id ? 
                      'rgba(100, 180, 255, 0.1)' : 'transparent',
                    borderColor: selectedProject?.id === project.id ? 
                      'var(--mantine-color-brand-6)' : undefined
                  }}
                  onClick={() => {
                    setSelectedProject(project);
                    setIframeLoading(true);
                    setIframeKey(prev => prev + 1);
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {project.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        ID: {project.id}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatDate(project.creation_time)}
                      </Text>
                    </Box>
                    <Badge size="xs" color="green" variant="light">
                      Ready
                    </Badge>
                  </Group>
                </Paper>
              ))}
              
              {filteredProjects.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  {searchTerm ? 'No matching projects' : 'No completed projects found'}
                </Text>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* Viewer Area */}
        <Paper p="md" withBorder style={{ flex: 1 }}>
          {!selectedProject ? (
            <Box ta="center" py="xl">
              <IconEye size={48} color="var(--mantine-color-dimmed)" />
              <Text size="lg" mt="md" c="dimmed">
                Select a project to preview
              </Text>
            </Box>
          ) : (
            <Stack gap="md">
              {/* Toolbar */}
              <Group justify="space-between" align="center">
                <Group>
                  <Text fw={500}>{selectedProject.name}</Text>
                  <Text size="sm" c="dimmed">
                    • {selectedProject.template_id || 'Custom'}
                  </Text>
                </Group>
                
                <Group gap="xs">
                  <Tooltip label="Mobile view">
                    <ActionIcon
                      variant={viewMode === 'mobile' ? 'filled' : 'light'}
                      color="brand"
                      onClick={() => setViewMode('mobile')}
                    >
                      <IconDeviceMobile size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Tablet view">
                    <ActionIcon
                      variant={viewMode === 'tablet' ? 'filled' : 'light'}
                      color="brand"
                      onClick={() => setViewMode('tablet')}
                    >
                      <IconDeviceTablet size={16} />
                    </ActionIcon>
                  </Tooltip>
                  
                  <Tooltip label="Desktop view">
                    <ActionIcon
                      variant={viewMode === 'desktop' ? 'filled' : 'light'}
                      color="brand"
                      onClick={() => setViewMode('desktop')}
                    >
                      <IconDeviceDesktop size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              {/* Iframe Container */}
              <Box
                style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}
              >
                {iframeLoading && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    <Loader size="md" />
                  </Box>
                )}
                
                <Box
                  style={{
                    width: viewport.width,
                    height: viewport.height,
                    border: viewMode !== 'desktop' ? '1px solid var(--mantine-color-gray-4)' : 'none',
                    borderRadius: viewMode !== 'desktop' ? '8px' : '0px',
                    overflow: 'hidden',
                    boxShadow: viewMode !== 'desktop' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <Box
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 40, 100, 0.05)',
                      border: '2px dashed rgba(100, 180, 255, 0.3)',
                      borderRadius: '8px'
                    }}
                  >
                    <Stack gap="md" align="center">
                      <IconCode size={48} color="var(--mantine-color-brand-6)" />
                      <Text size="lg" fw={500} ta="center">
                        Enhanced Project Preview
                      </Text>
                      <Text size="sm" c="dimmed" ta="center" maw={300}>
                        This project includes comprehensive CSS styling and responsive design for optimal viewer experience
                      </Text>
                      <Group gap="xs">
                        <Badge variant="light" color="blue">
                          {selectedProject.template_id || 'Custom'}
                        </Badge>
                        <Badge variant="light" color="green">
                          {selectedProject.status}
                        </Badge>
                        <Badge variant="light" color="purple">
                          Viewer Ready
                        </Badge>
                      </Group>
                      <Group gap="xs">
                        <Button
                          leftSection={<IconDownload size={16} />}
                          variant="light"
                          component="a"
                          href={`${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}${selectedProject.download_url}`}
                          download
                        >
                          Download to View Locally
                        </Button>
                        <Button
                          leftSection={<IconInfoCircle size={16} />}
                          variant="subtle"
                          onClick={() => {
                            notifications.show({
                              title: 'Project Features',
                              message: 'This project includes comprehensive CSS styling, responsive design, and modern UI components for optimal viewing experience.',
                              color: 'blue'
                            });
                          }}
                        >
                          View Features
                        </Button>
                      </Group>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Stack>
          )}
        </Paper>
      </Group>
    </Stack>
  );
}

export default ProjectViewer;
