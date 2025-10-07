import React, { useState, useEffect } from 'react';
import './RequirementsEditor.css';

export default function RequirementsEditor({ initialRequirements, onConfirm }) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [newReq, setNewReq] = useState('');

  const removeReq = idx => {
    setRequirements(reqs => reqs.filter((_, i) => i !== idx));
  };

  const addReq = () => {
    if (newReq.trim() && !requirements.includes(newReq.trim())) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq('');
    }
  };

  return (
    <div className="requirements-editor">
      <h3>Review & Edit Requirements</h3>
      <ul className="req-list">
        {requirements.map((req, i) => (
          <li key={i}>
            {req}
            <button type="button" onClick={() => removeReq(i)} title="Remove">✕</button>
          </li>
        ))}
      </ul>
      <div className="req-add">
        <input
          type="text"
          placeholder="Add requirement (e.g. requirements.txt, code quality ≥ 90%)"
          value={newReq}
          onChange={e => setNewReq(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addReq(); }}
        />
        <button type="button" onClick={addReq}>Add</button>
      </div>
      <button className="confirm-btn" onClick={() => onConfirm(requirements)}>
        Confirm & Build
      </button>
    </div>
  );
}
