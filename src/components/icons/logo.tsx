import type { SVGProps } from 'react';

export function ClueCodedLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.5 9.5a1.5 1.5 0 0 1-3 0V8c0-1.1.9-2 2-2h1.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1.5" />
      <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
      <path d="M12 12v4" />
      <path d="M10 16h4" />
    </svg>
  );
}
