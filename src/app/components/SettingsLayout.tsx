import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";

type SettingsNavItem = 'profile' | 'family' | 'kitchen' | 'schedule' | 'structure';

interface SettingsLayoutProps {
  activeItem: SettingsNavItem;
  mobileTitle: string;
  desktopDescription: string;
  children: ReactNode;
  hasChanges?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  /** Optional element rendered on the right side of the mobile header */
  mobileHeaderRight?: ReactNode;
}

const NAV_GROUPS = [
  {
    label: 'Tai khoan',
    displayLabel: 'Tài khoản',
    items: [
      { id: 'profile' as const, label: 'Thông tin cá nhân', path: '/app/settings/profile' },
    ],
  },
  {
    label: 'Gia dinh',
    displayLabel: 'Gia đình',
    items: [
      { id: 'family' as const, label: 'Thành viên', path: '/settings/family' },
      { id: 'kitchen' as const, label: 'Bếp & Ngân sách', path: '/settings/kitchen' },
    ],
  },
  {
    label: 'Khac',
    displayLabel: 'Khác',
    items: [
      { id: 'schedule' as const, label: 'Thời gian bữa ăn', path: '/settings/schedule' },
      { id: 'structure' as const, label: 'Cấu trúc bữa ăn', path: '/settings/structure' },
    ],
  },
];

export function SettingsLayout({
  activeItem,
  mobileTitle,
  desktopDescription,
  children,
  hasChanges = false,
  onSave,
  onCancel,
  mobileHeaderRight,
}: SettingsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen pb-24"
    >
      {/* Mobile Header */}
      <div className="settings-mobile-header" style={{ justifyContent: mobileHeaderRight ? 'space-between' : undefined }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/settings')}
            className="settings-back-btn"
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <h2>{mobileTitle}</h2>
        </div>
        {mobileHeaderRight}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="px-4">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label} className={gi < NAV_GROUPS.length - 1 ? 'mb-6' : ''}>
                <p className="settings-sidebar-group-label">{group.displayLabel}</p>
                {group.items.map((item, ii) => {
                  const isActive = item.id === activeItem;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { if (!isActive) navigate(item.path); }}
                      className={`settings-sidebar-item ${isActive ? 'settings-sidebar-item-active' : ''} ${ii < group.items.length - 1 ? 'mb-1' : ''}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content — Desktop */}
        <div className="flex-1 p-8">
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
            Cài đặt
          </h1>
          <p className="body-text" style={{ marginBottom: '32px' }}>{desktopDescription}</p>
          {children}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">{children}</div>

      {/* Save Bar */}
      {hasChanges && onSave && onCancel && (
        <div className="save-bar bottom-0 left-0 right-0 lg:bottom-auto lg:top-0">
          <p className="body-text body-text-sm" style={{ flex: 1 }}>
            Thay đổi có hiệu lực từ bữa ăn tiếp theo
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="btn btn-ghost btn-sm">
              Huỷ
            </button>
            <button onClick={onSave} className="btn btn-primary btn-sm">
              Lưu thay đổi
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation — Mobile only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}