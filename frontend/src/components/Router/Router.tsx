import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
type Props = {
  path: string;
  children?: any;
};

export function Route({ path, children }: Props) {
  // state to track URL and force component to re-render on change
  const [currentPath, setCurrentPath] = useState(window.location.pathname);


  useEffect(() => {
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {

      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", onLocationChange);

    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

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
