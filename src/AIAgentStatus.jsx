import React, { useState, useEffect } from 'react';
import './AIAgentStatus.css';

const AI_AGENTS = [
  {
    id: 'project_manager',
    name: 'Project Manager',
    icon: '📋',
    description: 'Orchestrates the entire project workflow',
    tasks: ['Planning', 'Coordination', 'Timeline Management']
  },
  {
    id: 'ui_ux_designer',
    name: 'UI/UX Designer',
    icon: '🎨',
    description: 'Creates beautiful and intuitive user interfaces',
    tasks: ['Wireframing', 'Visual Design', 'User Experience']
  },
  {
    id: 'frontend_developer',
    name: 'Frontend Developer',
    icon: '⚛️',
    description: 'Builds responsive and interactive frontend components',
    tasks: ['React Components', 'Styling', 'State Management']
  },
  {
    id: 'backend_developer',
    name: 'Backend Developer',
    icon: '🔧',
    description: 'Develops server-side logic and APIs',
    tasks: ['API Development', 'Database Design', 'Authentication']
  },
  {
    id: 'testing_engineer',
    name: 'Testing Engineer',
    icon: '🧪',
    description: 'Ensures code quality and functionality',
    tasks: ['Unit Tests', 'Integration Tests', 'Quality Assurance']
  },
  {
    id: 'deployment_specialist',
    name: 'Deployment Specialist',
    icon: '🚀',
    description: 'Handles deployment and infrastructure',
    tasks: ['Build Process', 'Deployment', 'Configuration']
  },
  {
    id: 'documentation_specialist',
    name: 'Documentation Specialist',
    icon: '📚',
    description: 'Creates comprehensive project documentation',
    tasks: ['README', 'API Docs', 'User Guides']
  }
];

export default function AIAgentStatus({ projectId, buildStatus }) {
  const [agentStatuses, setAgentStatuses] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (!projectId) return;

    const fetchAgentStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/agent-status/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setAgentStatuses(data.agents || {});
          setOverallProgress(data.overall_progress || 0);
        }
      } catch (error) {
        console.error('Error fetching agent status:', error);
      }
    };

    // Fetch initial status
    fetchAgentStatus();

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchAgentStatus, 2000);
    return () => clearInterval(interval);
  }, [projectId]);

  const getAgentStatus = (agentId) => {
    return agentStatuses[agentId] || {
      status: 'pending',
      progress: 0,
      current_task: '',
      completed_tasks: 0,
      total_tasks: 0
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#32d657';
      case 'active': return '#ffd700';
      case 'pending': return '#e0eafc';
      case 'error': return '#ff6b6b';
      default: return '#e0eafc';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '⚡';
      case 'pending': return '⏳';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="ai-agent-status">
      <div className="agent-status-header">
        <h3>🤖 AI Agent Team Status</h3>
        <div className="overall-progress">
          <div className="progress-label">Overall Progress</div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">{Math.round(overallProgress)}%</div>
        </div>
      </div>

      <div className="agents-grid">
        {AI_AGENTS.map((agent) => {
          const status = getAgentStatus(agent.id);
          const isActive = status.status === 'active';
          const isCompleted = status.status === 'completed';
          const hasError = status.status === 'error';

          return (
            <div 
              key={agent.id} 
              className={`agent-card ${status.status} ${isActive ? 'active' : ''}`}
            >
              <div className="agent-header">
                <div className="agent-icon">{agent.icon}</div>
                <div className="agent-info">
                  <h4 className="agent-name">{agent.name}</h4>
                  <p className="agent-description">{agent.description}</p>
                </div>
                <div className="agent-status-indicator">
                  <span className="status-icon">{getStatusIcon(status.status)}</span>
                </div>
              </div>

              <div className="agent-progress">
                <div className="progress-info">
                  <span className="progress-text">
                    {status.current_task || 'Waiting...'}
                  </span>
                  <span className="progress-stats">
                    {status.completed_tasks}/{status.total_tasks} tasks
                  </span>
                </div>
                <div className="agent-progress-bar">
                  <div 
                    className="agent-progress-fill"
                    style={{ 
                      width: `${status.progress}%`,
                      backgroundColor: getStatusColor(status.status)
                    }}
                  ></div>
                </div>
                <div className="progress-percentage-small">
                  {Math.round(status.progress)}%
                </div>
              </div>

              <div className="agent-tasks">
                <div className="tasks-header">Tasks:</div>
                <div className="tasks-list">
                  {agent.tasks.map((task, index) => {
                    const taskCompleted = index < status.completed_tasks;
                    const taskActive = index === status.completed_tasks && isActive;
                    
                    return (
                      <div 
                        key={index}
                        className={`task-item ${taskCompleted ? 'completed' : ''} ${taskActive ? 'active' : ''}`}
                      >
                        <span className="task-icon">
                          {taskCompleted ? '✅' : taskActive ? '⚡' : '⏳'}
                        </span>
                        <span className="task-name">{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {hasError && (
                <div className="agent-error">
                  <span className="error-icon">⚠️</span>
                  <span className="error-message">Agent encountered an error</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="agent-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Active Agents:</span>
            <span className="stat-value">
              {Object.values(agentStatuses).filter(a => a.status === 'active').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">
              {Object.values(agentStatuses).filter(a => a.status === 'completed').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Tasks:</span>
            <span className="stat-value">
              {Object.values(agentStatuses).reduce((sum, a) => sum + (a.total_tasks || 0), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
