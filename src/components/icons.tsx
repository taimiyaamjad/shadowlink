import type { SVGProps } from 'react';

export function ShadowLinkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.529 2.048a.5.5 0 0 1 .732.411v5.082a.5.5 0 0 0 .5.5h5.082a.5.5 0 0 1 .411.732l-7.058 11.166a.5.5 0 0 1-.732-.411v-5.082a.5.5 0 0 0-.5-.5H2.882a.5.5 0 0 1-.411-.732L9.529 2.048z" />
      <path d="M14.471 21.952a.5.5 0 0 1-.732-.411v-5.082a.5.5 0 0 0-.5-.5H8.157a.5.5 0 0 1-.411-.732l7.058-11.166a.5.5 0 0 1 .732.411v5.082a.5.5 0 0 0 .5.5h5.082a.5.5 0 0 1 .411.732L14.471 21.952z" opacity="0.5" />
    </svg>
  );
}
