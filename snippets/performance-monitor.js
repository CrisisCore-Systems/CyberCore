/**
 * PERFORMANCE-MONITOR.JS
 * Monitors and reports on theme performance metrics
 * @Version: 1.0.0
 * @Optimized: April 2025
 */

// Initialize performance monitoring namespace
window.VoidBloomPerformance = {
  metrics: {},
  marks: {},
  measures: {},
  initialized: false,
  debug: false,

  // Initialize performance monitoring
  init: function (options = {}) {
    if (this.initialized) return;

    this.debug = options.debug || false;
    this.initObservers();
    this.captureNavigationTiming();
    this.monitorLCP();
    this.monitorFID();
    this.monitorCLS();
    this.monitorLongTasks();

    // Set mark for script initialization
    this.mark('vb-performance-init');

    if (this.debug) {
      console.log('VoidBloom Performance Monitoring initialized');
    }

    this.initialized = true;
  },

  // Create performance mark
  mark: function (name) {
    if (!window.performance || !window.performance.mark) return;

    const markName = `vb:${name}`;
    window.performance.mark(markName);
    this.marks[name] = performance.now();

    if (this.debug) {
      console.log(`Mark: ${name}`, performance.now());
    }
  },

  // Measure between marks
  measure: function (name, startMark, endMark) {
    if (!window.performance || !window.performance.measure) return;

    try {
      if (startMark && endMark) {
        window.performance.measure(`vb:${name}`, `vb:${startMark}`, `vb:${endMark}`);
      } else if (startMark) {
        window.performance.measure(`vb:${name}`, `vb:${startMark}`);
      } else {
        window.performance.measure(`vb:${name}`);
      }

      const measurements = window.performance.getEntriesByName(`vb:${name}`, 'measure');
      if (measurements.length > 0) {
        const duration = measurements[0].duration;
        this.measures[name] = duration;

        if (this.debug) {
          console.log(`Measure: ${name}`, duration.toFixed(2), 'ms');
        }

        return duration;
      }
    } catch (e) {
      console.error('Error measuring performance:', e);
    }

    return 0;
  },

  // Initialize performance observers
  initObservers: function () {
    // Verify browser support for PerformanceObserver
    if (!window.PerformanceObserver) return;

    // Observe resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const resources = list.getEntries().filter((entry) => {
          // Filter for theme-related resources
          return entry.name.includes(window.location.host) && !entry.name.includes('shopify.com');
        });

        resources.forEach((resource) => {
          // Only log slow resources (over 100ms) in debug mode
          if (this.debug && resource.duration > 100) {
            console.log(`Slow resource: ${resource.name}`, resource.duration.toFixed(2), 'ms');
          }

          // Track resource by type
          const type = resource.initiatorType || 'unknown';
          if (!this.metrics[`resources_${type}`]) {
            this.metrics[`resources_${type}`] = [];
          }
          this.metrics[`resources_${type}`].push({
            name: resource.name,
            duration: resource.duration,
            size: resource.encodedBodySize || 0,
            startTime: resource.startTime,
          });
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.error('Error observing resources:', e);
    }
  },

  // Capture navigation timing metrics
  captureNavigationTiming: function () {
    if (!window.performance || !window.performance.timing) return;

    // Use setTimeout to ensure values are populated
    setTimeout(() => {
      const timing = performance.timing;

      this.metrics.navigationTiming = {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseStart - timing.requestStart,
        domComplete: timing.domComplete - timing.domLoading,
        pageLoad: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      };

      if (this.debug) {
        console.table(this.metrics.navigationTiming);
      }
    }, 0);
  },

  // Monitor Largest Contentful Paint (LCP)
  monitorLCP: function () {
    if (!window.PerformanceObserver) return;

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;

        if (this.debug) {
          console.log('LCP:', this.metrics.lcp.toFixed(2), 'ms');
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.error('Error observing LCP:', e);
    }
  },

  // Monitor First Input Delay (FID)
  monitorFID: function () {
    if (!window.PerformanceObserver) return;

    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0];
        this.metrics.fid = firstInput.processingStart - firstInput.startTime;

        if (this.debug) {
          console.log('FID:', this.metrics.fid.toFixed(2), 'ms');
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.error('Error observing FID:', e);
    }
  },

  // Monitor Cumulative Layout Shift (CLS)
  monitorCLS: function () {
    if (!window.PerformanceObserver) return;

    try {
      let clsValue = 0;
      let clsEntries = [];

      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });

        this.metrics.cls = clsValue;

        if (this.debug) {
          console.log('CLS:', this.metrics.cls.toFixed(4));
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.error('Error observing CLS:', e);
    }
  },

  // Monitor long tasks (potential jank)
  monitorLongTasks: function () {
    if (!window.PerformanceObserver) return;

    try {
      this.metrics.longTasks = [];

      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          this.metrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
          });

          if (this.debug && entry.duration > 100) {
            console.warn('Long task detected:', entry.duration.toFixed(2), 'ms');
          }
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error('Error observing long tasks:', e);
    }
  },

  // Get performance report
  getReport: function () {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics: this.metrics,
      measures: this.measures,
    };

    // Add Core Web Vitals assessment
    report.coreWebVitals = {
      lcp: {
        value: this.metrics.lcp,
        status:
          this.metrics.lcp < 2500 ? 'good' : this.metrics.lcp < 4000 ? 'needs-improvement' : 'poor',
      },
      fid: {
        value: this.metrics.fid,
        status:
          this.metrics.fid < 100 ? 'good' : this.metrics.fid < 300 ? 'needs-improvement' : 'poor',
      },
      cls: {
        value: this.metrics.cls,
        status:
          this.metrics.cls < 0.1 ? 'good' : this.metrics.cls < 0.25 ? 'needs-improvement' : 'poor',
      },
    };

    // Add performance assessment
    let performanceScore = 0;

    if (report.coreWebVitals.lcp.status === 'good') performanceScore += 33;
    else if (report.coreWebVitals.lcp.status === 'needs-improvement') performanceScore += 20;

    if (report.coreWebVitals.fid.status === 'good') performanceScore += 33;
    else if (report.coreWebVitals.fid.status === 'needs-improvement') performanceScore += 20;

    if (report.coreWebVitals.cls.status === 'good') performanceScore += 34;
    else if (report.coreWebVitals.cls.status === 'needs-improvement') performanceScore += 20;

    report.performanceScore = Math.round(performanceScore);

    if (this.debug) {
      console.log('Performance Report:', report);
    }

    return report;
  },

  // Send report to analytics
  sendReport: function () {
    const report = this.getReport();

    // If Shopify analytics is available
    if (window.ShopifyAnalytics && window.ShopifyAnalytics.lib) {
      try {
        window.ShopifyAnalytics.lib.track('Performance', {
          performance: report,
        });
      } catch (e) {
        console.error('Error sending performance report:', e);
      }
    }

    return report;
  },
};

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function () {
  // Defer initialization to avoid impacting critical rendering
  setTimeout(function () {
    window.VoidBloomPerformance.init({
      debug: false,
    });
  }, 0);
});
