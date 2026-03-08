S-11p — Edit Profile (Thông Tin Cá Nhân)
Route: /app/settings/profile
Entry: S-11 Settings → row "Thông tin cá nhân"
Layout: Full-screen overlay · max-width 390px · background --bg #FEF8F1 · scroll
Save model: Optimistic update on tap "Lưu" → PUT /api/user/profile → success toast · no auto-save / no live sync

Top Bar
ComponentSpecLeft← back arrow 20px --text-2 → tap → S-11 (discard unsaved changes, no confirm dialog)Center"Thông tin cá nhân" · font 15px semibold · --text-1Right"Lưu" text button · font 14px semibold · --primary #D9622B · disabled (grey --text-2) until any field changes · tap → save flow

Avatar Section
padding: 24px 0 20px · text-align: center
ComponentSpecAvatar circle72×72px · border-radius: 50% · border: 2px solid --border #EAD8C8 · shows avatar_url if set · falls back to initial circle (first char of display_name, background --surface-alt #F7EDE0, --text-2 28px)Edit badge22×22px circle · background --primary #D9622B · white pencil SVG 10px · position: absolute bottom-0 right-0 on avatar containerEdit label"Đổi ảnh" · font 11px · --text-2 · margin-top: 6px
Tap avatar or badge → upload flow:

Native OS bottom sheet: "Chọn từ thư viện" · "Chụp ảnh" · "Huỷ"
Image selected → client-side crop modal: square 1:1 · min 200×200px
Confirm crop → POST /api/user/avatar (multipart/form-data, file: Blob) → server resizes to 200×200px WebP → uploads to R2 at avatars/{user_id}.webp → returns {avatar_url}
Optimistic: show cropped preview immediately in circle before upload completes
On error: revert to previous avatar · toast "Tải ảnh không thành công — thử lại nhé"

Constraints: Max file size 5MB · accepted formats: jpg, png, webp, heic · server enforces; client shows "Ảnh tối đa 5MB" if exceeded

Form Fields
padding: 0 16px · display: flex flex-col gap: 20px
Field row base: label + input stacked · gap: 6px
FieldLabelInput typeEditable?Notedisplay_name"Tên hiển thị"Text input✅ AlwaysMax 40 chars · placeholder "Tên của bạn"email"Email"Text inputAuth-dependent — see belowphone"Số điện thoại"Text inputAuth-dependent — see below
Email editability by auth_provider:

auth_provider = 'google' → email read-only · show "Đăng nhập qua Google" lock badge right of field · font 10px --text-2
auth_provider = 'facebook' → email read-only · show "Đăng nhập qua Facebook" lock badge
auth_provider = 'phone' → email editable · standard text input · validation: valid email format on save

Phone editability by auth_provider:

auth_provider = 'phone' → read-only · show "Số đăng ký" lock badge · phone is identity — cannot change in-app
auth_provider = 'google' or 'facebook' → editable · optional field · placeholder "Tuỳ chọn" · format: VN phone (+84 or 0xxx)
Phone field hidden entirely if auth_provider = 'phone' AND no alternative contact needed

Input field style (editable):

background --surface #FFFDF9 · border 1px solid --border #EAD8C8 · border-radius: 8px · padding: 10px 12px
focus: border 1px solid --border-accent #D9622B · no shadow
font 14px · --text-1
error state: border #E05C5C · error message below in 11px #E05C5C

Input field style (read-only):

background --surface-alt #F7EDE0 · border 1px solid --border #EAD8C8 · border-radius: 8px · padding: 10px 12px
font 14px · --text-2 · cursor: default


Validation
FieldRuleError messagedisplay_nameRequired · min 1 char · max 40 chars"Vui lòng nhập tên" / "Tên tối đa 40 ký tự"email (if editable)Valid email format"Email không hợp lệ"phone (if editable)VN format: starts with 0 or +84 · 9–10 digits after prefix"Số điện thoại không hợp lệ"
Validation fires on blur (leave field) + on "Lưu" tap. "Lưu" button stays disabled if any validation error active.

Save Flow
"Lưu" tap:

Run validation — stop if error
"Lưu" button → loading spinner 14px · non-interactive
PUT /api/user/profile {display_name?, email?, phone?} (only changed fields sent)
Success → toast "Đã lưu" bottom center · auto-dismiss 2s · navigate back → S-11
Error 409 (email taken) → inline error on email field "Email này đã được dùng"
Error 500 → toast "Lưu không thành công — thử lại nhé" · button re-enables


Danger Zone
margin-top: 32px · padding: 0 16px 40px
ComponentSpecSection label"Tài khoản" · font 11px semibold uppercase letter-spacing 0.1em · --text-2 · margin-bottom: 12pxDelete rowText "Xoá tài khoản" · font 14px · #E05C5C (destructive red) · no icon · tap → confirmation modal
Delete confirmation modal:

Title: "Xoá tài khoản?" · font 16px bold --text-1
Body: "Toàn bộ dữ liệu gia đình, lịch sử bữa ăn và gói dịch vụ sẽ bị xoá vĩnh viễn trong 30 ngày." · font 13px --text-2 line-height 1.6
Confirm button: "Xoá tài khoản" · background #E05C5C · white text · full-width
Cancel: "Huỷ" · ghost · --text-2
Confirm tap → DELETE /api/user/account {confirm: true} → sets account_deletion_requested_at → toast "Yêu cầu xoá đã được ghi nhận" → sign out → redirect / landing


Copywrite
Top bar title:       "Thông tin cá nhân"
Top bar save:        "Lưu"
Avatar edit label:   "Đổi ảnh"
Avatar upload opt 1: "Chọn từ thư viện"
Avatar upload opt 2: "Chụp ảnh"
Avatar upload opt 3: "Huỷ"
Avatar error:        "Tải ảnh không thành công — thử lại nhé"
Avatar size error:   "Ảnh tối đa 5MB"
Field: display_name: "Tên hiển thị"
Field: email:        "Email"
Field: phone:        "Số điện thoại"
Lock badge Google:   "Đăng nhập qua Google"
Lock badge Facebook: "Đăng nhập qua Facebook"
Lock badge phone:    "Số đăng ký"
Phone placeholder:   "Tuỳ chọn"
Save success toast:  "Đã lưu"
Save error toast:    "Lưu không thành công — thử lại nhé"
Email taken error:   "Email này đã được dùng"
Section danger:      "Tài khoản"
Delete row:          "Xoá tài khoản"
Delete modal title:  "Xoá tài khoản?"
Delete modal body:   "Toàn bộ dữ liệu gia đình, lịch sử bữa ăn và gói dịch vụ sẽ bị xoá vĩnh viễn trong 30 ngày."
Delete modal CTA:    "Xoá tài khoản"
Delete modal cancel: "Huỷ"
Delete success:      "Yêu cầu xoá đã được ghi nhận"
Routes:

← back → S-11 (discard)
"Lưu" success → S-11
"Xoá tài khoản" confirm → sign out → / landing