import React from 'react';

function SimpleApp() {
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
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #5474b4, #64b5f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🚀 Squadbox
        </h1>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1.5rem',
          color: '#ffffff',
          fontWeight: '600'
        }}>
          Build Apps with AI
        </h2>
        
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '2rem',
          color: '#cccccc',
          lineHeight: '1.6'
        }}>
          Our specialized AI bots work together to transform your ideas into production-ready applications. 
          Choose from templates or describe your vision in natural language.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          maxWidth: '500px'
        }}>
          {[
            { name: 'Builder', emoji: '🔨' },
            { name: 'Deployer', emoji: '🚀' },
            { name: 'Security', emoji: '🛡️' },
            { name: 'Designer', emoji: '🎨' },
            { name: 'Manager', emoji: '📋' },
            { name: 'Logic', emoji: '🧠' }
          ].map((bot, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: 'rgba(84, 116, 180, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(84, 116, 180, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {bot.emoji}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                {bot.name}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{
          backgroundColor: 'rgba(84, 116, 180, 0.1)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid rgba(84, 116, 180, 0.2)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>
            🎯 What You Can Build
          </h3>
          <ul style={{ 
            textAlign: 'left', 
            color: '#cccccc',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '1.5rem'
          }}>
            <li>Full-stack web applications</li>
            <li>E-commerce platforms</li>
            <li>Dashboard and analytics tools</li>
            <li>API services and microservices</li>
            <li>Mobile-responsive designs</li>
            <li>Database-driven applications</li>
          </ul>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            backgroundColor: '#5474b4',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#44639f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#5474b4'}
          >
            Get Started
          </button>
          
          <button style={{
            backgroundColor: 'transparent',
            color: '#5474b4',
            border: '1px solid #5474b4',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#5474b4';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#5474b4';
          }}
          >
            Learn More
          </button>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '6px',
          fontSize: '0.9rem',
          color: '#999999'
        }}>
          <p style={{ margin: 0 }}>
            <strong>Backend Status:</strong> Connected to{' '}
            <code style={{ 
              backgroundColor: 'rgba(84, 116, 180, 0.2)', 
              padding: '2px 6px', 
              borderRadius: '3px',
              color: '#64b5f6'
            }}>
              https://squadbox-backend-2.onrender.com
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
