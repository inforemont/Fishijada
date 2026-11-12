import { useState, useEffect } from 'react';

const getBreakpoint = (width) => {
  switch (true) {
    case width < 576:
      return 'xs';
    case width < 768:
      return 'sm';
    case width < 992:
      return 'md';
    case width < 1200:
      return 'lg';
    case width < 1400:
      return 'xl';
    default:
      return 'xxl';
  }
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      const currentBreakpoint = getBreakpoint(window.innerWidth);
      
      setBreakpoint((prev) => {
        if (prev !== currentBreakpoint) {
          return currentBreakpoint;
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

export default useBreakpoint;