"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="surface-card p-6 text-center">
            <p className="text-sm text-red-500">حدث خطأ غير متوقع، يرجى إعادة المحاولة.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
