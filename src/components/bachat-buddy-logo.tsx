import type { SVGProps } from 'react';

export function BachatBuddyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Bachat Buddy Logo</title>
      <path d="M12 2L12 22" className="stroke-primary" />
      <path d="M12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14" className="stroke-accent" />
      <path d="M12 14C15.3137 14 18 16.6863 18 20C18 21.1046 17.5523 22 17 22" className="stroke-accent" />
      <path d="M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14" className="stroke-primary" />
       <path d="M12 14C8.68629 14 6 16.6863 6 20C6 21.1046 6.44772 22 7 22" className="stroke-primary" />
    </svg>
  );
}
