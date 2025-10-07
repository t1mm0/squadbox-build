// BuildConsole.jsx
// Purpose: Display build logs and status for a project
// Last modified: 2024-11-03
// By: AI Assistant
// Completeness: 100

import React, { useState, useEffect } from 'react';
import './BuildConsole.css';
import AIAgentStatus from './AIAgentStatus';

export default function BuildConsole({ src, projectId }) {
  const [logs, setLogs] = useState('Loading build logs...');
  const [status, setStatus] = useState({
    status: 'initializing',
    progress: 0,
    file_count: 0
  });
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Fetch logs with verbose feedback
  useEffect(() => {
    if (!src) return;
    
    const fetchLogs = async () => {
      try {
        const res = await fetch(src);
        if (res.ok) {
          const text = await res.text();
          // Add timestamp and verbose formatting
          const timestamp = new Date().toLocaleTimeString();
          const verboseLogs = `[${timestamp}] Fetching build logs...\n${text}\n[${timestamp}] Logs updated - ${text.split('\n').length} lines\n`;
          setLogs(verboseLogs);
        } else {
          const timestamp = new Date().toLocaleTimeString();
          setLogs(prev => prev + `[${timestamp}] ERROR: Failed to fetch logs (${res.status})\n`);
        }
      } catch (error) {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => prev + `[${timestamp}] ERROR: ${error.message}\n`);
        console.error("Error fetching logs:", error);
      }
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 1500); // More frequent updates
    
    return () => clearInterval(interval);
  }, [src]);
  
  // Fetch build status with verbose feedback
  useEffect(() => {
    if (!projectId) return;
    
    const fetchStatus = async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_URL || 'https://api.squadbox.co.uk').replace(/\/$/, '');
        const res = await fetch(`${apiBase}/build-status/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
          // Add verbose status update to logs
          const timestamp = new Date().toLocaleTimeString();
          setLogs(prev => prev + `[${timestamp}] STATUS UPDATE: ${data.status} (${data.progress}%) - ${data.file_count} files\n`);
        } else {
          const timestamp = new Date().toLocaleTimeString();
          setLogs(prev => prev + `[${timestamp}] ERROR: Failed to fetch status (${res.status})\n`);
        }
      } catch (error) {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => prev + `[${timestamp}] ERROR: Status fetch failed - ${error.message}\n`);
        console.error("Error fetching status:", error);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 1500); // More frequent updates
    
    return () => clearInterval(interval);
  }, [projectId]);
  
  // Auto-scroll to bottom effect
  useEffect(() => {
    if (!autoScroll) return;
    
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
      consoleContent.scrollTop = consoleContent.scrollHeight;
    }
  }, [logs, autoScroll]);
  
  // Get status indicator color
  const getStatusColor = () => {
    switch(status.status) {
      case 'complete': return '#4CAF50'; // Green
      case 'failed': return '#F44336'; // Red
      case 'generating': return '#2196F3'; // Blue
      default: return '#FF9800'; // Orange for initializing/unknown
    }
  };
  
  return (
    <div className="build-console-wrapper">
      {/* External Progress Bar */}
      <div className="external-progress-section">
        <div className="progress-info">
          <span className="progress-label">Build Progress</span>
          <span className="progress-percentage">{status.progress}%</span>
        </div>
        <div className="external-progress-bar">
          <div 
            className="external-progress-fill" 
            style={{ 
              width: `${status.progress}%`, 
              backgroundColor: getStatusColor() 
            }}
          ></div>
        </div>
        <div className="progress-details">
          <span className="status-text">Status: {status.status}</span>
          <span className="files-text">Files: {status.file_count}</span>
          <span className="duration-text">
            {status.duration ? `Duration: ${Math.round(status.duration)}s` : 'In Progress...'}
          </span>
        </div>
      </div>

      {/* AI Agent Status Component */}
      {projectId && (
        <AIAgentStatus 
          projectId={projectId} 
          buildStatus={status}
        />
      )}

      {/* Build Console */}
      <div className="build-console">
        <div className="console-header">
          <span>Build Console - Verbose Output</span>
          <div className="console-controls">
            <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
              <span>{status.status}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${status.progress}%`, backgroundColor: getStatusColor() }}
              ></div>
            </div>
            <span className="file-count">{status.file_count} files</span>
            <label className="auto-scroll">
              <input 
                type="checkbox" 
                checked={autoScroll} 
                onChange={() => setAutoScroll(!autoScroll)} 
              />
              Auto-scroll
            </label>
          </div>
        </div>
        <div id="console-content" className="console-content">
          <pre>{logs}</pre>
        </div>
      </div>
    </div>
  );
}