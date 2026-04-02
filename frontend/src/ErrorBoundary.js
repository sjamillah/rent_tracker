import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Unknown frontend error',
    };
  }

  componentDidCatch(error, errorInfo) {
    // Keep details in console for debugging while showing a safe UI fallback.
    // eslint-disable-next-line no-console
    console.error('Frontend runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            background: '#f8fafc',
            fontFamily: 'sans-serif',
          }}
        >
          <section
            style={{
              width: '100%',
              maxWidth: '760px',
              background: '#fff',
              border: '1px solid #fecaca',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
            }}
          >
            <h1 style={{ marginTop: 0, color: '#991b1b' }}>Frontend error detected</h1>
            <p style={{ color: '#334155', marginBottom: '10px' }}>
              The app crashed while rendering. This is why you were seeing a blank screen.
            </p>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                margin: 0,
                padding: '12px',
                borderRadius: '8px',
                background: '#fef2f2',
                color: '#7f1d1d',
                border: '1px solid #fecaca',
              }}
            >
              {this.state.message}
            </pre>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;