import { useState, useLayoutEffect, useRef } from 'react';

/**
 * Finds whether window is scrolled in the given direction (up/down)
 * @param up true(default) - scrolled up / false - scrolled down
 * @param init initial value. default: false
 * @param throttle scroll event throttle duration in ms. (default: 200ms)
 */
export function useScroll(
  up: boolean = true,
  init: boolean = false,
  throttle: number = 200
): boolean {
  const [scrolled, setScrolled] = useState(init);
  // store most recent y-offset
  const yRef = useRef<number | null>(window.pageYOffset);
  // store setTimeout id
  const idRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const updateScrolled = (newY: number) => {
      let newScrolled;
      // check if window is scrolled in the given direction
      if (up) {
        newScrolled = yRef.current ? newY < yRef.current : false;
      } else {
        newScrolled = yRef.current ? newY > yRef.current : false;
      }

      // set scrolled only if scrolled state changed
      // (don't set state if it already has the same value)
      if (!scrolled && newScrolled) {
        setScrolled(true);
      } else if (scrolled && !newScrolled) {
        setScrolled(false);
      }
      yRef.current = newY;
    };

    const handleScroll = () => {
      // don't handle if timeout is already scheduled.
      if (idRef.current) return;

      idRef.current = window.setTimeout(() => {
        const newY = window.pageYOffset;
        updateScrolled(newY);
        // console.log('rendered');
        idRef.current = null;
      }, throttle);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, up, throttle]);

  return scrolled;
}
