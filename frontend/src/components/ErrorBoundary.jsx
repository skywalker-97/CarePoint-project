import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a real app, we would log this to a service like Sentry
    console.error("CarePoint System Crash:", error, errorInfo);
  }

  handleReset = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
          <div className="max-w-md w-full bg-white rounded-[48px] shadow-premium p-12 text-center space-y-8 border border-slate-100">
            <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center mx-auto">
              <AlertTriangle size={48} className="text-rose-500" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Pulse Check</h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                We've encountered an unexpected issue in the clinical interface. Our systems have safely isolated the error.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={this.handleReset}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
              >
                <RefreshCw size={18} /> Restart Interface
              </button>
              <button 
                onClick={this.handleGoHome}
                className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
              >
                <Home size={18} /> Return to Home
              </button>
            </div>

            <div className="pt-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Error Reference: {this.state.error?.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
