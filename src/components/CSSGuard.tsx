'use client';

import { useEffect } from 'react';

export function CSSGuard() {
  useEffect(() => {
    // Monitor and block any CDN stylesheet injections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLLinkElement &&
            node.rel === 'stylesheet' &&
            node.href?.includes('cdn')
          ) {
            console.error('Blocked CDN stylesheet:', node.href);
            node.remove();
          }
        });
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    // Check existing stylesheets
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    existingLinks.forEach((link) => {
      if (link instanceof HTMLLinkElement && link.href?.includes('cdn')) {
        console.error('Removing existing CDN stylesheet:', link.href);
        link.remove();
      }
    });

    // Ensure at least basic styles are applied
    const checkStyles = () => {
      const testEl = document.createElement('div');
      testEl.className = 'hidden';
      document.body.appendChild(testEl);
      const styles = window.getComputedStyle(testEl);
      const isHidden = styles.display === 'none';
      document.body.removeChild(testEl);

      if (!isHidden) {
        console.error('Tailwind CSS not loaded properly - hidden class not working');
        
        // Force reload if styles aren't working
        if (window.location.hostname === 'localhost') {
          console.log('Attempting to reload styles...');
          // Add a timestamp to force reload
          const links = document.querySelectorAll('link[rel="stylesheet"]');
          links.forEach((link) => {
            if (link instanceof HTMLLinkElement && !link.href.includes('cdn')) {
              const url = new URL(link.href);
              url.searchParams.set('t', Date.now().toString());
              link.href = url.toString();
            }
          });
        }
      }
    };

    // Check styles after a short delay
    setTimeout(checkStyles, 1000);

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}