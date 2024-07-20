import { IconProps } from "./IconProps";

export const DotIcon = ({ className }: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="#1fa84d"
    viewBox="0 0 512 512"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`h-auto ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
    />
  </svg>
);
