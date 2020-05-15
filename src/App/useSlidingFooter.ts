import { useState, useLayoutEffect, useRef } from 'react';

/**
 * Returns true if page is scrolled up
 */
export default function useSlidingFooter(): boolean {
  const [isFooterShowing, setIsFooterShowing] = useState(false);
  // | null to make current mutable (readonly by default)
  const prevYRef = useRef<number | null>(window.pageYOffset);
  const idRef = useRef<number | null>(null); // setTimeout id

  /**
   * Set timeout to show/hide footer and clear timeout id
   * @param show - If true, show footer after 200ms
   */
  function setFooterTimeout(show: boolean): void {
    // use window.setTimeout to use type provided by TS
    idRef.current = window.setTimeout(() => {
      setIsFooterShowing(show);
      idRef.current = null;
    }, 200);
  }

  useLayoutEffect(() => {
    const handleScroll = () => {
      // If timeout is still waiting, do nothing
      if (idRef.current !== null) return;

      // get the currentY (at the moment of scroll event firing)
      const currentY = window.pageYOffset;

      const isScrolledUp = prevYRef.current
        ? currentY < prevYRef.current
        : false;

      if (!isFooterShowing && isScrolledUp) {
        setFooterTimeout(true);
      } else if (isFooterShowing && !isScrolledUp) {
        setFooterTimeout(false);
      }
      // if footer is already showing, don't set timeout on scroll up
      // and don't hide footer if it's not showing when scrolled down.

      // reset prev position with the currentY for the next scroll event
      prevYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll);

    // clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFooterShowing]);

  return isFooterShowing;
}
