// components/ScrollToTop.js or within _app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ScrollToTop() { // If making a separate component
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup function to remove the event listener
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
}