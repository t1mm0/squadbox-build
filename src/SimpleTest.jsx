import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '2rem',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <h1>🚀 Squadbox - Tabs Working!</h1>
      <p>This is a simple test to verify React is working.</p>
      <div style={{ marginTop: '2rem' }}>
        <button style={{
          backgroundColor: '#5474b4',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginRight: '1rem'
        }}>
          Test Button
        </button>
        <button style={{
          backgroundColor: 'transparent',
          color: '#5474b4',
          border: '2px solid #5474b4',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Another Button
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;
