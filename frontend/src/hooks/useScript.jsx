import { useEffect, useState } from 'react';

function useScript(src) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    // Cleanup the script on unmount if needed
    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return loaded;
}

export default useScript;
