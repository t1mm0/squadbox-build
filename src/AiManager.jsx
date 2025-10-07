import React, { useState, useEffect } from 'react';
import './AiManager.css';

/**
 * AiManager displays build/validation status and issues.
 * All data must be provided by the parent or fetched from backend.
 * No simulation or fake agent logic.
 */

export default function AiManager({ stage, complete, statusMessage, issues = [], codeQuality, onValidate }) {
  return (
    <div className={`ai-manager${complete ? ' valid' : ''}`}>
      <div className="ai-avatar">🤖</div>
      <div className="ai-message">
        {statusMessage}
        {issues.length > 0 && (
          <ul style={{marginTop:8, marginBottom:0, color:'#d92b2b', fontSize:'0.98rem'}}>
            {issues.map(issue => <li key={issue}>{issue}</li>)}
          </ul>
        )}
        {typeof codeQuality === 'number' && (
          <div style={{marginTop:6, color: codeQuality >= 90 ? '#32d657' : '#d92b2b'}}>
            Code quality: {codeQuality}%
          </div>
        )}
      </div>
    </div>
  );
}
