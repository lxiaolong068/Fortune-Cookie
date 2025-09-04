// Global type definitions

declare global {
  // Google Analytics gtag function
  function gtag(
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: {
      [key: string]: unknown;
      event_category?: string;
      event_label?: string;
      value?: number;
      non_interaction?: boolean;
    }
  ): void;

  // Window interface extensions
  interface Window {
    gtag?: typeof gtag;
  }
}

export {};
