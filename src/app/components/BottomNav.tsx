import { Calendar, Apple, User, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Hôm nay', icon: Calendar, path: '/app/home' },
    { id: 'nutrition', label: 'Dinh dưỡng', icon: Apple, path: '/dinh-duong' },
    { id: 'family', label: 'Gia đình', icon: User, path: '/settings/family' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/app/settings' },
  ];

  const isTabActive = (tabId: string, tabPath: string) => {
    const p = location.pathname;

    if (tabId === 'home') {
      // S-05, S-05e, S-05🧊, S-06, S-06c → /app/home
      // S-07, S-07🧊 → /app/summary
      // S-08 → /app/recipe, S-08b → /app/cooking, S-09 → /app/complete
      return p === '/app/home' ||
             p === '/app/summary' ||
             p === '/app/recipe' ||
             p === '/app/cooking' ||
             p === '/app/complete';
    }

    if (tabId === 'nutrition') {
      // W-07, W-07b → /dinh-duong, /dinh-duong/:slug
      return p === '/dinh-duong' || p.startsWith('/dinh-duong/');
    }

    if (tabId === 'family') {
      // W-03 mobile → /settings/family, /settings/kitchen
      return p.startsWith('/settings/family') || p.startsWith('/settings/kitchen');
    }

    if (tabId === 'settings') {
      // S-10 → /app/settings
      // S-11 → /app/history
      // W-05..06 → /settings/schedule, /settings/structure
      // S-11p → /app/settings/profile
      // S-R03 → /app/weekly-report, /app/monthly-report
      // Also: /app/family-journal, /app/paywall, /app/purchase-success
      return p === '/app/settings' ||
             p === '/app/history' ||
             p.startsWith('/settings/schedule') ||
             p.startsWith('/settings/structure') ||
             p.startsWith('/app/settings/') ||
             p === '/app/weekly-report' ||
             p === '/app/monthly-report' ||
             p === '/app/family-journal' ||
             p === '/app/paywall' ||
             p === '/app/purchase-success';
    }

    return p === tabPath;
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-10"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)'
      }}>
      <div className="max-w-md mx-auto flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.id, tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 transition-colors relative"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-disabled)',
                transitionDuration: 'var(--dur-fast)',
                paddingBottom: '4px'
              }}>
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: '24px',
                    height: '2px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '1px'
                  }}
                />
              )}
              <Icon 
                size={24} 
                strokeWidth={1.5} 
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}