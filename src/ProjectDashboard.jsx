import React, { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Table,
  Badge,
  Group,
  Card,
  Tabs,
  Loader,
  Button,
  Stack,
  Grid,
  List,
  Box,
  ScrollArea,
  Code,
  Divider,
  rem,
  Anchor,
  Collapse,
  ActionIcon
} from '@mantine/core';
import { IconDownload, IconFileText, IconFolder, IconCode, IconTerminal2, IconAlertCircle, IconChevronDown, IconChevronRight, IconRefresh, IconShare } from '@tabler/icons-react';

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/projects/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  // Fetch project details when a project is selected
  useEffect(() => {
    async function fetchProjectDetails(projectId) {
      try {
        setDetailsLoading(true);
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project details: ${response.status}`);
        }
        
        const data = await response.json();
        setProjectDetails(data);
      } catch (error) {
        console.error(`Error fetching project details for ${projectId}:`, error);
        setError(error.message);
      } finally {
        setDetailsLoading(false);
      }
    }
    
    if (selectedProject) {
      fetchProjectDetails(selectedProject);
    } else {
      setProjectDetails(null);
    }
  }, [selectedProject]);

  const handleProjectSelect = (projectId) => {
    // Toggle selection - if clicking the same project, close it
    if (selectedProject === projectId) {
      setSelectedProject(null);
    } else {
      setSelectedProject(projectId);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kilobytes = bytes / 1024;
    if (kilobytes < 1024) {
      return `${kilobytes.toFixed(2)} KB`;
    }
    const megabytes = kilobytes / 1024;
    return `${megabytes.toFixed(2)} MB`;
  };

  // Display loading message if projects are still loading
  if (loading) {
    return (
      <Box ta="center" py="xl">
        <Loader size="lg" />
        <Text mt="md">Loading projects...</Text>
      </Box>
    );
  }

  // Display error message if there was an error fetching projects
  if (error && !projects.length) {
    return (
      <Box ta="center" py="xl" c="red">
        <IconAlertCircle size={40} />
        <Text size="lg" mt="md">Error: {error}</Text>
      </Box>
    );
  }

  const renderProjectDetails = (project) => {
    if (!projectDetails) {
      return (
        <Box ta="center" py="md">
          <Loader size="sm" />
          <Text size="sm" mt="xs">Loading details...</Text>
        </Box>
      );
    }

    return (
      <Box mt="md" p="md" bg="rgba(0, 40, 100, 0.05)" style={{ borderRadius: '8px', border: '1px solid rgba(100, 180, 255, 0.15)' }}>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={5}>Project #{projectDetails.id} - {projectDetails.name}</Title>
            <Group gap="xs">
              <Badge 
                color={projectDetails.status === 'complete' ? 'green' : 
                      projectDetails.status === 'failed' ? 'red' : 'yellow'}
                variant="light"
              >
                {projectDetails.status}
              </Badge>
              {projectDetails.has_zip && (
                <Button 
                  component="a"
                 href={`${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}${projectDetails.download_url}`} 
                  size="sm"
                  variant="filled"
                  color="brand"
                  leftSection={<IconDownload size={14} />}
                  target="_blank"
                  download
                >
                  Download ZIP ({formatFileSize(projectDetails.zip_size)})
                </Button>
              )}
            </Group>
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed">Template:</Text>
              <Text size="sm">{projectDetails.template_id || 'None'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed">Created:</Text>
              <Text size="sm">{formatDate(projectDetails.creation_time)}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed">Build Duration:</Text>
              <Text size="sm">{formatDuration(projectDetails.duration)}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="xs" c="dimmed">Files Generated:</Text>
              <Text size="sm">{projectDetails.file_count || 'N/A'}</Text>
            </Grid.Col>
          </Grid>

          {projectDetails.requirements && projectDetails.requirements.length > 0 && (
            <Box>
              <Text size="sm" fw={500} mb="xs">Requirements:</Text>
              <List size="sm" spacing="xs">
                {projectDetails.requirements.slice(0, 3).map((req, index) => (
                  <List.Item key={index}>{req}</List.Item>
                ))}
                {projectDetails.requirements.length > 3 && (
                  <Text size="xs" c="dimmed">... and {projectDetails.requirements.length - 3} more</Text>
                )}
              </List>
            </Box>
          )}

          {projectDetails.files && projectDetails.files.length > 0 && (
            <Box>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Generated Files:</Text>
                <Badge size="xs" variant="outline">{projectDetails.files.length} files</Badge>
              </Group>
              <ScrollArea h={120}>
                <Stack gap="xs">
                  {projectDetails.files.slice(0, 10).map((file, index) => (
                    <Group key={index} gap="xs" align="center">
                      {file.path.endsWith('.js') || file.path.endsWith('.jsx') || file.path.endsWith('.ts') || file.path.endsWith('.tsx') ? (
                        <IconCode size={12} color="blue" />
                      ) : file.path.endsWith('.json') || file.path.endsWith('.md') || file.path.endsWith('.txt') ? (
                        <IconFileText size={12} color="green" />
                      ) : (
                        <IconFolder size={12} color="gray" />
                      )}
                      <Text size="xs" style={{ fontFamily: 'monospace' }} truncate>{file.path}</Text>
                      <Text size="xs" c="dimmed">({formatFileSize(file.size)})</Text>
                    </Group>
                  ))}
                  {projectDetails.files.length > 10 && (
                    <Text size="xs" c="dimmed">... and {projectDetails.files.length - 10} more files</Text>
                  )}
                </Stack>
              </ScrollArea>
            </Box>
          )}

          {projectDetails.build_log && (
            <Box>
              <Group gap="xs" mb="xs">
                <IconTerminal2 size={14} color="var(--mantine-color-brand-6)" />
                <Text size="sm" fw={500}>Build Console:</Text>
              </Group>
              <ScrollArea h={150}>
                <Box 
                  p="sm" 
                  bg="var(--mantine-color-dark-8)" 
                  style={{ 
                    borderRadius: '6px', 
                    border: '1px solid rgba(100, 180, 255, 0.15)',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                  }}
                >
                  <Code 
                    block 
                    style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '11px',
                      lineHeight: '1.4',
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {projectDetails.build_log}
                  </Code>
                </Box>
              </ScrollArea>
            </Box>
          )}

          {/* Action Buttons Row */}
          <Group gap="md" justify="center" mt="md">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconRefresh size={16} />}
              flex={1}
              onClick={() => {
                // Handle rerun functionality
                console.log('Rerun project:', projectDetails.id);
              }}
            >
              Rerun
            </Button>
            
            <Button
              variant="light"
              color="brand"
              leftSection={<IconDownload size={16} />}
              flex={1}
              component="a"
                             href={projectDetails.has_zip ? `${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}${projectDetails.download_url}` : '#'}
              target="_blank"
              download
              disabled={!projectDetails.has_zip}
            >
              Download
            </Button>
            
            <Button
              variant="filled"
              color="brand"
              leftSection={<IconShare size={16} />}
              flex={1}
              onClick={() => {
                // Handle share functionality
                navigator.clipboard.writeText(window.location.href + '?project=' + projectDetails.id);
                // Could show notification here
                console.log('Share project:', projectDetails.id);
              }}
            >
              Share
            </Button>
          </Group>

          {projectDetails.errors && projectDetails.errors.length > 0 && (
            <Box>
              <Group gap="xs" mb="xs">
                <IconAlertCircle size={14} color="red" />
                <Text size="sm" fw={500} c="red">Errors ({projectDetails.errors.length}):</Text>
              </Group>
              <Stack gap="xs">
                {projectDetails.errors.slice(0, 2).map((error, index) => (
                  <Text key={index} size="xs" c="red">{error}</Text>
                ))}
                {projectDetails.errors.length > 2 && (
                  <Text size="xs" c="dimmed">... and {projectDetails.errors.length - 2} more errors</Text>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Stack gap="xl">
      
      <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
        <IconFolder size={32} color="var(--mantine-color-brand-6)" />
        My Projects
      </Title>

      <Paper shadow="sm" p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-dark-8)', borderColor: 'rgba(100, 180, 255, 0.15)' }}>
        <Group justify="space-between" mb="sm">
          <Title order={3}>Project History</Title>
          <Group gap="md">
            <Badge size="lg" variant="light" color="brand">
              {projects.length} Projects
            </Badge>
            <Badge size="lg" variant="light" color="green">
              {projects.filter(p => p.status === 'complete').length} Complete
            </Badge>
            <Badge size="lg" variant="light" color="yellow">
              {projects.filter(p => p.status === 'generating').length} Building
            </Badge>
          </Group>
        </Group>
        
        {projects.length === 0 ? (
          <Box ta="center" py="xl">
            <IconFolder size={48} color="var(--mantine-color-dimmed)" style={{ marginBottom: '16px' }} />
            <Title order={3} c="dimmed" mb="sm">No projects yet</Title>
            <Text c="dimmed" mb="lg">Start building your first AI-powered web application!</Text>
            <Button 
              variant="filled" 
              color="brand" 
              size="lg"
              onClick={() => {
                // Navigate to main build page
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              Create Your First Project
            </Button>
          </Box>
        ) : (
          <Stack gap="xs" px="lg">
            {projects.map((project, index) => (
              <Box key={project.id}>
                <Paper 
                  p="md" 
                  withBorder
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedProject === project.id ? 'rgba(100, 180, 255, 0.1)' : 'var(--mantine-color-dark-7)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <Group justify="space-between" align="center">
                    <Group gap="md" align="center">
                      <ActionIcon 
                        variant="subtle" 
                        size="sm"
                        style={{ 
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        {selectedProject === project.id ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                      </ActionIcon>
                      
                      <Box>
                        <Group gap="xs" align="center">
                          <Text fw={500}>#{project.id} - {project.name}</Text>
                          <Badge 
                            color={project.status === 'complete' ? 'green' : 
                                  project.status === 'failed' ? 'red' : 'yellow'}
                            variant="light"
                            size="sm"
                          >
                            {project.status}
                          </Badge>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Created: {formatDate(project.creation_time)}
                          {project.has_zip && (
                            <Text component="span" c="brand" fw={500} ml="md">
                              • ZIP: {formatFileSize(project.zip_size)}
                            </Text>
                          )}
                        </Text>
                      </Box>
                    </Group>
                    
                    <Group gap="md">
                      {project.has_zip && (
                        <Button
                          component="a"
                          href={`${(import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '')}${project.download_url}`}
                          onClick={(e) => e.stopPropagation()}
                          size="sm"
                          variant="light"
                          color="brand"
                          leftSection={<IconDownload size={14} />}
                          target="_blank"
                          download
                        >
                          Download ZIP ({formatFileSize(project.zip_size)})
                        </Button>
                      )}
                      <Text size="sm" c="dimmed">
                        Project #{project.id}
                      </Text>
                    </Group>
                  </Group>
                </Paper>
                
                <Collapse in={selectedProject === project.id}>
                  {selectedProject === project.id && renderProjectDetails(project)}
                </Collapse>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

export default ProjectDashboard;