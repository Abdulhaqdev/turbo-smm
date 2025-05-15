import React from "react"

const TiktokIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(({ className, ...props }, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width="24"
    height="24"
    ref={ref}
    {...props}
  >
    <path d="M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path d="M9 3H7v9a3 3 0 0 0 6 0V3h-2" />
    <path d="M17 3h-2v9a3 3 0 0 0 6 0V3h-2" />
    <path d="M12 12v9" />
  </svg>
))
TiktokIcon.displayName = "TiktokIcon"

export default TiktokIcon

