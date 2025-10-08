import React, { useState, useEffect } from 'react';
import SimpleApp from './SimpleApp';

function ProgressiveApp() {
  const [showFullApp, setShowFullApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Show simple app first
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const loadFullApp = async () => {
    try {
      setLoading(true);
      // Dynamically import the full app
      const { default: App } = await import('./App');
      setShowFullApp(true);
    } catch (err) {
      console.error('Failed to load full app:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            🚀
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #5474b4, #64b5f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Squadbox
          </h1>
          <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
            Loading your AI development environment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>
            ⚠️ Loading Error
          </h1>
          <p style={{ marginBottom: '2rem', color: '#cccccc' }}>
            There was an issue loading the full application. You can continue with the basic version.
          </p>
          <button
            onClick={() => setError(null)}
            style={{
              backgroundColor: '#5474b4',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => setShowFullApp(false)}
            style={{
              backgroundColor: 'transparent',
              color: '#5474b4',
              border: '1px solid #5474b4',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Use Basic Version
          </button>
        </div>
      </div>
    );
  }

  if (showFullApp) {
    // Dynamically import and render the full app
    const FullApp = React.lazy(() => import('./App'));
    return (
      <React.Suspense fallback={
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>Loading full application...</div>
        </div>
      }>
        <FullApp />
      </React.Suspense>
    );
  }

  return (
    <div>
      <SimpleApp />
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={loadFullApp}
          style={{
            backgroundColor: '#5474b4',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(84, 116, 180, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#44639f';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#5474b4';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🚀 Load Full App
        </button>
      </div>
    </div>
  );
}

export default ProgressiveApp;
