import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
  errorMessage?: string | null;
};

export const LoginForm = ({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(email, password);
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-strong)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-strong)] outline-none transition focus:border-[rgba(15,44,34,0.35)]"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-strong)]" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 pr-12 text-sm text-[var(--color-text-strong)] outline-none transition focus:border-[rgba(15,44,34,0.35)]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-[var(--color-text-muted)] transition hover:text-[var(--color-text-strong)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[rgba(165,71,67,0.16)] bg-[rgba(165,71,67,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-[var(--color-surface)] transition hover:bg-[var(--color-primary-deep)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign in to Coach Console"}
      </button>
    </form>
  );
};
