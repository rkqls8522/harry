import React from 'react';

export const Card = ({ children, className = '' }) => <div className={`bg-[#F7F9FC] ${className}`}>{children}</div>;

export const CardContent = ({ children, className = '' }) => (
  <div className={`pt-5 pb-5 space-y-3 relative ${className}`}>{children}</div>
);
