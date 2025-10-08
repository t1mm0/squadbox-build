import React, { useState, useEffect } from 'react';
import { 
  AppShell,
  Container,
  Tabs,
  Text,
  Button,
  TextInput,
  Textarea,
  Paper,
  Grid,
  SimpleGrid,
  Card,
  Badge,
  Group,
  Title,
  Box,
  Image,
  Loader,
  Menu,
  UnstyledButton,
  Avatar,
  Divider,
  ActionIcon,
  Switch,
  Select,
  Modal,
  Stack,
  List,
  ThemeIcon,
  ColorSwatch
} from '@mantine/core';
import { IconBuildingSkyscraper, IconFolder, IconReceipt, IconEye, IconBrain, IconStar, IconCrown, IconLock, IconShield, IconHelp, IconRobot } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import './App.css';
import BuildTimeline from './BuildTimeline';
import BuildConsole from './BuildConsole';
import AiManager from './AiManager';
import ProjectDashboard from './ProjectDashboard';
import SubscriptionPlans from './SubscriptionPlans';
import RequirementsEditor from './RequirementsEditor';
import { useAuth } from './SimpleAuthContext';
import AuthPage from './AuthPage';
import animationManager from './animationManager';
import UserProfile from './UserProfile';
import ProjectViewer from './ProjectViewer';
import OurTech from './OurTech';
import AboutPage from './AboutPage';
import FeedbackForm from './FeedbackForm';
import useStateCollector from './useStateCollector';
import SimplePage from './pages/SimplePage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import DocsPage from './pages/DocsPage';
import GenericPage from './pages/GenericPage';
import NDAPage from './pages/NDAPage';
import DisclaimerPage from './pages/DisclaimerPage';
import SecurityPage from './pages/SecurityPage';
import APIPage from './pages/APIPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import Investors from './Investors';
import LiabilityPage from './pages/LiabilityPage';
import CookiesPage from './pages/CookiesPage';
import ProfileSettings from './ProfileSettings';
import AdminPanel from './AdminPanel';
import SupportPage from './SupportPage';
import AIDevSquad from './AIDevSquad';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';


function App() {
  const { isAuthenticated, currentUser, loading: authLoading } = useAuth();
  const [view, setView] = useState('ai-dev-squad'); // 'ai-dev-squad', 'main', 'dashboard', or 'subscriptions'
  
  // State collector for feedback form
  const { appState, buildState, systemState, errors, updateAppState, updateBuildState } = useStateCollector();
  
  const [userApiKey, setUserApiKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [mode, setMode] = useState('template'); // 'template' or 'nlp'
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templateError, setTemplateError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [customReq, setCustomReq] = useState('');
  const [nlRequest, setNlRequest] = useState('');
  const [requirementsStep, setRequirementsStep] = useState(false);
  const [finalRequirements, setFinalRequirements] = useState([]);
  const [projectName, setProjectName] = useState('My Project');
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [buildStatus, setBuildStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [buildComplete, setBuildComplete] = useState(false);
  const [consoleSrc, setConsoleSrc] = useState('about:blank');
  const [aiStatus, setAiStatus] = useState('');
  const [aiIssues, setAiIssues] = useState([]);
  const [aiCodeQuality, setAiCodeQuality] = useState(null);
  const [headerActivated, setHeaderActivated] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileSettingsTab, setProfileSettingsTab] = useState('profile');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState(null);
  const [buildProtectionModal, setBuildProtectionModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // Check if build is in progress
  const isBuildInProgress = () => {
    return submitted && !buildComplete && buildStatus && 
           !buildStatus.includes('failed') && 
           !buildStatus.includes('complete') &&
           buildStatus !== 'Build failed to start.';
  };

  // Handle navigation with build protection
  const handleNavigation = (newView) => {
    if (isBuildInProgress()) {
      setPendingNavigation(newView);
      setBuildProtectionModal(true);
      return false;
    }
    setView(newView);
    return true;
  };

  // Handle build protection actions
  const handleBuildProtectionAction = (action) => {
    setBuildProtectionModal(false);
    
    if (action === 'terminate') {
      // Terminate build and navigate
      setSubmitted(false);
      setBuildStatus('');
      setBuildComplete(false);
      setProjectId(null);
      setConsoleSrc('about:blank');
      setAiStatus('');
      setAiIssues([]);
      setAiCodeQuality(null);
      setHeaderActivated(false);
      
      if (pendingNavigation) {
        setView(pendingNavigation);
        setPendingNavigation(null);
      }
    } else if (action === 'continue') {
      // Cancel navigation, continue building
      setPendingNavigation(null);
    } else if (action === 'pause') {
      // Pause build (implement pause logic here)
      // For now, just cancel navigation
      setPendingNavigation(null);
    }
  };

  // Reset header when navigating away from build page
  useEffect(() => {
    if (view !== 'main' || (!submitted && !requirementsStep)) {
      setHeaderActivated(false);
    }
  }, [view, submitted, requirementsStep]);

  // Basic client-side routing: map views <-> paths
  const viewToPath = {
    'ai-dev-squad': '/', // AI Dev Squad is now the default landing page
    'index': '/index',
    main: '/build',
    dashboard: '/dashboard',
    features: '/features',
    pricing: '/pricing',
    tech: '/tech',
    support: '/support',
    docs: '/docs',
    community: '/community',
    security: '/security',
    api: '/api',
    privacy: '/privacy',
    terms: '/terms',
    'beta-nda': '/beta-nda',
    liability: '/liability',
    cookies: '/cookies',
    about: '/about',
    investors: '/investor',
    contact: '/contact',
    blog: '/blog',
    subscriptions: '/subscriptions',
    admin: '/admin',
    settings: '/settings',
  };
  const pathToView = Object.fromEntries(Object.entries(viewToPath).map(([k, v]) => [v, k]));

  // Initialize view from path
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const initialView = pathToView[path] || 'ai-dev-squad'; // Default to AI Dev Squad
    setView(initialView);
  }, []);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const newView = pathToView[path] || 'ai-dev-squad';
      handleNavigation(newView);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Browser navigation protection (back button, refresh, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isBuildInProgress()) {
        e.preventDefault();
        e.returnValue = 'A build is in progress. Are you sure you want to leave?';
        return 'A build is in progress. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [submitted, buildComplete, buildStatus]);

  // Load saved client settings
  useEffect(() => {
    const savedKey = localStorage.getItem('sb:userApiKey');
    const savedOllama = localStorage.getItem('sb:ollamaUrl');
    if (savedKey) setUserApiKey(savedKey);
    if (savedOllama) setOllamaUrl(savedOllama);
  }, []);

  // Handle back/forward
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const nextView = pathToView[path] || 'ai-dev-squad';
      setView(nextView);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Push history for SPA navigation when view changes via in-app interactions
    const path = viewToPath[view] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [view]);

  // Footer-driven navigation (About link)
  useEffect(() => {
    const handler = (e) => {
      if (e?.detail?.view) setView(e.detail.view);
    };
    window.addEventListener('sbox:navigate', handler);
    return () => window.removeEventListener('sbox:navigate', handler);
  }, []);
  
  const handleNavigateToSettings = (tab) => {
    setProfileSettingsTab(tab);
    setShowProfileSettings(true);
    setView('settings');
  };

  // Rating component for templates
  const TemplateRating = ({ rating = 4.5, size = 14, interactive = false, onRatingChange }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    const handleStarClick = (starIndex) => {
      if (interactive && onRatingChange) {
        onRatingChange(starIndex + 1);
      }
    };
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(fullStars)].map((_, i) => (
          <IconStar 
            key={`full-${i}`} 
            size={size} 
            style={{ 
              color: 'rgba(255, 255, 255, 0.3)',
              transition: 'color 0.2s ease',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className="template-star"
            onClick={() => handleStarClick(i)}
          />
        ))}
        {hasHalfStar && (
          <IconStar 
            size={size} 
            style={{ 
              color: 'rgba(255, 255, 255, 0.3)',
              transition: 'color 0.2s ease',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className="template-star"
            onClick={() => handleStarClick(fullStars)}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <IconStar 
            key={`empty-${i}`} 
            size={size} 
            style={{ 
              color: 'rgba(255, 255, 255, 0.1)',
              transition: 'color 0.2s ease',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className="template-star"
            onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
          />
        ))}
        <Text size="xs" c="dimmed" ml={4} style={{ opacity: 0.7 }}>
          {rating}
        </Text>
      </div>
    );
  };

  // Check if template is premium and user has access
  const isTemplatePremium = (template) => {
    return template.access_tier === 'pro' || template.access_tier === 'enterprise';
  };

  const hasTemplateAccess = (template) => {
    if (!isTemplatePremium(template)) return true;
    if (!currentUser) return false;
    
    const userTier = currentUser.subscription;
    if (template.access_tier === 'pro' && (userTier === 'basic' || userTier === 'unlimited')) return true;
    if (template.access_tier === 'enterprise' && userTier === 'unlimited') return true;
    
    return false;
  };

  // Handle template selection for modal
  const handleTemplateSelect = (template) => {
    if (isBuildInProgress()) {
      setPendingNavigation('template-selection');
      setBuildProtectionModal(true);
      return;
    }
    
    if (!hasTemplateAccess(template)) {
      notifications.show({
        title: 'Premium Template',
        message: 'This template requires a higher subscription tier.',
        color: 'yellow'
      });
      return;
    }
    setSelectedTemplate(template); // Set the selected template
    setSelectedTemplateForModal(template);
    setTemplateModalOpen(true);
  };

  // Handle modal customization and build
  const handleModalCustomizeAndBuild = () => {
    if (!selectedTemplateForModal) return;
    
    setSelectedTemplate(selectedTemplateForModal);
    setTemplateModalOpen(false);
    
    // Move to requirements step
    let reqs = [];
    
    // Handle free form template
    if (selectedTemplateForModal.id === 'free-form') {
      if (customReq.trim()) {
        reqs.push(customReq.trim());
      }
    } else {
      // Handle regular templates
      if (templateDetails) {
        if (templateDetails.tech_stack) {
          reqs.push(`Use tech stack: ${templateDetails.tech_stack.join(', ')}`);
        }
        
        if (templateDetails.structure) {
          if (templateDetails.structure.pages) {
            templateDetails.structure.pages.forEach(page => {
              reqs.push(`Create page: ${page.name}`);
            });
          }
          
          if (templateDetails.structure.components) {
            reqs.push(`Include components: ${templateDetails.structure.components.join(', ')}`);
          }
        }
      }
      
      if (customReq.trim()) {
        const customReqs = customReq
          .split(/,|\n/)
          .map(r => r.trim())
          .filter(r => r.length > 0);
        reqs = [...reqs, ...customReqs];
      }
    }
    
    setFinalRequirements([...new Set(reqs)]);
    setRequirementsStep(true);
  };
  
  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        setTemplatesLoading(true);
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        console.log('🔍 Fetching templates from:', `${apiBase.replace(/\/$/, '')}/templates/`);
        
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/templates/`);
        console.log('📡 Templates response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Templates loaded successfully:', data.length, 'templates');
        setTemplates(data);
      } catch (error) {
        console.error("❌ Error fetching templates:", error);
        setTemplateError(error.message);
      } finally {
        setTemplatesLoading(false);
      }
    }
    
    fetchTemplates();
  }, []);
  
  // Fetch template details when template is selected
  useEffect(() => {
    async function fetchTemplateDetails(templateId) {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/templates/${templateId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch template details: ${response.status}`);
        }
        
        const data = await response.json();
        setTemplateDetails(data);
      } catch (error) {
        console.error(`Error fetching template details for ${templateId}:`, error);
      }
    }
    
    if (selectedTemplate?.id) {
      fetchTemplateDetails(selectedTemplate.id);
    } else {
      setTemplateDetails(null);
    }
  }, [selectedTemplate]);

  const handleTemplateNext = (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    let reqs = [];
    
    // If we have template details with structure information
    if (templateDetails) {
      // Add tech stack as requirements
      if (templateDetails.tech_stack) {
        reqs.push(`Use tech stack: ${templateDetails.tech_stack.join(', ')}`);
      }
      
      // Add page/component requirements based on structure
      if (templateDetails.structure) {
        if (templateDetails.structure.pages) {
          templateDetails.structure.pages.forEach(page => {
            reqs.push(`Create page: ${page.name}`);
          });
        }
        
        if (templateDetails.structure.components) {
          reqs.push(`Include components: ${templateDetails.structure.components.join(', ')}`);
        }
      }
    }
    
    // Add custom requirements
    if (customReq.trim()) {
      // Split customReq by comma or newline
      const customReqs = customReq
        .split(/,|\n/)
        .map(r => r.trim())
        .filter(r => r.length > 0);
      reqs = [...reqs, ...customReqs];
    }
    
    setFinalRequirements([...new Set(reqs)]);
    setRequirementsStep(true);
  };

  const handleRequirementsConfirm = async (reqs) => {
    setFinalRequirements([...new Set(reqs)]);
    setRequirementsStep(false);
    setSubmitted(true);
    setBuildComplete(false);
    setBuildStatus('Uploading and starting build...');
    setAiStatus('');
    setAiIssues([]);
    setAiCodeQuality(null);
    setHeaderActivated(false); // Reset header to transparent when starting new build
    
    // Prepare form data
    const formData = new FormData();
    
    // Add project name
    formData.append('project_name', projectName);
    
    // Add requirements
    reqs.forEach((req) => {
      formData.append('requirements', req);
    });
    
    // Add template ID if one is selected
    if (selectedTemplate?.id) {
      formData.append('template_id', selectedTemplate.id);
    }
    
    // Add project type (web by default)
    formData.append('project_type', 'web');

    // Wire: user-provided API key and local Ollama preferences
    if (userApiKey && userApiKey.startsWith('sk-')) {
      formData.append('user_api_key', userApiKey);
      formData.append('use_personal_key', '1');
    }
    if (ollamaUrl) {
      formData.append('ollama_url', ollamaUrl);
    }
    if (ollamaConnected) {
      formData.append('use_ollama', '1');
    }
    
    try {
      const apiBaseGen = import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk';
      const res = await fetch(`${apiBaseGen.replace(/\/$/, '')}/generate-project/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Build request failed');
      
      const data = await res.json();
      setProjectId(data.project_id);
      const apiBaseDl = (import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '');
      setDownloadUrl(`${apiBaseDl}${data.zip_file}`);
      setConsoleSrc(`${apiBaseDl}/logs/${data.project_id}`);
      setBuildStatus('Build started...');
      pollBuildStatus(data.project_id);
      pollLogs(data.project_id);
    } catch (err) {
      console.error("Error starting build:", err);
      setBuildStatus('Build failed to start.');
      setBuildComplete(true);
    }
  };

  // Set log source URL
  const pollLogs = (projectId) => {
    // Set console source to the logs endpoint
    const apiBase = (import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '');
    setConsoleSrc(`${apiBase}/logs/${projectId}`);
  };

  // Real-time polling of build status
  const pollBuildStatus = (projectId) => {
    const interval = setInterval(async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '');
        const res = await fetch(`${apiBase}/build-status/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          
          // Update UI based on build status
          switch(data.status) {
            case 'initializing':
              setBuildStatus('Initializing build process...');
              setAiStatus('Analyzing requirements...');
              setAiIssues([]);
              setAiCodeQuality(75);
              setHeaderActivated(true);
              break;
              
            case 'generating':
              setBuildStatus(`Building... (${data.file_count} files generated)`);
              setAiStatus('Generating code and validating...');
              setAiIssues([]);
              setAiCodeQuality(85);
              setHeaderActivated(true);
              break;
              
            case 'complete':
              setBuildStatus('Build complete!');
              setAiStatus('All requirements implemented successfully.');
              setAiIssues([]);
              setAiCodeQuality(95);
              setBuildComplete(true);
              setHeaderActivated(true);
              clearInterval(interval); // Stop polling
              break;
              
            case 'failed':
              setBuildStatus('Build failed.');
              setAiStatus('Build failed with errors. Check the console logs below for details.');
              setAiIssues(['Build process encountered errors', 'Review console output for specific issues', 'Try adjusting your requirements and rebuilding']);
              setAiCodeQuality(50);
              setBuildComplete(true);
              setHeaderActivated(true);
              clearInterval(interval); // Stop polling
              break;
              
            default:
              setBuildStatus(`Build status: ${data.status}`);
          }
        }
      } catch (error) {
        console.error("Error polling build status:", error);
        // Stop polling on error after a few attempts
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds
    
    // Stop polling after 10 minutes as a safety measure
    setTimeout(() => clearInterval(interval), 600000);
  };

  // Show loading state without early return to avoid hooks violation
  const showAuthLoading = authLoading && (view === 'dashboard' || view === 'subscriptions' || view === 'settings' || view === 'admin');

  // TEMPORARY: Force show main page regardless of auth state for debugging
  console.log('Rendering app with auth state:', { authLoading, isAuthenticated, currentUser, view });
  
  // TEMPORARILY BYPASS AUTH FOR TESTING
  console.log('Auth state:', { authLoading, isAuthenticated, currentUser });
  
  // Add debugging for blank page issue
  console.log('App render state:', { 
    showAuthLoading, 
    shouldShowAuthPage, 
    view, 
    authLoading, 
    isAuthenticated 
  });

  // Public marketing/legal views allowed before login
  const publicViews = new Set([
    'index', 'ai-dev-squad', 'tech', 'features', 'pricing', 'docs', 'community', 'security', 'api', 'about', 'support',
    'privacy', 'terms', 'beta-nda', 'liability', 'cookies', 'contact', 'blog'
  ]);

  // Check if should show auth page (without early return)
  // FORCE public pages to always show, even if auth is loading
  const shouldShowAuthPage = !isAuthenticated && !publicViews.has(view) && !authLoading;

  // Auto-redirect authenticated users to dashboard if they're on main page
  // Define protected pages that require authentication
  const protectedPages = ['main', 'dashboard', 'subscriptions', 'settings', 'admin'];
  
  useEffect(() => {
    // Only redirect to dashboard if user is authenticated AND trying to access a protected page
    if (isAuthenticated && protectedPages.includes(view)) {
      console.log('User authenticated, accessing protected page:', view);
      // Allow access to protected pages
    } else if (isAuthenticated && (view === 'index' || view === 'ai-dev-squad' || view === 'tech')) {
      // Keep users on public pages even when authenticated - don't auto-redirect
      console.log('User authenticated but staying on public page:', view);
    }
  }, [isAuthenticated, view]);
  
  // Show loading state if needed - but with a timeout
  if (showAuthLoading) {
    // Add a timeout to prevent infinite loading
    setTimeout(() => {
      console.log('Auth loading timeout, forcing loading to false');
      setLoading(false);
    }, 2000);
    
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}>
        <Image 
          src="/images/squadboxboxed.svg" 
          alt="Squadbox Logo" 
          w={200}
          h={60}
          fit="contain"
          mb={40}
          style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
        />
        <Loader size="xl" color="brand" />
        <Text size="sm" c="dimmed" mt={20}>
          Loading authentication...
        </Text>
      </div>
    );
  }

  // Show auth page if needed
  if (shouldShowAuthPage) {
    return <AuthPage />;
  }

  // FORCE show public pages even if auth is loading
  if (publicViews.has(view) && authLoading) {
    console.log('Forcing public page display despite auth loading');
    // Continue to render the page
  }

  // User is authenticated, show main app
  return (
    <AppShell>
      <AppShell.Header 
        pt="xl" 
        pb="sm" 
        className={headerActivated ? 'activated' : ''}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          backgroundColor: headerActivated ? 'rgba(0, 40, 100, 0.95)' : 'rgba(0, 0, 0, 0.2)',
          backdropFilter: headerActivated ? 'blur(15px)' : 'blur(20px)',
          WebkitBackdropFilter: headerActivated ? 'blur(15px)' : 'blur(20px)',
          borderBottom: headerActivated ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: 48, paddingRight: 64, marginBottom: 13, height: '65px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image 
              src="/images/squadboxboxed.svg" 
              alt="Squadbox Logo" 
              w={180} 
              h={50}
              fit="contain" 
              style={{ alignSelf: 'center' }}
            />
            <Badge 
              variant="gradient" 
              gradient={{ from: 'orange', to: 'red' }}
              size="sm"
              style={{ 
                fontSize: '10px', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Beta
            </Badge>
          </div>
          <div style={{ height: '65px', display: 'flex', alignItems: 'center' }}>
            <UserProfile onNavigateToSettings={handleNavigateToSettings} />
          </div>
        </div>
        

        <div style={{ width: '100%', marginBottom: '13px' }}>
          <Tabs 
            value={view} 
            onChange={handleNavigation} 
            color="brand" 
            classNames={{ root: 'header-tabs' }}
            position="center"
          >
              <Tabs.List style={{ borderBottom: 'none' }}>
              <Tabs.Tab 
                value="ai-dev-squad" 
                leftSection={<IconRobot size={16} />}
              >
                AI Dev Squad
              </Tabs.Tab>
              <Tabs.Tab 
                value="tech" 
                leftSection={<IconBrain size={16} />}
              >
                Our Tech
              </Tabs.Tab>
              {isAuthenticated && (
                <Tabs.Tab 
                  value="main" 
                  leftSection={<IconBuildingSkyscraper size={16} />}
                >
                  Build Project
                </Tabs.Tab>
              )}
              {isAuthenticated && (
                <Tabs.Tab 
                  value="dashboard" 
                  leftSection={<IconFolder size={16} />}
                >
                  My Projects
                </Tabs.Tab>
              )}
              {currentUser?.subscription === 'free' && (
                <Tabs.Tab 
                  value="subscriptions" 
                  leftSection={<IconReceipt size={16} />}
                >
                  Subscriptions
                </Tabs.Tab>
              )}
              {/* <Tabs.Tab 
                value="viewer" 
                leftSection={<IconEye size={16} />}
              >
                Viewer
              </Tabs.Tab> */}
              {currentUser?.role === 'admin' && (
                <Tabs.Tab 
                  value="admin" 
                  leftSection={<IconShield size={16} />}
                >
                  Admin
                </Tabs.Tab>
              )}
              <Tabs.Tab value="support" leftSection={<IconHelp size={16} />}>
                Support
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      </AppShell.Header>
      
      <AppShell.Main pt={30} style={{ backgroundColor: '#1a1a1a' }}>
        <Container size="lg" pt={20} pb="xl" style={{ backgroundColor: '#1a1a1a' }}>
          {view === 'dashboard' ? (
            <div style={{ marginTop: 175 }}>
              <ProjectDashboard />
            </div>
          ) : view === 'subscriptions' ? (
            <div style={{ marginTop: 175 }}>
              <SubscriptionPlans />
            </div>
          ) : view === 'settings' ? (
            <div style={{ marginTop: 175 }}>
              <ProfileSettings initialTab={profileSettingsTab} />
            </div>
          ) : /* view === 'viewer' ? (
            <div style={{ marginTop: 175 }}>
              <ProjectViewer />
            </div>
          ) : */ view === 'tech' ? (
            <div style={{ marginTop: 175 }}>
              <OurTech />
            </div>
          ) : view === 'about' ? (
            <div style={{ marginTop: 175 }}>
              <AboutPage />
            </div>
          ) : view === 'admin' ? (
            <div style={{ marginTop: 175 }}>
              <AdminPanel />
            </div>
          ) : view === 'support' ? (
            <div style={{ marginTop: 175 }}>
              <SupportPage />
            </div>
          ) : view === 'features' ? (
            <div style={{ marginTop: 175 }}>
              <FeaturesPage />
            </div>
          ) : view === 'templates' ? (
            <div style={{ marginTop: 175 }}>
              <SimplePage title="Templates" />
            </div>
          ) : view === 'privacy' ? (
            <div style={{ marginTop: 175 }}>
              <PrivacyPolicy />
            </div>
          ) : view === 'terms' ? (
            <div style={{ marginTop: 175 }}>
              <TermsOfUse />
            </div>
          ) : view === 'beta-nda' ? (
            <div style={{ marginTop: 175 }}>
              <NDAPage />
            </div>
          ) : view === 'liability' ? (
            <div style={{ marginTop: 175 }}>
              <LiabilityPage />
            </div>
          ) : view === 'cookies' ? (
            <div style={{ marginTop: 175 }}>
              <CookiesPage />
            </div>
          ) : view === 'pricing' ? (
            <div style={{ marginTop: 175 }}>
              <PricingPage />
            </div>
          ) : view === 'index' ? (
            <div style={{ marginTop: 175 }}>
              <AIDevSquad />
            </div>
          ) : view === 'ai-dev-squad' ? (
            <div style={{ marginTop: 175 }}>
              <AIDevSquad />
            </div>
          ) : view === 'docs' ? (
            <div style={{ marginTop: 175 }}>
              <DocsPage />
            </div>
          ) : view === 'community' ? (
            <div style={{ marginTop: 175 }}>
              <GenericPage title="Community" />
            </div>
          ) : view === 'security' ? (
            <div style={{ marginTop: 175 }}>
              <SecurityPage />
            </div>
          ) : view === 'api' ? (
            <div style={{ marginTop: 175 }}>
              <APIPage />
            </div>
          ) : view === 'investors' ? (
            <div style={{ marginTop: 175 }}>
              <Investors />
            </div>
          ) : view === 'contact' ? (
            <div style={{ marginTop: 175 }}>
              <ContactPage />
            </div>
          ) : view === 'blog' ? (
            <div style={{ marginTop: 175 }}>
              <BlogPage />
            </div>
          ) : !requirementsStep && !submitted ? (
          <div className="input-methods" style={{ marginTop: 125 }}>
            {/* Bot Hero Section */}
            <Box mb="xl" ta="center">
              <Title order={1} size="3rem" fw={900} mb="md">
                Build Apps with
                <Text span c="brand" inherit> AI Squad</Text>
              </Title>
              <Text size="lg" c="dimmed" mb="xl" maw={600} mx="auto">
                Our specialized AI bots work together to build your applications in minutes, not months.
              </Text>
              <SimpleGrid cols={{ base: 3, sm: 6 }} spacing="md" mb="xl">
                {[
                  { name: 'Builder', image: '/images/bots/buiilder-bot.png' },
                  { name: 'Deployer', image: '/images/bots/deployment-bot.png' },
                  { name: 'Security', image: '/images/bots/data-police-bot.png' },
                  { name: 'Designer', image: '/images/bots/deisgnger-bot.png' },
                  { name: 'Manager', image: '/images/bots/project-manager.png' },
                  { name: 'Logic', image: '/images/bots/logic-weaver-bot.png' }
                ].map((bot, index) => (
                  <Box key={index} ta="center">
                    <Image
                      src={bot.image}
                      alt={bot.name}
                      height={index === 0 ? 150 : index === 1 ? 120 : 90} // Builder Bot 250%, Deployment Bot 200%, others 150%
                      width="auto"
                      fit="contain"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                    />
                    <Text size="xs" c="dimmed" mt="xs">{bot.name}</Text>
                  </Box>
                ))}
              </SimpleGrid>
              
              {/* Headlines below bots */}
              <Box mt="xl" ta="center">
                <Title order={2} size="2rem" fw={700} mb="md">
                  Build Your Next Project with AI
                </Title>
                <Text size="lg" c="dimmed" maw={700} mx="auto">
                  Our specialized AI bots work together to transform your ideas into production-ready applications. 
                  Choose from templates or describe your vision in natural language.
                </Text>
              </Box>
            </Box>
            {/* Configure LLM Section */}
            <Box mb="xl">
              <Title order={2} size="1.5rem" fw={700} ta="center" mb="lg">
                Configure LLM
              </Title>
              
              {/* API Key / Local Ollama Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                alignItems: 'end',
                marginBottom: 24
              }}>
                <div>
                  <Title order={3} mb="xs">Use your own API key</Title>
                <Text size="sm" c="dimmed" mb="xs">Use your provider credits for faster uncapped builds.</Text>
                <Group align="end" wrap="nowrap">
                  <TextInput placeholder="sk-..." style={{ flex: 1 }} value={userApiKey} onChange={(e) => setUserApiKey(e.currentTarget.value)} />
                  <Button
                    variant="light"
                    onClick={() => {
                      if (!userApiKey || !userApiKey.startsWith('sk-')) {
                        notifications.show({ title: 'Invalid key', message: 'Enter a valid API key (sk-...)', color: 'red' });
                        return;
                      }
                      localStorage.setItem('sb:userApiKey', userApiKey);
                      notifications.show({ title: 'Saved', message: 'API key stored locally for this browser.', color: 'green' });
                    }}
                  >
                    Save
                  </Button>
                </Group>
              </div>
              <div>
                <Title order={3} mb="xs">Or run locally with Ollama</Title>
                <Text size="sm" c="dimmed" mb="xs">Use your local Ollama CLI for private, offline builds.</Text>
                <Group wrap="nowrap" align="end">
                  <TextInput placeholder="http://localhost:11434" style={{ flex: 1 }} value={ollamaUrl} onChange={(e) => setOllamaUrl(e.currentTarget.value)} />
                  <Button
                    variant="light"
                    onClick={async () => {
                      try {
                        const controller = new AbortController();
                        const id = setTimeout(() => controller.abort(), 4000);
                        const res = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/tags`, { signal: controller.signal });
                        clearTimeout(id);
                        if (res.ok) {
                          setOllamaConnected(true);
                          localStorage.setItem('sb:ollamaUrl', ollamaUrl);
                          notifications.show({ title: 'Ollama connected', message: 'Local model endpoint is reachable.', color: 'green' });
                        } else {
                          setOllamaConnected(false);
                          notifications.show({ title: 'Connection failed', message: `HTTP ${res.status}`, color: 'red' });
                        }
                      } catch (err) {
                        setOllamaConnected(false);
                        notifications.show({ title: 'Connection failed', message: 'Could not reach Ollama on provided URL.', color: 'red' });
                      }
                    }}
                  >
                    {ollamaConnected ? 'Connected' : 'Connect'}
                  </Button>
                </Group>
              </div>
            </div>
            </Box>

            {/* AI Model Configuration */}
            <Box mb="xl">
              <Title order={2} size="1.5rem" fw={700} ta="center" mb="lg">
                Choose AI Model
              </Title>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
                alignItems: 'start'
              }}>
                {/* Model Selection */}
                <div>
                  <Title order={3} mb="xs">Choose a Model</Title>
                  <Text size="sm" c="dimmed" mb="xs">Select your preferred AI model for code generation</Text>
                  <Select
                    placeholder="Select AI Model"
                    data={[
                      { value: 'llama3.2', label: 'Llama 3.2 (FREE - Local)' },
                      { value: 'codellama', label: 'CodeLlama (FREE - Local)' },
                      { value: 'mistral', label: 'Mistral 7B (FREE - Local)' },
                      { value: 'gemma', label: 'Gemma 2B (FREE - Local)' },
                      { value: 'gpt-4o', label: 'GPT-4o (API Key Required)' },
                      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (API Key Required)' },
                      { value: 'claude-3-opus', label: 'Claude 3 Opus (API Key Required)' },
                      { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (API Key Required)' },
                      { value: 'gemini-pro', label: 'Gemini Pro (API Key Required)' }
                    ]}
                    styles={{
                      input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'var(--mantine-color-gray-0)' }
                    }}
                  />
                </div>

                {/* API Key for Cloud Models */}
                <div>
                  <Title order={3} mb="xs">Add your API Key (if needed)</Title>
                  <Text size="sm" c="dimmed" mb="xs">Required for cloud models (GPT, Claude, Gemini), not needed for local models</Text>
                  <Group align="end" wrap="nowrap">
                    <TextInput 
                      placeholder="sk-..." 
                      style={{ flex: 1 }} 
                      value={userApiKey} 
                      onChange={(e) => setUserApiKey(e.currentTarget.value)}
                      styles={{
                        input: { backgroundColor: 'var(--mantine-color-dark-6)', color: 'var(--mantine-color-gray-0)' }
                      }}
                    />
                    <Button
                      variant="light"
                      onClick={() => {
                        if (!userApiKey || !userApiKey.startsWith('sk-')) {
                          notifications.show({ title: 'Invalid key', message: 'Enter a valid API key (sk-...)', color: 'red' });
                          return;
                        }
                        localStorage.setItem('sb:userApiKey', userApiKey);
                        notifications.show({ title: 'Saved', message: 'API key stored locally for this browser.', color: 'green' });
                      }}
                    >
                      Save
                    </Button>
                  </Group>
                </div>
              </div>
            </Box>

            {mode === 'template' ? (
              <form onSubmit={handleTemplateNext} className="template-form">
                <Title order={1} style={{ marginTop: 10, marginBottom: 20 }}>
                  <span style={{ color: 'var(--mantine-color-brand-6)', fontWeight: 'bold', marginRight: 8 }}>1.</span>
                  Select a Template
                </Title>
                <div className="template-list">
                  {templatesLoading ? (
                    <div className="loading" style={{ textAlign: 'center', padding: '2rem', color: '#1a7ee6' }}>
                      <div>🔄 Loading templates...</div>
                      <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Fetching from API...
                      </div>
                    </div>
                  ) : templateError ? (
                    <div className="error" style={{ textAlign: 'center', padding: '2rem', color: '#F44336' }}>
                      <div>❌ Error loading templates: {templateError}</div>
                      <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Check console for details. API URL: {import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk'}
                      </div>
                      <button 
                        onClick={() => window.location.reload()} 
                        style={{ 
                          marginTop: '1rem', 
                          padding: '0.5rem 1rem', 
                          backgroundColor: '#1a7ee6', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : templates.length === 0 ? (
                    <div className="no-templates" style={{ textAlign: 'center', padding: '2rem', color: '#FF9800' }}>
                      <div>⚠️ No templates available</div>
                      <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Check if backend is running on port 8000
                      </div>
                    </div>
                  ) : (
                    [
                      {
                        id: 'free-form',
                        name: 'Custom Project',
                        description: 'Describe what you want to build in natural language',
                        tech_stack: ['Custom'],
                        isFreeForm: true
                      },
                      ...templates
                    ].map(t => (
                      <div 
                        key={t.id} 
                        className={`template-card ${selectedTemplate?.id === t.id ? 'selected' : ''} ${!hasTemplateAccess(t) ? 'locked' : ''}`} 
                        onClick={() => handleTemplateSelect(t)}
                        style={{
                          opacity: !hasTemplateAccess(t) ? 0.6 : 1,
                          cursor: !hasTemplateAccess(t) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <strong>{t.name}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {t.isFreeForm ? (
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'rgba(100, 180, 255, 0.2)',
                                borderRadius: '50%',
                                border: '1px solid rgba(100, 180, 255, 0.3)',
                                color: 'rgba(100, 180, 255, 0.8)',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease'
                              }}>
                                +
                              </div>
                            ) : (
                              <TemplateRating rating={t.rating || 4.5} />
                            )}
                            
                            {/* Premium Access Icon */}
                            {isTemplatePremium(t) && (
                              hasTemplateAccess(t) ? (
                                <IconCrown 
                                  size={16} 
                                  style={{ 
                                    color: '#ffd700',
                                    opacity: 0.8
                                  }} 
                                />
                              ) : (
                                <IconLock 
                                  size={16} 
                                  style={{ 
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    opacity: 0.6
                                  }} 
                                />
                              )
                            )}
                          </div>
                        </div>
                        <p>{t.description}</p>
                        {t.tech_stack && (
                          <div className="tech-stack">
                            Tech: {t.tech_stack.join(', ')}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <Text size="sm" c="dimmed" mb="md">
                    Click on any template to customize and build your project
                  </Text>
                  {selectedTemplate && (
                    <Button 
                      type="submit" 
                      color="brand" 
                      size="md"
                      disabled={!selectedTemplate}
                    >
                      Next: Review Requirements
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <form onSubmit={e => {
                e.preventDefault();
                // For NLP, treat user input as requirements
                setFinalRequirements([nlRequest.trim()]);
                setRequirementsStep(true);
              }} className="nl-form">
                <h2 style={{ marginTop: 10, marginBottom: 20 }}><span style={{ color: 'var(--mantine-color-brand-6)', fontWeight: 'bold', marginRight: 8 }}>1.</span> Describe Your Site</h2>
                <div className="form-group">
                  <textarea
                    id="nlRequest"
                    placeholder="Describe your site, features, plugins, tech stack, etc."
                    value={nlRequest}
                    onChange={e=>setNlRequest(e.target.value)}
                    rows={6}
                    required
                  />
                </div>
                
                <h2 style={{ marginTop: 25, marginBottom: 15 }}><span style={{ color: 'var(--mantine-color-brand-6)', fontWeight: 'bold', marginRight: 8 }}>2.</span> Project Name</h2>
                <div className="form-group">
                  <input
                    id="nlpProjectName"
                    type="text"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" disabled={!nlRequest.trim() || !projectName.trim()}>Next: Review Requirements</button>
              </form>
            )}
          </div>
        ) : requirementsStep ? (
          <div style={{ marginTop: 140 }}>
            <RequirementsEditor
              initialRequirements={finalRequirements}
              onConfirm={handleRequirementsConfirm}
            />
          </div>
        ) : (
          <div className="build-progress" style={{ marginTop: 140 }}>
            <AiManager 
              statusMessage={aiStatus} 
              issues={aiIssues} 
              codeQuality={aiCodeQuality} 
              complete={buildComplete} 
            />
            <BuildTimeline 
              currentStage={buildComplete ? 2 : (buildStatus.includes('Building') ? 1 : 0)} 
              complete={buildComplete} 
            />
            <h2 style={{ 
              color: buildStatus.includes('failed') ? '#F44336' : 
                     buildStatus.includes('complete') ? '#4CAF50' : 
                     'inherit',
              opacity: 0.8
            }}>
              Status: {buildStatus}
            </h2>
            {buildStatus === 'Build failed to start.' && (
              <div style={{color: 'red', marginBottom: 8}}>
                Error: Could not connect to backend or backend returned an error.
              </div>
            )}
            {buildStatus === 'Build failed.' && (
              <div style={{
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                color: '#F44336'
              }}>
                <strong>Build Failed</strong>
                <br />
                The build process encountered errors. Review the console logs below for specific details about what went wrong.
                You can try adjusting your requirements and rebuilding the project.
              </div>
            )}
            <BuildConsole src={consoleSrc} projectId={projectId} />
            {buildComplete && (
              <div className="download-deploy">
                {!buildStatus.includes('failed') ? (
                  <>
                    <a href={downloadUrl} download>Download Site Package</a>
                    <button disabled>Deploy (Coming Soon)</button>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    color: '#F44336'
              }}>
                    <strong>Build Failed - No Download Available</strong>
                    <br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Fix the errors in your requirements and try rebuilding the project.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </Container>
        <Box component="footer" py="md" ta="center">
                        <Text size="sm" c="dimmed">&copy; {new Date().getFullYear()} Squadbox AI Builder</Text>
        </Box>
      </AppShell.Main>

      {/* Template Detail Modal */}
      <Modal
        opened={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        size="lg"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconBuildingSkyscraper size={16} />
            <Text size="sm" fw={600}>{selectedTemplateForModal?.name}</Text>
          </div>
        }
        styles={{
          title: { color: 'rgba(255, 255, 255, 0.9)' },
          header: { backgroundColor: 'rgba(0, 0, 0, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
          body: { backgroundColor: 'rgba(0, 0, 0, 0.9)', padding: '24px' },
          content: { backgroundColor: 'rgba(0, 0, 0, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }
        }}
      >
        {selectedTemplateForModal && (
          <div>
            {/* Project Name */}
            <div style={{ marginBottom: '24px' }}>
              <Text size="lg" fw={600} mb="16px">
                Name Your Project
              </Text>
              
              <TextInput
                placeholder="Enter your project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              />
            </div>

            {/* Customization */}
            <div style={{ marginBottom: '24px' }}>
              <Text size="lg" fw={600} mb="16px">
                {selectedTemplateForModal.id === 'free-form' ? 'Describe Your Project' : 'Add Custom Requirements'}
              </Text>
              
              <Textarea
                placeholder={
                  selectedTemplateForModal.id === 'free-form' 
                    ? "Describe what you want to build in detail. Include features, design preferences, tech stack, etc..."
                    : "- Add custom requirements\n- One per line/bullet list works best"
                }
                value={customReq}
                onChange={(e) => setCustomReq(e.target.value)}
                minRows={selectedTemplateForModal.id === 'free-form' ? 6 : 5}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              />
            </div>

            {/* Template Preview */}
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <Text size="lg" fw={600} mb="xs">{selectedTemplateForModal.name}</Text>
                  <TemplateRating rating={selectedTemplateForModal.rating || 4.5} size={16} />
                </div>
                <Badge color="brand" variant="light">
                  {selectedTemplateForModal.tech_stack?.length || 0} technologies
                </Badge>
              </div>
              
              <Text size="sm" c="dimmed" mb="16px">
                {selectedTemplateForModal.description}
              </Text>
              
              {selectedTemplateForModal.tech_stack && (
                <div>
                  <Text size="sm" fw={500} mb="xs">Tech Stack:</Text>
                  <Group gap="xs">
                    {selectedTemplateForModal.tech_stack.map((tech, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ position: 'relative' }}>
              <Group justify="flex-end" gap="md">
                <Button 
                  variant="light" 
                  onClick={() => setTemplateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  color="brand"
                  onClick={handleModalCustomizeAndBuild}
                  disabled={!projectName.trim() || (selectedTemplateForModal.id === 'free-form' && !customReq.trim())}
                >
                  {selectedTemplateForModal.id === 'free-form' ? 'Build Project' : 'Customize & Build'}
                </Button>
              </Group>
              
              {/* Premium Veil for Locked Templates */}
              {selectedTemplateForModal && isTemplatePremium(selectedTemplateForModal) && !hasTemplateAccess(selectedTemplateForModal) && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  zIndex: 10
                }}>
                  <IconLock size={24} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Text size="sm" fw={500} ta="center" c="white">
                    Premium Template
                  </Text>
                  <Text size="xs" ta="center" c="dimmed" style={{ maxWidth: '200px' }}>
                    Upgrade your subscription to unlock this template
                  </Text>
                  <Button 
                    size="xs" 
                    color="brand" 
                    variant="light"
                    onClick={() => {
                      setTemplateModalOpen(false);
                      setView('subscriptions');
                    }}
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Build Protection Modal */}
      <Modal
        opened={buildProtectionModal}
        onClose={() => handleBuildProtectionAction('continue')}
        title="⚠️ Build in Progress"
        centered
        size="md"
      >
        <Stack gap="md">
          <Text>
            A build is currently in progress. Navigating away will terminate the build process.
          </Text>
          <Text size="sm" c="dimmed" style={{ opacity: 0.8 }}>
            Current status: <strong>{buildStatus}</strong>
          </Text>
          <Text size="sm" c="dimmed">
            What would you like to do?
          </Text>
          
          <Group justify="flex-end" gap="sm">
            <Button 
              variant="light" 
              onClick={() => handleBuildProtectionAction('continue')}
            >
              Cancel & Continue Building
            </Button>
            <Button 
              color="orange" 
              onClick={() => handleBuildProtectionAction('pause')}
            >
              Pause Build
            </Button>
            <Button 
              color="red" 
              onClick={() => handleBuildProtectionAction('terminate')}
            >
              Terminate & Navigate
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Footer */}
      <Footer setView={setView} />
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </AppShell>
    
    {/* Debug Panel - Only show in development */}
    {process.env.NODE_ENV === 'development' && (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <div>Animations: {animationManager.isAnimationsEnabled() ? 'ON' : 'OFF'}</div>
        <button 
          onClick={() => animationManager.toggleAnimations()}
          style={{
            backgroundColor: '#5474b4',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Toggle Animations
        </button>
      </div>
    )}
  );
}

export default App;
