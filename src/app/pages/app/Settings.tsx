import { useNavigate } from "react-router";
import { ChevronRight, Users, ChefHat, Calendar, Utensils, History, User, Sparkles, BookOpen } from "lucide-react";
import { BottomNav } from "../../components/BottomNav";

interface SettingsRow {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface SettingsSection {
  title: string;
  rows: SettingsRow[];
}

export function SettingsScreen() {
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  };

  const sections: SettingsSection[] = [
    {
      title: 'Gia đình',
      rows: [
        {
          id: 'family-members',
          label: 'Thành viên & sức khoẻ',
          icon: <Users size={20} strokeWidth={1.5} />,
          path: '/settings/family' // W-03
        },
        {
          id: 'kitchen-budget',
          label: 'Bếp & Ngân sách',
          icon: <ChefHat size={20} strokeWidth={1.5} />,
          path: '/settings/kitchen' // W-04
        }
      ]
    },
    {
      title: 'Bữa ăn',
      rows: [
        {
          id: 'meal-schedule',
          label: 'Lịch bữa ăn',
          icon: <Calendar size={20} strokeWidth={1.5} />,
          path: '/settings/schedule' // W-05
        },
        {
          id: 'meal-structure',
          label: 'Cấu trúc bữa',
          icon: <Utensils size={20} strokeWidth={1.5} />,
          path: '/settings/structure' // W-06
        },
        {
          id: 'meal-history',
          label: 'Lịch sử bữa ăn',
          icon: <History size={20} strokeWidth={1.5} />,
          path: '/app/history' // S-10
        },
        {
          id: 'family-journal',
          label: 'Sổ Gia Đình',
          icon: <BookOpen size={20} strokeWidth={1.5} />,
          path: '/app/family-journal' // S-R03
        }
      ]
    },
    {
      title: 'Tài khoản',
      rows: [
        {
          id: 'personal-info',
          label: 'Thông tin cá nhân',
          icon: <User size={20} strokeWidth={1.5} />,
          path: '/app/settings/profile' // S-11p
        },
        {
          id: 'subscription',
          label: 'Gói dịch vụ',
          icon: <Sparkles size={20} strokeWidth={1.5} />,
          path: '/app/paywall',
          badge: 'Nâng cấp',
          badgeColor: 'amber'
        }
      ]
    }
  ];

  const handleRowClick = (path: string) => {
    navigate(path);
  };

  return (
    <div 
      className="min-h-screen pb-24">
      
      {/* Header */}
      <div 
        className="px-4 pt-12 pb-6"
        style={{ 
          borderBottom: '1px solid var(--color-border)'
        }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-text-primary)'
          }}>
          Cài đặt
        </h1>
      </div>

      <div className="px-4 pt-6">
        {/* Profile Card */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl mb-6 transition-all cursor-pointer hover-border-strong"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
          onClick={() => handleRowClick('/app/settings/profile')}>
          
          {/* Avatar */}
          <div 
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{
              width: '56px',
              height: '56px',
              backgroundImage: `url(${user.avatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid var(--color-border)'
            }}
          />

          {/* Info */}
          <div className="flex-1">
            <p
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '4px'
              }}>
              {user.name}
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}>
              {user.email}
            </p>
          </div>

          {/* Chevron */}
          <ChevronRight 
            size={20} 
            strokeWidth={1.5} 
            style={{ color: 'var(--color-text-disabled)' }} 
          />
        </div>

        {/* Settings Sections */}
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? 'mt-8' : ''}>
            {/* Section Title */}
            <div className="mb-3 px-2">
              <span className="section-label section-label-primary">
                {section.title}
              </span>
            </div>

            {/* Section Rows */}
            <div 
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}>
              {section.rows.map((row, rowIndex) => (
                <div key={row.id}>
                  <button
                    onClick={() => handleRowClick(row.path)}
                    className="w-full flex items-center gap-3 px-4 py-4 transition-all text-left hover-bg-alt"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                    
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 rounded-full flex items-center justify-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--color-surface-alt)',
                        color: 'var(--color-text-secondary)'
                      }}>
                      {row.icon}
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: 'var(--color-text-primary)'
                        }}>
                        {row.label}
                      </span>
                    </div>

                    {/* Badge (if applicable) */}
                    {row.badge && (
                      <div
                        className="rounded-full"
                        style={{
                          padding: '4px 10px',
                          backgroundColor: row.badgeColor === 'amber' 
                            ? 'var(--color-warn-light)' 
                            : 'var(--color-primary-light)',
                          border: row.badgeColor === 'amber'
                            ? '1px solid var(--color-warn-border)'
                            : '1px solid var(--color-primary-border)'
                        }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            color: row.badgeColor === 'amber'
                              ? 'var(--color-warn)'
                              : 'var(--color-primary)'
                          }}>
                          {row.badge}
                        </span>
                      </div>
                    )}

                    {/* Chevron */}
                    <ChevronRight 
                      size={20} 
                      strokeWidth={1.5} 
                      style={{ 
                        color: 'var(--color-text-disabled)',
                        flexShrink: 0 
                      }} 
                    />
                  </button>

                  {/* Divider (not on last row) */}
                  {rowIndex < section.rows.length - 1 && (
                    <div 
                      style={{
                        height: '1px',
                        backgroundColor: 'var(--color-border)',
                        marginLeft: '68px' // Align with text
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}