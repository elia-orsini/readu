import { useCallback, useEffect, useState } from "react";

import useEventListener from "./useEventListener";

const isBrowser = typeof document !== "undefined";

export default function useWindowWidth(): number | null {
  const [windowWidth, setWindowWidth] = useState(0);

  const getWindowWidth = useCallback(() => setWindowWidth(window.innerWidth), []);

  useEffect(() => {
    getWindowWidth();
  }, [getWindowWidth]);

  useEventListener(isBrowser ? window : null, "resize", getWindowWidth);

  return windowWidth;
}
