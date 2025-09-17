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
      d="M2 12c3.5-3.5 7 3.5 10.5 0S20 15.5 22 12"
    />
  </svg>
);

export default WaveIcon;


