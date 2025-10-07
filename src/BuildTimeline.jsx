import React, { useState, useEffect } from 'react';
import './BuildTimeline.css';

const STAGES = [
  'Requirements',
  'Development',
  'Packaging',
];

export default function BuildTimeline({ currentStage, complete }) {
  return (
    <div className="build-timeline">
      {STAGES.map((stage, idx) => {
        let status = '';
        if (complete || currentStage > idx) status = 'complete';
        else if (currentStage === idx) status = 'active';
        return (
          <div className={`timeline-stage ${status}`} key={stage}>
            <div className={`stage-light ${status}`}></div>
            <span className="stage-label">{stage}</span>
            {idx < STAGES.length - 1 && <div className="stage-connector" />}
          </div>
        );
      })}
    </div>
  );
}
