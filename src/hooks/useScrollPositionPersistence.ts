import { useLayoutEffect } from "react";

export const useScrollPositionPersistence = () => {
  useLayoutEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    Object.keys(localStorage).forEach((key) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && key !== today) {
        localStorage.removeItem(key);
      }
    });

    const savedPosition = localStorage.getItem(today);
    if (savedPosition && parseInt(savedPosition, 10) > 200) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 300);
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        localStorage.setItem(today, window.scrollY.toString());
      }
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
