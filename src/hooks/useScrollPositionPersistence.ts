import { useLayoutEffect } from "react";

export const useScrollPositionPersistence = () => {
  useLayoutEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Clean up old entries (keep only today's)
    Object.keys(localStorage).forEach((key) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && key !== today) {
        localStorage.removeItem(key);
      }
    });

    // Check for saved position for today
    const savedPosition = localStorage.getItem(today);
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 300);
    }

    const handleScroll = () => {
      localStorage.setItem(today, window.scrollY.toString());
    };

    // Throttle scroll events for better performance
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);
};

// Basic throttle implementation
const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    fn(...args);
  };
};
