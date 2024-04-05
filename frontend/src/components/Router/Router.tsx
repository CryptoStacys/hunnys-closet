//src/components/Router/Router.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  path: string;
  children?: React.ReactNode; // It's better to use React.ReactNode for children type
};

export function Route({ path, children }: Props) {
  // Initialize currentPath state with a default value that works server-side
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Ensure this code runs only in the browser where window is defined
    if (typeof window !== 'undefined') {
      // Set initial path state based on the browser's window location
      setCurrentPath(window.location.pathname);

      // Define callback as a separate function so it can be removed later with cleanup function
      const onLocationChange = () => {
        setCurrentPath(window.location.pathname);
      };

      window.addEventListener("popstate", onLocationChange);

      // Clean up event listener to avoid memory leaks
      return () => {
        window.removeEventListener("popstate", onLocationChange);
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount.

  return (
    <AnimatePresence mode="wait">
      {currentPath === path && (
        <motion.div
          key={path}
          initial={{ opacity: 0, translateY: "-12px" }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, translateY: "12px" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
