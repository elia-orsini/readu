import { useCallback, useEffect, useState } from "react";

import useEventListener from "./useEventListener";

const isBrowser = typeof document !== "undefined";

export default function useWindowScroll(): number | null {
  const [windowWidth, setWindowWidth] = useState(0);

  const getWindowWidth = useCallback(() => setWindowWidth(window.pageYOffset), []);

  useEffect(() => {
    getWindowWidth();
  }, [getWindowWidth]);

  useEventListener(isBrowser ? window : null, "scroll", getWindowWidth);

  return windowWidth;
}
