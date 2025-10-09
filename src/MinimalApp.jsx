import React from 'react';

const MinimalApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      backgroundColor: 'black',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚀 Squadbox - React is working!</h1>
      <p>If you can see this, the React app is mounting correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default MinimalApp;
