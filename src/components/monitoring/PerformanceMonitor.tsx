'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onFID, onLCP, onTTFB, Metric } from 'web-vitals';
import { getMonitoring } from '@/lib/monitoring/comprehensive-monitoring';

interface PerformanceThresholds {
  CLS: { good: number; needs_improvement: number };
  FCP: { good: number; needs_improvement: number };
  FID: { good: number; needs_improvement: number };
  LCP: { good: number; needs_improvement: number };
  TTFB: { good: number; needs_improvement: number };
}

const THRESHOLDS: PerformanceThresholds = {
  CLS: { good: 0.1, needs_improvement: 0.25 },
  FCP: { good: 1800, needs_improvement: 3000 },
  FID: { good: 100, needs_improvement: 300 },
  LCP: { good: 2500, needs_improvement: 4000 },
  TTFB: { good: 800, needs_improvement: 1800 },
};

export function PerformanceMonitor() {
  useEffect(() => {
    const monitoring = getMonitoring();

    const reportWebVital = (metric: Metric) => {
      const threshold = THRESHOLDS[metric.name as keyof PerformanceThresholds];
      let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

      if (threshold) {
        if (metric.value <= threshold.good) {
          rating = 'good';
        } else if (metric.value <= threshold.needs_improvement) {
          rating = 'needs-improvement';
        } else {
          rating = 'poor';
        }
      }

      // Track the metric
      monitoring.trackEvent('web_vital', {
        metric_name: metric.name,
        value: metric.value,
        rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        connection_type: (navigator as any).connection?.effectiveType,
      });

      // Alert on poor performance
      if (rating === 'poor') {
        monitoring.sendAlert(
          'warning',
          `Poor ${metric.name} performance detected`,
          {
            metric: metric.name,
            value: metric.value,
            threshold: threshold.needs_improvement,
            url: window.location.href,
          }
        );
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vital] ${metric.name}:`, {
          value: metric.value,
          rating,
          delta: metric.delta,
        });
      }
    };

    // Register web vitals callbacks
    onCLS(reportWebVital);
    onFCP(reportWebVital);
    onFID(reportWebVital);
    onLCP(reportWebVital);
    onTTFB(reportWebVital);

    // Monitor JavaScript errors
    const errorHandler = (event: ErrorEvent) => {
      monitoring.captureError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript_error',
      });
    };

    // Monitor unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      monitoring.captureError(
        event.reason || 'Unhandled Promise Rejection',
        {
          type: 'unhandled_rejection',
          promise: event.promise,
        }
      );
    };

    // Monitor resource loading errors
    const resourceErrorHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName) {
        monitoring.trackEvent('resource_error', {
          type: target.tagName.toLowerCase(),
          src: (target as any).src || (target as any).href,
          message: 'Resource failed to load',
        });
      }
    };

    // Add event listeners
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    window.addEventListener('error', resourceErrorHandler, true);

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              monitoring.trackEvent('long_task', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });

        return () => {
          observer.disconnect();
          window.removeEventListener('error', errorHandler);
          window.removeEventListener('unhandledrejection', rejectionHandler);
          window.removeEventListener('error', resourceErrorHandler, true);
        };
      } catch (e) {
        // Some browsers don't support longtask
        console.warn('Long task monitoring not supported');
      }
    }

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
      window.removeEventListener('error', resourceErrorHandler, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Export a hook for manual performance tracking
export function usePerformanceTracking() {
  const monitoring = getMonitoring();

  return {
    trackTiming: (category: string, variable: string, value: number) => {
      monitoring.trackEvent('timing', {
        category,
        variable,
        value,
        label: `${category}_${variable}`,
      });
    },
    
    trackInteraction: (action: string, label?: string, value?: number) => {
      monitoring.trackEvent('interaction', {
        action,
        label,
        value,
      });
    },

    measureComponent: (componentName: string) => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        monitoring.trackEvent('component_render', {
          component: componentName,
          duration,
          timestamp: new Date().toISOString(),
        });
      };
    },
  };
}