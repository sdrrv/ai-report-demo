import type React from 'react';

// eslint-disable-next-line import-x/no-named-as-default-member
interface TennisBallProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  backgroundColor?: string;
  rotation?: number;
  strokeWidth?: number;
}

const TennisBall: React.FC<TennisBallProps> = ({
  size = 24,
  backgroundColor,
  rotation = 0,
  strokeWidth = 2,
  className,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      transform: `rotate(${rotation}deg)`,
      ...props.style,
    }}
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill={backgroundColor} />
    <path d="M2 12c5.5 0 10-4.5 10-10" />
    <path d="M22 12c-5.5 0-10 4.5-10 10" />
  </svg>
);

export { TennisBall };
