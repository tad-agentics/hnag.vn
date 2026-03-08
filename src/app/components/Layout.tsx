import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/app/contexts/AuthContext";
import { getTrialState } from "@/app/lib/trial";

const PAYWALL_ALLOWED_PATHS = ['/app/paywall', '/app/history', '/app/settings'];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const isAppRoute = location.pathname.startsWith("/app");
  const trial = getTrialState(profile);
  const isPaywallAllowedPath = PAYWALL_ALLOWED_PATHS.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (loading) return;
    if (isAppRoute && !session) {
      navigate("/", { replace: true });
      return;
    }
    if (isAppRoute && session && trial.phase === 'paywall' && !isPaywallAllowedPath) {
      navigate("/app/paywall", { replace: true });
    }
  }, [loading, session, trial.phase, isAppRoute, isPaywallAllowedPath, navigate]);

  if (loading && isAppRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <p className="body-text" style={{ color: "var(--color-text-secondary)" }}>Đang tải...</p>
      </div>
    );
  }
  if (isAppRoute && !session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}