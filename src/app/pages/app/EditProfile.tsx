import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { SettingsLayout } from "../../components/SettingsLayout";

interface UserProfile {
  display_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  auth_provider: 'google' | 'facebook' | 'phone';
}

interface ValidationErrors {
  display_name?: string;
  email?: string;
  phone?: string;
}

export function EditProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock user data - in production, fetch from API
  const [originalProfile] = useState<UserProfile>({
    display_name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    phone: '+84987654321',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    auth_provider: 'google'
  });

  const [profile, setProfile] = useState<UserProfile>(originalProfile);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if form has changes
  const hasChanges = 
    profile.display_name !== originalProfile.display_name ||
    profile.email !== originalProfile.email ||
    profile.phone !== originalProfile.phone ||
    avatarPreview !== originalProfile.avatar_url;

  // Check if save button should be enabled
  const canSave = hasChanges && Object.keys(errors).length === 0 && !isSaving;

  // Validation functions
  const validateDisplayName = (value: string): string | undefined => {
    if (!value.trim()) return 'Vui lòng nhập tên';
    if (value.length > 40) return 'Tên tối đa 40 ký tự';
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Email không hợp lệ';
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    // VN format: starts with 0 or +84, 9-10 digits after prefix
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Số điện thoại không hợp lệ';
    return undefined;
  };

  // Handle field blur validation
  const handleBlur = (field: keyof UserProfile, value: string) => {
    let error: string | undefined;
    
    if (field === 'display_name') {
      error = validateDisplayName(value);
    } else if (field === 'email' && profile.auth_provider !== 'google' && profile.auth_provider !== 'facebook') {
      error = validateEmail(value);
    } else if (field === 'phone' && profile.auth_provider !== 'phone') {
      error = validatePhone(value);
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh tối đa 5MB');
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      toast.error('Định dạng ảnh không hợp lệ');
      return;
    }

    // Create preview (in production, would open crop modal here)
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      // In production: upload to /api/user/avatar here
    };
    reader.readAsDataURL(file);
  };

  // Handle save
  const handleSave = async () => {
    // Validate all fields
    const newErrors: ValidationErrors = {};
    
    const displayNameError = validateDisplayName(profile.display_name);
    if (displayNameError) newErrors.display_name = displayNameError;

    if (profile.auth_provider !== 'google' && profile.auth_provider !== 'facebook') {
      const emailError = validateEmail(profile.email);
      if (emailError) newErrors.email = emailError;
    }

    if (profile.auth_provider !== 'phone') {
      const phoneError = validatePhone(profile.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      // Mock API call - in production: PUT /api/user/profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast.success('Đã lưu');
      setTimeout(() => {
        navigate('/app/settings');
      }, 500);
    } catch (error: any) {
      if (error.status === 409) {
        setErrors({ email: 'Email này đã được dùng' });
      } else {
        toast.error('Lưu không thành công — thử lại nhé');
      }
      setIsSaving(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // Mock API call - in production: DELETE /api/user/account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Yêu cầu xoá đã được ghi nhận');
      // In production: sign out and redirect to landing
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error('Có lỗi xảy ra — thử lại nhé');
      setIsDeleting(false);
    }
  };

  // Determine field editability
  const isEmailEditable = profile.auth_provider === 'phone';
  const isPhoneEditable = profile.auth_provider !== 'phone';

  // Get lock badge text
  const getEmailLockBadge = () => {
    if (profile.auth_provider === 'google') return 'Đăng nhập qua Google';
    if (profile.auth_provider === 'facebook') return 'Đăng nhập qua Facebook';
    return null;
  };

  const getPhoneLockBadge = () => {
    if (profile.auth_provider === 'phone') return 'Số đăng ký';
    return null;
  };

  return (
    <SettingsLayout
      activeItem="profile"
      mobileTitle="Thông tin cá nhân"
      desktopDescription="Cập nhật ảnh đại diện, tên hiển thị và thông tin liên hệ"
      hasChanges={canSave}
      onSave={handleSave}
      onCancel={() => navigate('/app/settings')}
    >
      <div style={{ maxWidth: '390px', margin: '0 auto' }}>
        {/* Avatar Section */}
        <div 
          className="text-center"
          style={{ padding: '24px 0 20px' }}>
          
          <div 
            className="relative inline-block cursor-pointer"
            onClick={handleAvatarClick}>
            
            {/* Avatar Circle */}
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: '72px',
                height: '72px',
                border: '2px solid var(--color-border)',
                backgroundColor: avatarPreview ? 'transparent' : 'var(--color-surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)'
                  }}>
                  {profile.display_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Edit Badge */}
            <div
              className="absolute rounded-full flex items-center justify-center"
              style={{
                width: '22px',
                height: '22px',
                backgroundColor: 'var(--color-primary)',
                bottom: 0,
                right: 0
              }}>
              <Camera size={10} strokeWidth={1.5} style={{ color: 'white' }} />
            </div>
          </div>

          {/* Edit Label */}
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              marginTop: '6px'
            }}>
            Đổi ảnh
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Form Fields */}
        <div 
          className="flex flex-col"
          style={{ 
            padding: '0 16px',
            gap: '20px'
          }}>
          
          {/* Display Name */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                marginBottom: '6px'
              }}>
              Tên hiển thị
            </label>
            <input
              type="text"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="Tên của bạn"
              maxLength={40}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-surface)',
                border: errors.display_name ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                borderRadius: '8px',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.display_name) {
                  e.target.style.borderColor = 'var(--color-primary)';
                }
              }}
              onBlur={(e) => {
                handleBlur('display_name', e.target.value);
                if (!errors.display_name) {
                  e.target.style.borderColor = 'var(--color-border)';
                }
              }}
            />
            {errors.display_name && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-error)',
                  marginTop: '4px'
                }}>
                {errors.display_name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)'
                }}>
                Email
              </label>
              {!isEmailEditable && getEmailLockBadge() && (
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-surface-alt)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)'
                  }}>
                  {getEmailLockBadge()}
                </span>
              )}
            </div>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEmailEditable}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: isEmailEditable ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isEmailEditable ? 'var(--color-surface)' : 'var(--color-surface-alt)',
                border: errors.email ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                borderRadius: '8px',
                outline: 'none',
                cursor: isEmailEditable ? 'text' : 'default'
              }}
              onFocus={(e) => {
                if (isEmailEditable && !errors.email) {
                  e.target.style.borderColor = 'var(--color-primary)';
                }
              }}
              onBlur={(e) => {
                if (isEmailEditable) {
                  handleBlur('email', e.target.value);
                  if (!errors.email) {
                    e.target.style.borderColor = 'var(--color-border)';
                  }
                }
              }}
            />
            {errors.email && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-error)',
                  marginTop: '4px'
                }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)'
                }}>
                Số điện thoại
              </label>
              {!isPhoneEditable && getPhoneLockBadge() && (
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-surface-alt)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)'
                  }}>
                  {getPhoneLockBadge()}
                </span>
              )}
            </div>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder={isPhoneEditable ? 'Tuỳ chọn' : ''}
              disabled={!isPhoneEditable}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: isPhoneEditable ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                backgroundColor: isPhoneEditable ? 'var(--color-surface)' : 'var(--color-surface-alt)',
                border: errors.phone ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                borderRadius: '8px',
                outline: 'none',
                cursor: isPhoneEditable ? 'text' : 'default'
              }}
              onFocus={(e) => {
                if (isPhoneEditable && !errors.phone) {
                  e.target.style.borderColor = 'var(--color-primary)';
                }
              }}
              onBlur={(e) => {
                if (isPhoneEditable) {
                  handleBlur('phone', e.target.value);
                  if (!errors.phone) {
                    e.target.style.borderColor = 'var(--color-border)';
                  }
                }
              }}
            />
            {errors.phone && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-error)',
                  marginTop: '4px'
                }}>
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: '32px', padding: '0 16px 40px' }}>
          {/* Section Label */}
          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-secondary)'
              }}>
              Tài khoản
            </span>
          </div>

          {/* Delete Row */}
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              width: '100%',
              padding: '16px',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-error)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'border-color 150ms'
            }}>
            Xoá tài khoản
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(30, 20, 16, 0.5)',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => !isDeleting && setShowDeleteModal(false)}>
          
          <div
            className="w-full"
            style={{
              maxWidth: '340px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-overlay)'
            }}
            onClick={(e) => e.stopPropagation()}>
            
            {/* Title */}
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '12px'
              }}>
              Xoá tài khoản?
            </h2>

            {/* Body */}
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}>
              Toàn bộ dữ liệu gia đình, lịch sử bữa ăn và gói dịch vụ sẽ bị xoá vĩnh viễn trong 30 ngày.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              {/* Confirm Button */}
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: 'var(--color-error)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'opacity 150ms',
                  opacity: isDeleting ? 0.6 : 1
                }}>
                {isDeleting ? 'Đang xử lý...' : 'Xoá tài khoản'}
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="hover-bg-alt"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: 'var(--radius-full)',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 150ms'
                }}>
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}