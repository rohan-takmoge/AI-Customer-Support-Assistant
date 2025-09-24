
import React from 'react';

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.993.134" />
    <path d="M12 5a3 3 0 1 0 5.993.134" />
    <path d="M12 5a3 3 0 1 1-5.993-.134" />
    <path d="M12 5a3 3 0 1 1 5.993-.134" />
    <path d="M12 19a3 3 0 1 0-5.993-.134" />
    <path d="M12 19a3 3 0 1 0 5.993-.134" />
    <path d="M12 19a3 3 0 1 1-5.993.134" />
    <path d="M12 19a3 3 0 1 1 5.993.134" />
    <path d="M5 12a3 3 0 1 0-.134 5.993" />
    <path d="M5 12a3 3 0 1 0 .134 5.993" />
    <path d="M5 12a3 3 0 1 1 .134-5.993" />
    <path d="M5 12a3 3 0 1 1-.134-5.993" />
    <path d="M19 12a3 3 0 1 0 .134 5.993" />
    <path d="M19 12a3 3 0 1 0-.134 5.993" />
    <path d="M19 12a3 3 0 1 1-.134-5.993" />
    <path d="M19 12a3 3 0 1 1 .134-5.993" />
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const WandSparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m5 9 1.5 1.5M2 13l1.5 1.5M9 5l1.5 1.5M13 2l1.5 1.5M19 9l-1.5 1.5M22 13l-1.5 1.5M15 19l-1.5-1.5M9 22l-1.5-1.5"/>
    <path d="m15 5 3 3"/>
    <path d="M22 9 9 22"/>
  </svg>
);
