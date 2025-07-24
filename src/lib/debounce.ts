'use client';

let timer: ReturnType<typeof setTimeout> | null = null;

export function debounceApiCall<T>(
  fn: (...args: any[]) => Promise<T> | void,
  delay: number = 500
): (...args: any[]) => void {
  return (...args: any[]): void => {
    const [event] = args;

    // Persist the synthetic event
    if (event && typeof event === 'object' && 'persist' in event && typeof event.persist === 'function') {
      event.persist();
    }

    // Prevent default immediately
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    // Debounce the API function
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

