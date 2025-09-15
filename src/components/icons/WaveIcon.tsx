// src/components/icons/WaveIcon.tsx
import React from "react";

const WaveIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12c4-4 8 4 12 0s8 4 12 0"
    />
  </svg>
);

export default WaveIcon;
