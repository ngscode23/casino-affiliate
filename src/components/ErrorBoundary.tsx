// src/components/ErrorBoundary.tsx
import React from "react";
import { Link } from "react-router-dom";

type State = {
  hasError: boolean;
  error: unknown | null; // ← явный null вместо optional + unknown
};

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("Uncaught app error:", error, errorInfo);
  }

  private reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      // безопасно готовим текст ошибки для JSX
      const err = this.state.error;
      const errText =
        err instanceof Error ? err.stack ?? err.message : err != null ? String(err) : "";

      return (
        <div className="neon-container py-12">
          <div className="neon-card p-6 space-y-4">
            <h1 className="text-xl font-bold">Что-то пошло не так</h1>
            <p className="text-[var(--text-dim)]">
              Попробуйте обновить страницу или вернуться на главную.
            </p>

            <div className="btn-row">
              <button className="neon-btn" onClick={() => location.reload()}>
                Обновить
              </button>
              <Link to="/" className="neon-btn">
                На главную
              </Link>
              <button className="neon-btn" onClick={this.reset}>
                Скрыть ошибку
              </button>
            </div>

            {errText && (
              <pre className="mt-3 max-h-60 overflow-auto text-xs opacity-60">
                {errText}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}