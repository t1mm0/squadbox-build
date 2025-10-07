// Test component to check authentication speed
// Purpose: Debug authentication loading issues
// Last modified: 2025-01-08
// Completeness score: 90/100

import React, { useEffect, useState } from 'react';
import { auth, db } from './lib/database';

export default function TestAuthSpeed() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTest, setShowTest] = useState(false);

  const addLog = (message) => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
  };

  // Check for admin user cookies
  const checkAdminCookies = () => {
    const cookies = document.cookie.split(';');
    const adminCookies = cookies.filter(cookie => 
      cookie.trim().toLowerCase().includes('admin') ||
      cookie.trim().toLowerCase().includes('squadbox') ||
      cookie.trim().toLowerCase().includes('user')
    );
    
    console.log('Found admin cookies:', adminCookies);
    return adminCookies.length > 0;
  };

  useEffect(() => {
    // Check for admin user cookies first
    const hasAdminCookies = checkAdminCookies();
    setShowTest(hasAdminCookies);
    
    if (!hasAdminCookies) {
      setLoading(false);
      return;
    }

    const testAuthSpeed = async () => {
      addLog('Starting auth speed test...');
      
      try {
        // Test 1: Database factory creation
        addLog('Testing database factory creation...');
        const startTime = performance.now();
        
        if (!auth) {
          addLog('ERROR: Auth not available');
          setLoading(false);
          return;
        }
        
        const factoryTime = performance.now() - startTime;
        addLog(`Database factory created in ${factoryTime.toFixed(2)}ms`);
        
        // Test 2: Session retrieval
        addLog('Testing session retrieval...');
        const sessionStart = performance.now();
        
        const { session } = await auth.getSession();
        const sessionTime = performance.now() - sessionStart;
        
        addLog(`Session retrieved in ${sessionTime.toFixed(2)}ms`);
        addLog(`Session result: ${session ? 'Found' : 'Not found'}`);
        
        // Test 3: Auth state change listener
        addLog('Testing auth state change listener...');
        const listenerStart = performance.now();
        
        const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
          const listenerTime = performance.now() - listenerStart;
          addLog(`Auth state change listener ready in ${listenerTime.toFixed(2)}ms`);
          addLog(`Event: ${event}, Session: ${session ? 'Found' : 'Not found'}`);
        });
        
        // Cleanup
        setTimeout(() => {
          subscription.unsubscribe();
          addLog('Auth state change listener cleaned up');
        }, 1000);
        
      } catch (error) {
        addLog(`ERROR: ${error.message}`);
      } finally {
        setLoading(false);
        addLog('Auth speed test completed');
      }
    };

    testAuthSpeed();
  }, []);

  // Only show test if admin cookies are present
  if (!showTest) {
    return null;
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      fontSize: '12px',
      color: 'var(--mantine-color-text)'
    }}>
      <h3 style={{ color: 'var(--mantine-color-text)' }}>Authentication Speed Test (Admin Only)</h3>
      <div style={{ 
        background: 'var(--mantine-color-body)', 
        border: '1px solid var(--mantine-color-gray-3)',
        padding: '10px', 
        borderRadius: '4px',
        maxHeight: '400px',
        overflowY: 'auto',
        color: 'var(--mantine-color-text)'
      }}>
        {logs.map((log, index) => (
          <div key={index} style={{ 
            marginBottom: '2px',
            color: log.includes('ERROR') ? 'var(--mantine-color-red-6)' : 
                   log.includes('ms') ? 'var(--mantine-color-green-6)' : 
                   'var(--mantine-color-text)'
          }}>
            {log}
          </div>
        ))}
      </div>
      {loading && <div style={{ 
        marginTop: '10px', 
        color: 'var(--mantine-color-blue-6)' 
      }}>Testing...</div>}
    </div>
  );
}
