// Tooltip.tsx

import React, { useState, ReactNode, useRef, useEffect } from 'react';

interface TooltipProps {
  children: ReactNode;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
  width?: number;
  height?: number;
  className: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, imageUrl, imageAlt, linkUrl, width = 200, height = 200 }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const adjustTooltipPosition = () => {
        const tooltipEl = tooltipRef.current;
        if (tooltipEl) {
          const rect = tooltipEl.getBoundingClientRect();
          if (window.innerWidth < rect.right + 8000) {
            tooltipEl.style.right = "1px";
            tooltipEl.style.left = "auto";
          } else {
            tooltipEl.style.left = `${rect.left}px`;
            tooltipEl.style.right = "auto";
          }
        }
      };
  
      if (showTooltip) {
        adjustTooltipPosition();
      }
    }, [showTooltip]);
  
    return (
      <div className="tooltip-container"
           onMouseEnter={() => setShowTooltip(true)}
           onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
        {showTooltip && (
          <div ref={tooltipRef} className="custom-tooltip " style={{ position: 'absolute', overflow: 'hidden' }}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
            <img src={imageUrl} alt={imageAlt} width={width} height={height} />
          </a>
          </div>
        )}
      </div>
    );
  };
  
  export default Tooltip;
