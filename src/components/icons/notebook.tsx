import type { SVGProps } from 'react';

export function NotebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Main notebook body */}
      <rect x="15" y="10" width="70" height="80" rx="5" fill="#8B4513" stroke="none" />
      
      {/* Spine */}
      <path d="M 15 10 L 15 90" stroke="#654321" strokeWidth="4" />
      
      {/* Subtle Texture */}
      <path d="M 20 20 C 30 15, 40 25, 50 20" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" fill="none" />
      <path d="M 60 30 C 70 25, 80 35, 85 30" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" fill="none" />
      <path d="M 25 70 C 35 65, 45 75, 55 70" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" fill="none" />
      <path d="M 20 50 C 50 40, 60 60, 80 50" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" fill="none" />

      {/* Strap */}
      <rect x="5" y="45" width="90" height="10" fill="#D2B48C" stroke="none" />
      <rect x="5" y="45" width="90" height="10" stroke="#A0522D" strokeWidth="1.5" />

      {/* Button on strap */}
      <circle cx="80" cy="50" r="3" fill="#A0522D" stroke="#654321" strokeWidth="1" />
    </svg>
  );
}
