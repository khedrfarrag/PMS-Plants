import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // We are wrapping the scroll call in a setTimeout to ensure it runs after the new page has had time to render.
    // This is a common workaround for issues where animations or other async operations interfere with scroll restoration.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
