import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SetaProps {
  className?: string;
  width?: number;
  height?: number;
}

const Seta: React.FC<SetaProps> = ({ className = '', width = 34, height = 36 }) => {
  const { darkMode } = useTheme();

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 34 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M15 35.4488C15.5523 36.0011 16.4477 36.0011 17 35.4488L26 26.4488C26.5523 25.8965 26.5523 25.0011 26 24.4488C25.4477 23.8965 24.5523 23.8965 24 24.4488L16 32.4488L8 24.4488C7.44772 23.8965 6.55229 23.8965 6 24.4488C5.44772 25.0011 5.44772 25.8965 6 26.4488L15 35.4488ZM16 0.448822L14.5858 0.448822L14.5858 34.4488H16H17.4142L17.4142 0.448822L16 0.448822Z" 
        fill={darkMode ? "#F7F9FB" : "#1E293B"}
      />
    </svg>
  );
};

export default Seta;
