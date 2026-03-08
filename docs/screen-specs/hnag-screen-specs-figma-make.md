# HNAG — Screen Specs for Figma Make
**Hôm Nay Ăn Gì? · PWA Wireframes v4.4 · 40 screens / states**  
Dùng cho: Figma Make / AI screen generation  
Mỗi screen: Mã · Tên · Components · Copywrite · Routes  
*v1.3 — S-12c Hard Paywall: stub → full spec (layout, states, data variables, copywrite, paid state, renewal state, routes)
*v1.2 — v4.4 sync: S-05🧊BS updated (NLP text input dominant, chips secondary); S-03 health chips updated (+4 conditions từ Health Rule Engine v2.0)*

---

## SCREEN INDEX

| Mã | Tên | Loại |
|---|---|---|
| **W-01** | Homepage (Desktop + Mobile responsive) | Web landing |
| **W-02a** | Auth Modal (Desktop overlay) | Web auth |
| **W-03** | Family Settings (Desktop + Mobile responsive) | Settings webview |
| **W-04** | Kitchen & Budget Settings | Settings webview |
| **W-05** | Schedule Settings | Settings webview |
| **W-06** | Meal Structure Settings | Settings webview |
| **W-07** | Dinh Dưỡng Blog Desktop | Web editorial |
| **W-07·mob** | Dinh Dưỡng Blog Mobile responsive | Web editorial |
| **W-07·li** | Dinh Dưỡng Blog — Logged-in state | App tab |
| **W-07b** | Article Detail | App/Web |
| **S-01** | Splash / Welcome | Onboarding |
| **S-01b** | Demo Swipe — Aha Moment | Onboarding |
| **S-02** | Gia Đình (thành viên) | Onboarding |
| **S-03** | Sức Khoẻ (per member, lặp) | Onboarding |
| **S-04** | Thói Quen | Onboarding |
| **S-04b** | Cam Kết App | Onboarding gate |
| **S-05** | Home — Chọn bữa | Core loop |
| **S-05e** | Empty Deck State | Core loop |
| **S-05+🧊** | Home — Tủ Lạnh toggle (chưa bật) | Feature variant |
| **S-05🧊BS** | Home — Tủ Lạnh bottom sheet | Feature variant |
| **S-05🧊RS** | Home — Deck re-sorted after Tủ Lạnh | Feature variant |
| **S-06** | Swipe mid-session | Core loop |
| **S-06c** | Đổi Loại Slot (inline) | Core loop |
| **S-07** | Meal Summary | Core loop |
| **S-07🧊** | Meal Summary — Tủ Lạnh variant | Feature variant |
| **S-08a** | Recipe Hero + Nguyên Liệu | Recipe |
| **S-08b** | Cách Nấu | Recipe |
| **S-08c** | Mẹo Nhỏ + Similar | Recipe |
| **S-08d** | Cooking Mode | Recipe |
| **S-09** | Bữa Hoàn Thành | Completion |
| **S-09n** | Notification Opt-in Bottom Sheet | Completion |
| **S-10** | Lịch Sử Bữa Ăn | History |
| **S-11** | Settings List (Mobile) | Settings |
| **S-11p** | Edit Profile (Thông Tin Cá Nhân) | Settings |
| **S-12a** | Trial Ribbon (Day 11–14) | Paywall |
| **S-12b** | Soft Nudge Modal (Day 12) | Paywall |
| **S-12c** | Hard Paywall (Day 15+) | Paywall |
| **S-12d** | Post-Purchase Success | Paywall |
| **S-R01** | Weekly Report Card | Rewards |
| **S-R02** | Monthly Report Card | Rewards |
| **S-R03** | Sổ Gia Đình Archive | Rewards |

---

## PHẦN 1 — WEB SCREENS

---

### W-01 — Homepage (Desktop + Mobile Responsive)

**Route:** `hnag.vn/`  
**Responsive note:** Cùng 1 component, cùng 1 URL. Desktop ≥ 768px = full multi-column layout. Mobile < 768px = single-column stack. **W-02b trong wireframe cũ là mobile view của W-01 — không phải screen độc lập, không có URL riêng.**

**Desktop components:**

| Component | Mô tả |
|---|---|
| **Top Nav** | Logo · Tính năng · Giá · Dinh Dưỡng (→ W-07) · Về chúng tôi · CTA "Dùng miễn phí →" |
| **Hero** | Badge "✦ AI cho gia đình Việt" · H1 Fraunces 2 dòng · Sub · Social CTA "Tiếp tục với Google" + email CTA outline |
| **Preview Card** | Demo: food img + "Canh Bầu Nấu Tôm" + tags (✓ Ba · ✓ Mẹ · ⏱ 20p) |
| **Features 3-col** | Swipe để chọn bữa · Lọc theo sức khoẻ · Nhớ khẩu vị theo thời gian |
| **Bottom CTA Bar** | Background #1E1410 · Fraunces "Bắt đầu ngay miễn phí 14 ngày" · Terracotta CTA |
| **PWA Install Strip** | Background tối · "Cài app về máy" · "Dùng offline · nhanh hơn" · "Cài đặt" button |

**Mobile-specific adaptations:**
- Nav: logo + "Đăng nhập" button only (links collapse)
- Features: single-column
- Bottom CTA: sticky full-width

**Copywrite:**
- Badge: `✦ AI cho gia đình Việt`
- Preview label: `Xem thử trước khi đăng nhập`
- CTA bar: `Bắt đầu ngay miễn phí 14 ngày`
- Legal: `Không cần thẻ tín dụng · Mua 1 lần, dùng mãi`
- PWA: `Cài app về máy` · `Dùng offline, nhanh hơn`

**Routes:**
- Any login CTA → `W-02a`
- Google OAuth → `/onboarding` (new) or `/app/home` (returning)
- Nav "Dinh Dưỡng" → `W-07`

---

### W-02a — Auth Modal

**Route:** Overlay trên `hnag.vn/`

| Component | Mô tả |
|---|---|
| **Modal** | Max-width 320px · centered · border 1.5px · br-12px · ✕ close |
| **Social Login** | Full-width h-36px · Google icon · "Tiếp tục với Google" |
| **Divider** | "hoặc dùng email" |
| **Inputs** | Email h-34px + Password h-34px · "Quên mật khẩu?" right |
| **CTA** | "Đăng nhập" full-width |
| **Register** | "Chưa có tài khoản? Đăng ký" |
| **Terms** | 1 dòng muted |

**Copywrite:**
- Title: `Đăng nhập` · Sub: `Đăng nhập để tiếp tục`
- Social: `Tiếp tục với Google`
- CTA: `Đăng nhập`
- Register: `Chưa có tài khoản? Đăng ký`
- Forgot: `Quên mật khẩu?`
- Terms: `Bằng cách đăng nhập, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật`

**Routes:** Success → `if onboarding_complete` → `/app/home` else `/onboarding`

---

### W-03 — Family Settings

**Route:** `/settings/family`  
**Responsive:** Desktop = sidebar + content panel. Mobile = full-screen + ← back. Same URL.

| Component | Mô tả |
|---|---|
| **Sidebar** | Groups: Tài khoản · **Gia đình** (Thành viên active) · Khác |
| **Member Tabs** | "Ba (36t)" active · "Mẹ (34t)" · "Con (5t)" · "+ Thêm" dashed |
| **Basic Info** | "Gọi là" input · "Tuổi" stepper · "Giới tính" radio (Nam/Nữ/Khác) |
| **Bệnh lý** | Section "Bệnh lý / Kiêng ăn" · Checkboxes: **Gout (tăng acid uric) · Mỡ máu cao · Tiểu đường type 2 · Huyết áp cao · Dạ dày / Trào ngược · Suy thận** · Text input dị ứng "Thêm: tôm, đậu phộng, gluten..." · Tag display "✕ Hải sản có vỏ" |
| **Khẩu vị** | Section "Khẩu vị & Sở thích" · Mức cay (Không cay/Cay nhẹ/Cay vừa/Rất cay) · Mặn/nhạt · Cách nấu ưa thích · Protein · Không thích (text input + tags) |
| **Save Bar** | "Thay đổi có hiệu lực từ bữa ăn tiếp theo" · "Huỷ" + "Lưu thay đổi" |

**⚠ Bệnh lý = hard constraints.** Khẩu vị = soft preferences. Phân biệt rõ trong DB: `health_constraints[]` vs `food_preferences{}`.

---

### W-04 — Kitchen & Budget Settings

**Route:** `/settings/kitchen`

| Component | Mô tả |
|---|---|
| **Thiết bị** | Toggle: Bếp từ/gas (on, "2 bếp") · Nồi cơm điện (on) · Nồi hấp (on) · Lò nướng (off) · Máy xay (off) |
| **Thời gian** | "Ngày thường" **30 phút** · "Cuối tuần" **60 phút** |
| **Ngân sách** | "Ngày thường" **120.000đ** · "Cuối tuần" **200.000đ** · "Số người mặc định" stepper **3** |
| **Special modes** | Table: Thứ 6 = Nhanh ≤ 20p · Thứ 7 = Bình thường ≤ 60p · "+ Thêm ngày" |

**Default values (corrected từ wireframe):**

| Field | Giá trị đúng |
|---|---|
| Thời gian ngày thường | **30 phút** |
| Thời gian cuối tuần | **60 phút** |
| Budget ngày thường | **120.000đ** |
| Budget cuối tuần | **200.000đ** |

---

### W-05 — Schedule Settings

**Route:** `/settings/schedule`

| Component | Mô tả |
|---|---|
| **Meal Toggles** | Bữa sáng (off) · Bữa trưa (on, time 11:30) · Bữa tối (on, time **17:00** default) |
| **Active Days** | Chip row: T2 T3 T4 T5 T6 T7 CN |

---

### W-06 — Meal Structure Settings

**Route:** `/settings/structure`

| Component | Mô tả |
|---|---|
| **Meal Tabs** | Sáng / Trưa / Tối (independent structures per meal) |
| **Preset** | Cơ bản 2 món · Tiêu chuẩn 4 món · Đầy đủ 5 món |
| **Slot List** | Drag-reorder: Mặn 1 · Mặn 2 · Canh · Rau · + Thêm slot (max 6) |
| **Starch** | "Cơm trắng tự động — không cần swipe" (non-editable) |

---

### W-07 — Dinh Dưỡng Blog (Desktop)

**Route:** `/dinh-duong` (public, SEO-optimised)  
**Purpose:** (1) SEO acquisition — keyword clusters bệnh lý. (2) Logged-in retention — personalised theo family profile.

| Component | Mô tả |
|---|---|
| **Nav** | Same as W-01, tab **Dinh Dưỡng** active (terracotta underline) |
| **Editorial Header** | Background #1E1410 · Label "Dinh Dưỡng Gia Đình Việt" uppercase muted · Fraunces H1 · Sub muted · Category filter pills |
| **Category Pills** | **Tất cả** (active terracotta) · Gout · Tiểu đường · Huyết áp · Trẻ em · Nấu nhanh · Mùa & Nguyên liệu · Dạ dày |
| **Featured Article** | Large card: food img 160px · Category badge overlay · Fraunces title · sub · tags + "Đọc →" |
| **Article Grid** | Multi-col cards: img 80px · category badge · Fraunces 12px · sub · read-time |
| **App Cross-sell** | Background #1E1410 · "Đọc xong — để app lọc món cho gia đình bạn" · sub · CTA "Dùng miễn phí 14 ngày →" |
| **Newsletter** | Border cream · Fraunces title · email input + "Đăng ký" · topic checkboxes: Gout · Tiểu đường · Huyết áp · Trẻ em · Nấu nhanh |

**Copywrite:**
- Header label: `Dinh Dưỡng Gia Đình Việt`
- H1: `Ăn đúng cho từng người trong gia đình.`
- Sub: `Kiến thức dinh dưỡng thực tế cho gia đình Việt — không lý thuyết.`
- App block: `Đọc xong — để app lọc món cho gia đình bạn`
- App sub: `App tự động áp dụng kiến thức bệnh lý vào từng gợi ý bữa ăn. Bạn không cần nhớ — app nhớ thay.`
- Newsletter title: `Mỗi tuần 1 bài — đúng bệnh lý gia đình bạn`
- Newsletter sub: `Đăng ký để nhận bài viết mới theo đúng bệnh lý bạn quan tâm. Không spam.`

**Sample articles:**
- `Người bị gout nên ăn gì và kiêng gì? 30 món Việt an toàn`
- `Huyết áp cao kiêng ăn gì?`
- `Viêm dạ dày nên ăn gì buổi tối?`
- `Rau củ tháng 3 miền Nam — nên mua gì, tránh gì`

**Routes:**
- Category tab → filter list
- Article → `W-07b`
- "Dùng miễn phí →" → `W-02a`

---

### W-07 Mobile Responsive

**Route:** `/dinh-duong` (same URL, < 768px)  
*Responsive adaptation — không phải screen riêng.*

- Category tabs: horizontal scroll
- Article grid: single-column
- App CTA: sticky bottom bar thay vì inline block

---

### W-07 · Logged-in (từ bottom nav app)

**Route:** `/dinh-duong` (same URL, authenticated)  
**Entry:** Bottom nav tab "Dinh Dưỡng" từ `S-05`

**Deltas vs unauthenticated:**

| Component | Delta |
|---|---|
| **Top bar** | Avatar user (circle terracotta, initial) thay "Dùng thử" CTA |
| **Personalised Callout** | rgba-white bg · "Gợi ý theo gia đình bạn — **[bệnh_lý_1] · [bệnh_lý_2]**" |
| **Category tab đầu** | **"Cho gia đình tôi"** dynamic (active by default) thay "Tất cả" |
| **Bottom Nav** | App bottom nav hiển thị · **Dinh Dưỡng** active |
| **No sticky CTA** | User đã login |

**Copywrite:**
- Callout: `Gợi ý theo gia đình bạn — [bệnh_lý_1] · [bệnh_lý_2]`
- Tab: `Cho gia đình tôi`

**Routes:** Article → `W-07b` · Bottom nav "Hôm nay" → `S-05`

---

### W-07b — Article Detail

**Route:** `/dinh-duong/[slug]`

| Component | Mô tả |
|---|---|
| **Back Bar** | "← Dinh Dưỡng" left · ↗ Share right |
| **Article Header** | Fraunces title 14px · Meta "BS. Dinh dưỡng · Viện Dinh Dưỡng · [date]" |
| **Body** | Text 8.5px line-height 1.7 · Section headings Fraunces · bullet list với SVG check icons |
| **Inline App CTA** | Background #FAEAE0 border #F0CBBA · *Logged-in:* "App đã áp dụng cho [member_name]" + sub · *Unauth:* generic CTA |
| **Bottom Nav** | Logged-in: app nav, **Dinh Dưỡng** active · Unauth: không có |

**Logged-in CTA copywrite:**
- Title: `App đã áp dụng cho [member_name]`
- Sub: `Gợi ý bữa ăn tự động lọc [bệnh_lý] — không cần nhớ danh sách này.`

**Routes:** ← → `W-07` · Bottom nav "Hôm nay" → `S-05` · Inline CTA (unauth) → `W-02a`

---

## PHẦN 2 — ONBOARDING (S-01 → S-04b)

---

### S-01 — Splash / Welcome

**Route:** `/onboarding`

| Component | Mô tả |
|---|---|
| **App Icon** | 48×48 br-12px border 1.5px · SVG bowl |
| **App Name** | "Hôm Nay Ăn Gì?" bold · Tagline muted |
| **Primary CTA** | "Bắt đầu nhé →" |
| **Secondary** | Ghost "Đã có tài khoản" |

**Routes:** CTA → `S-01b` · "Đã có tài khoản" → `W-02a`

---

### S-01b — Demo Swipe (Aha Moment)

**Route:** `/onboarding/demo`

| Component | Mô tả |
|---|---|
| **Header** | "Thử xem — swipe để chọn" · "Phù hợp? Vuốt phải ✓ · Không thích? Vuốt trái ✕" |
| **Demo Card** | "Canh Chua Cá Lóc" · ✓ Ba (Gout OK) · ✓ Cả nhà · ⏱ 25p · 💰 60k |
| **Buttons** | ✕ outline · ✓ dark filled |
| **Post-swipe Card** | Background #f0f4f0 dashed border · "Xong rồi." + body |
| **CTA** | "Tiếp tục →" |

**Copywrite:**
- Post-swipe: `Xong rồi.`
- Body: `Để mình hỏi thêm về gia đình — gợi ý sẽ đúng hơn cho từng người.`

**Routes:** → `S-02`

---

### S-02 — Gia Đình (Ai trong nhà?)

**Route:** `/onboarding/family`  
**⚠ Scope: Chỉ hỏi tên thành viên. Không hỏi bệnh lý — bệnh lý thuộc S-03.**

| Component | Mô tả |
|---|---|
| **Step Indicator** | Step 1/4 active |
| **← Quay lại** | Text link top-left |
| **Question** | "Nhà mình có những ai?" · sub "Để mình gợi ý đúng cho từng người" |
| **Member Cards** | Avatar circle (initial) + tên input + tuổi · default: Ba · Mẹ · Con · "+ Thêm" dashed |
| **CTA** | "Tiếp theo →" |
| **Skip** | "Bỏ qua, tôi điền sau" |

**Routes:** → `S-03` (iterate per member)

---

### S-03 — Sức Khoẻ (per member)

**Route:** `/onboarding/health?member=[id]`  
**Lặp lại per member. Sau member cuối → `S-04`.**

| Component | Mô tả |
|---|---|
| **Step Indicator** | Step 2/4 active · Step 1 done ✓ |
| **Member Progress** | "Thành viên [X]/[Y] · Chọn tất cả phù hợp" |
| **Avatar** | Circle dark, initial char |
| **Header** | "[Tên] có cần kiêng gì không?" (dynamic) |
| **Bệnh lý Chips** | Multi-select — **bệnh lý only:** Gout · Mỡ máu cao · Tiểu đường · Huyết áp · Dạ dày · Gan nhiễm mỡ · Suy thận · Muốn giảm cân · Không có |
| **Dị ứng** | Text input "Ví dụ: tôm, đậu phộng..." |
| **CTA** | "Tiếp theo → [next_name]" / "Hoàn thành →" (last) |
| **Skip** | "Bỏ qua cho [tên], sang [tên tiếp theo]" |

**⚠ Bệnh lý chỉ gồm các điều kiện y tế — không include khẩu vị (cay, mặn, sở thích). Khẩu vị thu thập ở W-03 Settings sau này.**

**Routes:** → next member's `S-03` → after last → `S-04`

---

### S-04 — Thói Quen

**Route:** `/onboarding/habits`

| Component | Mô tả |
|---|---|
| **Step Indicator** | Step 4/4 active |
| **Q1** | "Thường nấu bao lâu?" · Dưới 20p · **20–40p** default · Trên 40p |
| **Q2** | "Ngân sách mỗi bữa?" · ≤ 80k · **80–150k** default · 150k+ |
| **Q3** | "Hay nấu hay gọi?" · **Hay nấu** default · Hay gọi · Tuỳ ngày |
| **CTA** | "Xong! Vào app →" |
| **Skip** | "Bỏ qua, tôi tự chỉnh sau" |

**Routes:** → `S-04b`

---

### S-04b — Cam Kết App

**Route:** `/onboarding/commitment`  
**Không có step indicator. Không có Back. One-way gate.**

| Component | Mô tả |
|---|---|
| **Icon** | SVG brain 24px centered |
| **Title** | "App sẽ học về gia đình bạn" Fraunces bold |
| **Sub** | "Càng dùng lâu — càng hiểu bạn hơn" |
| **Milestone 1** | Border light · "Hôm nay" · ~70% accuracy |
| **Milestone 2** | Border medium · "Sau 7 ngày" · ~85% |
| **Milestone 3** | Border 2px dark highlight · "Sau 30 ngày" · "như người thân trong nhà" |
| **Trust Badge** | Background #fff8f0 border #f0d8b0 · 🏛️ · trust copy |
| **CTA** | Dark pill "Bắt đầu 14 ngày dùng thử →" |
| **Legal** | "Không cần thẻ tín dụng · Mua 1 lần, dùng mãi" |

**Copywrite:**
- Title: `App sẽ học về gia đình bạn`
- M1: `Hôm nay` · `Gợi ý dựa trên thông tin vừa nhập. Chính xác khoảng 70% — hoàn toàn bình thường.`
- M2: `Sau 7 ngày` · `App nhớ thói quen, món đã chọn, món bị bỏ qua. Gợi ý đạt ~85%.`
- M3: `Sau 30 ngày` · `App hiểu gia đình bạn hơn bất kỳ công cụ nào — gợi ý như người thân trong nhà.`
- Trust: `Dữ liệu dinh dưỡng theo Bảng Thành Phần Thực Phẩm Việt Nam — Viện Dinh Dưỡng Quốc Gia (Bộ Y tế). Constraint bệnh lý không để AI tự suy luận.`
- CTA: `Bắt đầu 14 ngày dùng thử →`
- Legal: `Không cần thẻ tín dụng · Mua 1 lần, dùng mãi`

**Routes:** CTA → `S-05` (Trial Day 1, `onboarding_complete = true`)

---

## PHẦN 3 — DAILY CORE LOOP (S-05 → S-07)

---

### S-05 — Home (Chọn bữa)

**Route:** `/app/home` · **Bottom Nav: Hôm nay active**

| Component | Mô tả |
|---|---|
| **Meal Tabs** | 🌙 Tối · Đang plan (active) · 🌤 Trưa · ✓ Done · ☀️ Sáng · Tắt |
| **Ngày Chăm Sóc** | 🌱 SVG · "[N] ngày gia đình được chăm sóc" · *Hiện từ care_days ≥ 1. Add-only, không reset.* |
| **Progress** | "Bữa tối · [N] người" + "[X]/4 slots" · 4 pills (xanh done · dark active · light pending) |
| **Slot Indicator** | Background #f5f5f5 · "Đang chọn: **[slot_name]**" · dish type chip |
| **Memory Banner** | #f0f4f0 · 🧠 · "Dựa trên **[N] bữa** của gia đình bạn" · *Ẩn < 10 bữa* |
| **Tủ Lạnh Toggle** | Background #f7f7f7 border #e8e8e8 · SVG fridge icon (grey) · "Tủ lạnh hôm nay" · sub · Toggle OFF |
| **Swipe Card** | Border 1.5px · Food img 100px · Name bold · Health tags · time/cost · 🏛️ trust badge |
| **Action Buttons** | ✕ 32px outline · 💡 32px outline (defer) · ✓ 32px dark |
| **Đổi Loại Link** | "Không thích slot này? **Đổi loại**" |

**Copywrite:**
- Toggle: `Tủ lạnh hôm nay` · `Chọn nguyên liệu → app ưu tiên món nấu được ngay`
- Memory: `Dựa trên [N] bữa của gia đình bạn`
- Counter: `[N] ngày gia đình được chăm sóc`

**Routes:**
- ✓ swipe → advance slot · ✕ → next card · 💡 → defer
- Toggle → `S-05🧊BS`
- "Đổi loại" → `S-06c`
- All slots done → `S-07`
- Deck empty → `S-05e`

---

### S-05e — Empty Deck State

**Route:** `/app/home` (deck = 0)

| Component | Mô tả |
|---|---|
| **Progress** | Slot vấn đề = **amber #c97b2a** |
| **Empty Card** | Border dashed · SVG bowl · title · sub |
| **Escape 1** | "Mở rộng bộ lọc →" → bottom sheet: ☑ +15p · ☑ +30% ngân sách · ☑ Bỏ Tủ Lạnh *(không có health relax)* |
| **Escape 2** | "Đổi loại slot này" outline |
| **Escape 3** | "Nhập tên món thủ công" link |
| **Recap** | Background #f0faf5 · "✓ Đã chọn ([X]/4)" |

**Copywrite:**
- Title: `Đã xem hết món phù hợp cho slot [slot_name]`
- Sub: `Thử mở rộng điều kiện lọc, đổi loại slot, hoặc nhập tên món`

---

### S-05 + 🧊 — Tủ Lạnh Toggle (chưa bật)

S-05 gốc với toggle row ở trạng thái OFF được hiển thị rõ. Không phải state riêng về layout — chỉ là S-05 với toggle visible, chưa interact.

**Toggle row:** background #f7f7f7 border #e8e8e8 · icon grey · label "Tủ lạnh hôm nay" · sub · Toggle pill grey (OFF)

**Routes:** Tap toggle → `S-05🧊BS`

---

### S-05 🧊 BS — Tủ Lạnh Bottom Sheet

**Route:** `/app/home` (overlay)  
**v4.4 update:** NLP free-text input là primary. Chips là secondary/confirm path.

| Component | Mô tả |
|---|---|
| **Dimmed BG** | S-05 opacity 0.35 |
| **Bottom Sheet** | Background #fff · br-14px 14px 0 0 · drag handle 32×3px |
| **Header** | SVG fridge + "Hôm nay tôi có..." bold · sub "Gõ hoặc chọn — app hiểu cả hai" · ✕ close |
| **NLP Text Field** | Background #f7f7f7 · border 1.5px terracotta (#D9622B) · br-10px · padding 8px 10px · SVG search icon terracotta left · placeholder italic "nửa con gà, cà chua, mấy quả trứng..." · spinner 10px right (visible khi đang parse) |
| **NLP Result Row** | Hiện ngay dưới field sau khi parse xong · SVG check xanh · Label "Đã nhận ra:" · Auto-selected chips (dark) + amber chips confidence <0.7 |
| **Amber Chip** | Background #fffbeb · border #f5d89a · text #c97b2a · label "? [tên nguyên liệu]" · tap để xác nhận hoặc bỏ qua |
| **Divider** | "─── hoặc chọn nhanh bên dưới ───" text #bbb centered |
| **Chip Group 1** | "THỊT · CÁ · HẢI SẢN" label uppercase muted · selected dark: Thịt heo ✓ · Tôm ✓ · unselected outline: Cá lóc · Thịt gà · Thịt bò · Cá hồi |
| **Chip Group 2** | "RAU · CỦ · ĐẬU" · selected: Cà chua ✓ · Đậu hũ ✓ · unselected: Khoai tây · Bí đỏ · Cải xanh |
| **Chip Group 3** | "TRỨNG · KHÁC" · selected: Trứng gà ✓ · unselected: Trứng vịt · "🔍 Thêm khác..." (dashed, search inline) |
| **Counter + CTA** | "Đã chọn **[N] nguyên liệu**" · "Áp dụng →" dark pill |

**NLP parse states:**

| State | Visual |
|---|---|
| **Idle** | Text field — no spinner, placeholder visible |
| **Parsing** | Spinner rotating terracotta (debounce 600ms sau khi stop typing) |
| **Result** | Spinner ẩn · Result row hiện · Chips auto-selected |
| **LLM fail** | Spinner ẩn silently · Chips vẫn dùng bình thường · Không báo lỗi |

**Chip states:** Selected = background #1a1a1a text white. Unselected = white background border #ddd. Amber (NLP unsure) = #fffbeb border #f5d89a text #c97b2a. Search = #f7f7f7 border dashed.

**NLP + chip interaction:** Kết quả parse merge với chips đã tap tay — không override. Type thêm → re-parse → add vào selection hiện tại.

**Copywrite:**
- Title: `Hôm nay tôi có...`
- Sub: `Gõ hoặc chọn — app hiểu cả hai`
- Placeholder: `nửa con gà, cà chua, mấy quả trứng...`
- Result label: `Đã nhận ra:`
- Amber hint: `Vàng = chưa chắc — tap để xác nhận hoặc bỏ qua`
- Divider: `hoặc chọn nhanh bên dưới`
- Group labels: `THỊT · CÁ · HẢI SẢN` · `RAU · CỦ · ĐẬU` · `TRỨNG · KHÁC`
- Counter: `Đã chọn [N] nguyên liệu`
- CTA: `Áp dụng →`

**Routes:** "Áp dụng →" → `S-05🧊RS`

---

### S-05 🧊 RS — Deck Re-sorted (Tủ Lạnh Active)

**Route:** `/app/home` (Tủ Lạnh ON state)

**Deltas so với S-05:**

| Component | Delta |
|---|---|
| **Toggle Row** | Background #f0f4f0 border #c8dfc8 · icon fridge **xanh** · "🧊 Tủ lạnh: BẬT" green bold · sub = tên 5 nguyên liệu · Toggle ON (green) |
| **Result count** | "**[N] món nấu được ngay** · [M] món mua thêm ít" |
| **Swipe Card — Tầng 0** | Border #c8dfc8 · delta pill: background #e8f5e8 border #c0dfc0 · "✓ Nấu được ngay — đủ nguyên liệu" green |
| **Preview Card — Tầng 1** | Opacity 0.7 scale(0.96) peeking · delta: "Mua thêm: [tên nguyên liệu]" amber |

**Tầng logic:**
- Tầng 0: ≥ 80% nguyên liệu bắt buộc → green pill
- Tầng 1: thiếu đúng 1 nguyên liệu → amber pill + tên
- Tầng 2+: ẩn khỏi deck
- Health filter vẫn cứng bất kể Tủ Lạnh mode

**Copywrite:**
- Toggle: `🧊 Tủ lạnh: BẬT` · `[item1] · [item2] · [item3]...`
- Count: `[N] món nấu được ngay · [M] món mua thêm ít`
- Tầng 0: `✓ Nấu được ngay — đủ nguyên liệu`
- Tầng 1: `Mua thêm: [tên nguyên liệu]`

---

### S-06 — Swipe Mid-session

**Route:** `/app/home` (after ≥ 1 slot done)

Giống S-05 nhưng có thêm **Done Slots Recap:** background #f0faf5 · "✓ Đã chọn" · flex row thumbnails các món đã chọn.

---

### S-06c — Đổi Loại Slot (Inline Override)

**Route:** `/app/home` (bottom sheet)

| Component | Mô tả |
|---|---|
| **Header** | "Đổi slot này thành loại khác?" · "Swipe deck sẽ cập nhật ngay" |
| **Type List** | 🍜 Canh/Súp (active ✓) · 🍖 Món mặn thêm · 🥦 Rau/Củ · 🥗 Salad/Gỏi |
| **Delete** | Background #fce8e8 · "✕ Bỏ slot này luôn" đỏ |
| **Cancel** | Ghost "Huỷ — giữ nguyên [slot_name]" |

---

### S-07 — Meal Summary

**Route:** `/app/summary`

| Component | Mô tả |
|---|---|
| **Header** | "🌙 Bữa tối hôm nay" · "[N] người · ~[N] phút · ~[N]k" |
| **Slot Cards** | Per slot: badge header (Mặn orange · Canh blue · Rau green) · thumbnail · name · meta · "Nấu ngay" xs |
| **Starch** | Dashed · "🍚 Cơm (tự động)" · "Cơm trắng" · "Đổi" |
| **Primary CTA** | "🍳 Bắt đầu nấu" dark |
| **Phase 2 hidden** | "📦 Gọi món" |

**Routes:**
- Per dish "Nấu ngay" → `S-08a?return=summary`
- "Bắt đầu nấu" → `S-08a?sequential=true`

---

### S-07 🧊 — Meal Summary Tủ Lạnh Variant

**Route:** `/app/summary` (Tủ Lạnh active)

**Delta:** Thêm **Ingredient Panel** sau slot cards:

| Component | Mô tả |
|---|---|
| **Panel Header** | "Nguyên liệu cần cho bữa tối" · Badge "Cần mua: [N] thứ" (background #e8f5e8 text xanh) |
| **Group 1 — Đã có** | Label "✓ Đã có trong tủ" muted uppercase · Items: `text-decoration:line-through` màu #bbb + SVG check · qty right-aligned |
| **Group 2 — Cần mua** | Label "🛒 Cần mua thêm" amber · Items: background #fff8f0 border #f0e0c0 · amber dot · bold text · qty |

**Sample items đã có:** Trứng gà · Cà chua · Thịt heo · Dầu ăn · Muối · Tiêu  
**Sample cần mua:** Nước dừa 200ml · Hành tím 3 củ · Tỏi 1 củ

---

## PHẦN 4 — RECIPE & COOKING (S-08a → S-09n)

---

### S-08a — Recipe Hero + Nguyên Liệu

**Route:** `/app/recipe/[dish_id]`

| Component | Mô tả |
|---|---|
| **Hero** | Full-bleed 106px · gradient overlay · ← back circle · ↗ share circle |
| **Slot Badge** | Overlay "🍜 CANH · 3/4" |
| **Dish + Meta** | Text trắng overlay · pills ⏱ · 👥 · 💰 |
| **Health Fit** | "PHỤC HỢP VỚI GIA ĐÌNH" · tags ✓ xanh / ⚠ vàng |
| **Wavy Divider** | `~ ~ ~ ~ ~` |
| **Ingredients** | Border 1.5px · floating label "NGUYÊN LIỆU" · 2-col grid |
| **CTA Bar** | "Bắt đầu nấu" primary + "Đổi món" outline · sticky |

---

### S-08b — Cách Nấu

| Component | Mô tả |
|---|---|
| **Label** | "CÁCH NẤU" uppercase |
| **Step Timeline** | 1px connector · done ✓ filled · active bold outlined · pending muted |
| **Timer** | Inline pill per active step |
| **Nutrition** | 4-col: Kcal · Protein · Carb · Fat |

---

### S-08c — Mẹo Nhỏ + Similar

| Component | Mô tả |
|---|---|
| **Tips Card** | "MẸO NHỎ" floating label · bullets · Personalised tip (#f5f5f5 bg + "Personalized · [member]" tag) |
| **Similar** | "GỢI Ý THÊM" · "← kéo để xem →" · horizontal scroll |
| **Disclaimer** | "LƯU Ý" floating label |

---

### S-08d — Cooking Mode

*Screen stay-awake active.*

| Component | Mô tả |
|---|---|
| **Black Header** | #1a1a1a · dish name white · "11:24" monospace large |
| **Timer Controls** | ⏸ · ▶ filled · ↺ |
| **Active Step** | Background #f5f5f5 · "BƯỚC ĐANG LÀM" · step text |
| **Step List** | Done opacity 0.4 · current bold · pending opacity 0.3 |
| **CTA Bar** | "✓ Xong bước [N]" primary · "← Lùi" outline · "Thoát nấu" text link small |

**Exit dialog:** `Thoát chế độ nấu? Tiến trình sẽ không được lưu.`

**Routes:** Last step → `S-09` · "Thoát" → confirm → `S-07`

---

### S-09 — Bữa Hoàn Thành

**Route:** `/app/complete`

| Component | Mô tả |
|---|---|
| **Header** | "Gia đình được chăm sóc hôm nay." · sub date/người/thời gian |
| **Dish Grid 2×2** | 4 thumbnails 50px + tên |
| **Rating** | "Bữa này thế nào?" · 👎 · 😐 · ❤️ (optional) |
| **Memory Block** | #f0f4f0 · 🧠 · "[N] bữa" · "[N] món không gợi lại 5 ngày" |
| **Care Counter** | #f7faf7 · 🌱 · "[N] ngày chăm sóc" · Recognition copy dynamic |
| **CTA Row** | "Về trang chủ →" · "↗ Chia sẻ" |
| **Trial Note** | Day 8-13: "Còn [N] ngày — khi sẵn sàng, giữ cho gia đình nhé →" |

**Copywrite:**
- Title: `Gia đình được chăm sóc hôm nay.`
- Memory: `Đã ghi nhớ · [N] bữa của gia đình` · `[N] món hôm nay không gợi ý lại trong 5 ngày.`
- Recognition (example): `Bữa hôm nay phù hợp Ba — không có món nào cần tránh 🌿`

**Routes:** → `S-05` · First time → overlay `S-09n`

---

### S-09n — Notification Opt-in

**Route:** Overlay trên `S-09` (first completion only)  
*Skip if `Notification.permission == "granted"`*

| Component | Mô tả |
|---|---|
| **Sheet** | br-14px 14px 0 0 · drag handle · blurred BG |
| **Icon** | SVG alarm 18px |
| **Title** | "Muốn nhắc lúc [HH:MM] không?" dynamic |
| **Sub** | Giải thích, có thể tắt |
| **CTA** | "Nhắc tôi lúc [HH:MM] mỗi tối" dark |
| **Dismiss** | "Thôi được, cảm ơn" |

---

## PHẦN 5 — SETTINGS & HISTORY

---

### S-10 — Lịch Sử Bữa Ăn

**Route:** `/app/history` · **Bottom Nav: Cài đặt active**

| Component | Mô tả |
|---|---|
| **Header** | "Lịch sử" · "Bữa ăn đã nấu" |
| **Filters** | Tất cả · Tuần này · Tháng này |
| **Entry Cards** | Date + meal type · 4 thumbnails · rating emoji · meta |
| **Empty** | "Bạn chưa có bữa ăn nào — hãy bắt đầu nhé!" |

---

### S-11 — Settings List (Mobile)

**Route:** `/app/settings` · **Bottom Nav: Cài đặt active**

| Component | Mô tả |
|---|---|
| **Header** | "Cài đặt" |
| **Profile** | Avatar · name + email · › |
| **Gia đình section** | Thành viên & sức khoẻ · Bếp & Ngân sách |
| **Bữa ăn section** | Lịch bữa ăn · Cấu trúc bữa · Lịch sử bữa ăn |
| **Tài khoản section** | Thông tin cá nhân · Gói dịch vụ (amber upsell) |

**Routes:** Each row → respective W-03..06 / S-10 / S-12c · Bottom nav "Gia đình" → W-03 direct  
Row "Thông tin cá nhân" → **S-11p**

---

### S-11p — Edit Profile (Thông Tin Cá Nhân)

**Route:** `/app/settings/profile`  
**Entry:** S-11 Settings → row "Thông tin cá nhân"  
**Layout:** Full-screen overlay · max-width 390px · background `--bg #FEF8F1` · scroll  
**Save model:** Optimistic update on tap "Lưu" → `PUT /api/user/profile` → success toast · no auto-save / no live sync

---

#### Top Bar

| Component | Spec |
|---|---|
| **Left** | `←` back arrow 20px `--text-2` → tap → S-11 (discard unsaved changes, no confirm dialog) |
| **Center** | `"Thông tin cá nhân"` · font 15px semibold · `--text-1` |
| **Right** | `"Lưu"` text button · font 14px semibold · `--primary #D9622B` · disabled (grey `--text-2`) until any field changes · tap → save flow |

---

#### Avatar Section

`padding: 24px 0 20px` · `text-align: center`

| Component | Spec |
|---|---|
| **Avatar circle** | 72×72px · `border-radius: 50%` · `border: 2px solid --border #EAD8C8` · shows `avatar_url` if set · falls back to initial circle (first char of `display_name`, background `--surface-alt #F7EDE0`, `--text-2` 28px) |
| **Edit badge** | 22×22px circle · background `--primary #D9622B` · white pencil SVG 10px · `position: absolute bottom-0 right-0` on avatar container |
| **Edit label** | `"Đổi ảnh"` · font 11px · `--text-2` · `margin-top: 6px` |

**Tap avatar or badge → upload flow:**
1. Native OS bottom sheet: "Chọn từ thư viện" · "Chụp ảnh" · "Huỷ"
2. Image selected → client-side crop modal: square 1:1 · min 200×200px
3. Confirm crop → `POST /api/user/avatar` (multipart/form-data, `file: Blob`) → server resizes to 200×200px WebP → uploads to R2 at `avatars/{user_id}.webp` → returns `{avatar_url}`
4. Optimistic: show cropped preview immediately in circle before upload completes
5. On error: revert to previous avatar · toast `"Tải ảnh không thành công — thử lại nhé"`

**Constraints:** Max file size 5MB · accepted formats: jpg, png, webp, heic · server enforces; client shows `"Ảnh tối đa 5MB"` if exceeded

---

#### Form Fields

`padding: 0 16px` · `display: flex flex-col gap: 20px`

**Field row base:** label + input stacked · `gap: 6px`

| Field | Label | Input type | Editable? | Note |
|---|---|---|---|---|
| `display_name` | `"Tên hiển thị"` | Text input | ✅ Always | Max 40 chars · placeholder `"Tên của bạn"` |
| `email` | `"Email"` | Text input | Auth-dependent — see below | |
| `phone` | `"Số điện thoại"` | Text input | Auth-dependent — see below | |

**Email editability by auth_provider:**
- `auth_provider = 'google'` → `email` read-only · show `"Đăng nhập qua Google"` lock badge right of field · font 10px `--text-2`
- `auth_provider = 'facebook'` → `email` read-only · show `"Đăng nhập qua Facebook"` lock badge
- `auth_provider = 'phone'` → `email` editable · standard text input · validation: valid email format on save

**Phone editability by auth_provider:**
- `auth_provider = 'phone'` → read-only · show `"Số đăng ký"` lock badge · phone is identity — cannot change in-app
- `auth_provider = 'google'` or `'facebook'` → editable · optional field · placeholder `"Tuỳ chọn"` · format: VN phone (+84 or 0xxx)
- Phone field hidden entirely if `auth_provider = 'phone'` AND no alternative contact needed

**Input field style (editable):**
- background `--surface #FFFDF9` · border `1px solid --border #EAD8C8` · `border-radius: 8px` · `padding: 10px 12px`
- focus: border `1px solid --border-accent #D9622B` · no shadow
- font 14px · `--text-1`
- error state: border `#E05C5C` · error message below in 11px `#E05C5C`

**Input field style (read-only):**
- background `--surface-alt #F7EDE0` · border `1px solid --border #EAD8C8` · `border-radius: 8px` · `padding: 10px 12px`
- font 14px · `--text-2` · `cursor: default`

---

#### Validation

| Field | Rule | Error message |
|---|---|---|
| `display_name` | Required · min 1 char · max 40 chars | `"Vui lòng nhập tên"` / `"Tên tối đa 40 ký tự"` |
| `email` (if editable) | Valid email format | `"Email không hợp lệ"` |
| `phone` (if editable) | VN format: starts with 0 or +84 · 9–10 digits after prefix | `"Số điện thoại không hợp lệ"` |

Validation fires on blur (leave field) + on "Lưu" tap. "Lưu" button stays disabled if any validation error active.

---

#### Save Flow

**"Lưu" tap:**
1. Run validation — stop if error
2. "Lưu" button → loading spinner 14px · non-interactive
3. `PUT /api/user/profile {display_name?, email?, phone?}` (only changed fields sent)
4. Success → toast `"Đã lưu"` bottom center · auto-dismiss 2s · navigate back → S-11
5. Error `409` (email taken) → inline error on email field `"Email này đã được dùng"`
6. Error `500` → toast `"Lưu không thành công — thử lại nhé"` · button re-enables

---

#### Danger Zone

`margin-top: 32px` · `padding: 0 16px 40px`

| Component | Spec |
|---|---|
| **Section label** | `"Tài khoản"` · font 11px semibold uppercase letter-spacing 0.1em · `--text-2` · `margin-bottom: 12px` |
| **Delete row** | Text `"Xoá tài khoản"` · font 14px · `#E05C5C` (destructive red) · no icon · tap → confirmation modal |

**Delete confirmation modal:**
- Title: `"Xoá tài khoản?"` · font 16px bold `--text-1`
- Body: `"Toàn bộ dữ liệu gia đình, lịch sử bữa ăn và gói dịch vụ sẽ bị xoá vĩnh viễn trong 30 ngày."` · font 13px `--text-2` line-height 1.6
- Confirm button: `"Xoá tài khoản"` · background `#E05C5C` · white text · full-width
- Cancel: `"Huỷ"` · ghost · `--text-2`
- Confirm tap → `DELETE /api/user/account {confirm: true}` → sets `account_deletion_requested_at` → toast `"Yêu cầu xoá đã được ghi nhận"` → sign out → redirect `/` landing

---

#### Copywrite

```
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
```

**Routes:**
- `←` back → S-11 (discard)
- "Lưu" success → S-11
- "Xoá tài khoản" confirm → sign out → `/` landing

---



## PHẦN 6 — TRIAL & PAYWALL

---

### S-12a — Trial Ribbon (Day 11–14)

Overlay trên S-05. Background #fffbf0 border-bottom #f5e6c0.

**Copy:** `Còn [N] ngày dùng thử — khi sẵn sàng, giữ cho gia đình nhé` · Button `Nâng cấp →` amber

---

### S-12b — Soft Nudge Modal (Day 12, 1×)

| Component | Mô tả |
|---|---|
| **Title** | "Còn [N] ngày dùng thử" |
| **Body** | "[N] ngày qua — gia đình có bữa đàng hoàng [N] lần. Không phải ngẫu nhiên đâu." |
| **Price Anchor** | "Chỉ từ" · "7.000đ" large · "mỗi ngày · rẻ hơn 1 ly trà đá" |
| **Pricing** | Lifetime 2.990k · 12 tháng 1.690k "PHỔ BIẾN" · 6 tháng 990k |
| **CTA** | "Chọn gói — trả một lần →" |
| **Dismiss** | "Nhắc tôi sau" |

---

### S-12c — Hard Paywall (Day 15+)

**Route:** `/app/paywall`  
**Scroll:** Full-page vertical scroll. No bottom nav. No back button (`history.pushState` blocked — cannot swipe back).  
**Still accessible:** S-10 `/app/history` (via floating link, see below) · S-11 `/app/settings` (via top-right gear icon). Data không bị hostage.  
**Unblock:** Ngay sau khi `/api/payment/webhook` confirm — không cần reload. `subscription_status = 'active'` → redirect `/app/home`.

**Entry points:**
1. `trial_expired = true` (`created_at + 14 days < now()`) → hard redirect mọi `/app/*` route → `/app/paywall`
2. S-12a ribbon → "Nâng cấp →" button
3. S-11 Settings → row "Gói dịch vụ" → `/app/paywall`
4. W-03/W-04 Sidebar → "Gói dịch vụ" row

---

#### Layout — Trial Expired State (primary)

**Canvas:** background `--bg #FEF8F1` · max-width 390px · padding 0 16px 32px · scroll

**Top bar:**
- Left: empty (no back)
- Right: gear icon 20px `--text-2 #6B5447` → tap → S-11 Settings

**Hero section:** `text-align: center` · `padding-top: 28px`

| Component | Spec |
|---|---|
| **Lock icon** | SVG circle 44×44 · `background: --surface-alt #F7EDE0` · border 1.5px `--border #EAD8C8` · 🔒 emoji 20px centered |
| **Title** | `"Hết 14 ngày dùng thử miễn phí"` · Fraunces 20px bold · `--text-1 #1E1410` · `margin-top: 12px` |
| **History link** | `"Xem lại [N] bữa đã lên kế hoạch →"` · font 12px · `--text-2` · underline · tap → S-10 · `margin-top: 6px` |

---

**Value Anchor Block:** `margin-top: 16px` · `border-radius: 10px` · background `#F0FAF5` · border `1px solid #C0DFC0` · `padding: 14px 16px` · `text-align: center`

| Element | Spec |
|---|---|
| **Label** | `"14 ngày qua, gia đình bạn đã có"` · font 11px · color `#3A7A5A` · `margin-bottom: 6px` |
| **Count** | `"{suggestions_received} gợi ý"` · Fraunces 32px bold · `--text-1` · line-height 1 |
| **Sub** | `"trong đó {health_filtered_count} món tự lọc vì bệnh lý {health_member_label}"` · font 11px · color `#3A7A5A` · `margin-top: 4px` |

**Data variables:**
- `{suggestions_received}` = `COUNT(swipe_events WHERE user_id = auth.uid())` — total cards served during trial
- `{health_filtered_count}` = dishes where `health_result.action IN ('adapt','caution')` that user was shown — fetch from `/api/rewards/care-days` response or paywall-specific endpoint
- `{health_member_label}` = first health_condition member's role label (e.g. "Ba" / "Mẹ" / "bé") — falls back to `"gia đình"` if no health conditions set
- Sub line hidden entirely if `health_filtered_count = 0`

---

**Per-day Price Hero:** `margin-top: 14px` · `border-radius: 10px` · background `--surface-alt #F7EDE0` · `padding: 12px 16px` · `text-align: center`

| Element | Spec |
|---|---|
| **Label** | `"Tiếp tục từ"` · font 11px · `--text-2` |
| **Price** | `"4.600đ"` · Fraunces 28px bold · `--text-1` · line-height 1 · `margin: 4px 0` |
| **Sub** | `"mỗi ngày · rẻ hơn 1 ly trà đá ☕"` · font 11px · `--text-2` |

> `4.600đ` = hardcoded to cheapest per-day rate (12-month plan). Not dynamically computed at render — content team owns this string.

---

**Plan Options:** `margin-top: 14px` · `display: flex flex-col gap-8px`

**Plan option row base:** `border-radius: 8px` · `padding: 10px 14px` · `display: flex justify-between align-center` · `cursor: pointer` · `position: relative`

| Plan | Default state | Border | Badge |
|---|---|---|---|
| 6 tháng | Unselected | `1px solid --border #EAD8C8` | None |
| 12 tháng | **Selected** | `2px solid --text-1 #1E1410` | "PHỔ BIẾN" — `#1E1410` bg · `#fff` text |
| Lifetime | Unselected | `1px solid --border #EAD8C8` | "DÙNG MÃI MÃI" — `#C97B2A` bg · `#fff` text |

**Badge style (both):** `position: absolute top: -8px right: 10px` · `border-radius: 100px` · font 9px · font-weight 700 · letter-spacing 0.05em · `padding: 2px 8px`

**Plan row — left column:**

| Plan | Line 1 | Line 2 |
|---|---|---|
| 6 tháng | `"≈5.5k / ngày"` · font 12px semibold · `--text-1` | `"6 tháng · 180 ngày"` · font 10px · `--text-2` |
| 12 tháng | `"≈4.6k / ngày"` · font 12px bold · `--text-1` | `"12 tháng · 365 ngày"` · font 10px · `--text-2` |
| Lifetime | `"Lifetime"` · font 12px semibold · `--text-1` | `"Trả một lần — không bao giờ gia hạn"` · font 10px · `--text-2` |

**Plan row — right column (price):**

| Plan | Price | Strikethrough |
|---|---|---|
| 6 tháng | `"990k"` · font 14px bold · `--text-1` | None |
| 12 tháng | `"1.690k"` · font 14px bold · `--text-1` | `"2.400k"` · font 10px · `--text-2` · `text-decoration: line-through` |
| Lifetime | `"2.990k"` · font 14px bold · `--text-1` | `"4.200k"` · font 10px · `--text-2` · `text-decoration: line-through` |

**Selection interaction:**
- Tap any row → row becomes selected (border 2px `--text-1`) · previous selection reverts to 1px `--border`
- CTA button copy and sub-copy update immediately to reflect selected plan (see CTA spec below)
- Default on load: 12 tháng selected

---

**Social Proof Block:** `margin-top: 14px` · `border-radius: 8px` · background `--surface-alt #F7EDE0` · `padding: 12px 14px`

| Element | Spec |
|---|---|
| **Stars** | `⭐⭐⭐⭐⭐` · font 11px · `margin-bottom: 4px` |
| **Quote** | `"Không còn phải nghĩ chiều nay ăn gì nữa"` · font 12px · italic · `--text-1` · line-height 1.5 |
| **Attribution** | `"— Lan Anh, TP.HCM · dùng được 2 tháng"` · font 10px · `--text-2` · `margin-top: 3px` |

---

**CTA Button:** `margin-top: 16px` · `border-radius: 8px` · background `--text-1 #1E1410` · `padding: 14px 16px` · `text-align: center` · `cursor: pointer`

| Element | Spec |
|---|---|
| **Line 1** | Dynamic — see table below · font 13px bold · `#FFFDF9` |
| **Line 2** | Dynamic — see table below · font 11px · `rgba(255,255,255,0.55)` · `margin-top: 3px` |

**CTA dynamic copy by selected plan:**

| Selected plan | Line 1 | Line 2 |
|---|---|---|
| 6 tháng | `"Mua gói 6 tháng — trả một lần"` | `"990.000đ · không tự gia hạn"` |
| 12 tháng (default) | `"Mua gói 12 tháng — trả một lần"` | `"1.690.000đ · không tự gia hạn"` |
| Lifetime | `"Mua Lifetime — trả một lần, dùng mãi"` | `"2.990.000đ · không bao giờ gia hạn"` |

**Tap CTA:** → `POST /api/payment/create-order {plan_type}` → redirect to `checkout_url` (PayOS hosted) → on return: `GET /api/payment/callback` → if success → S-12d · if fail → stay on S-12c, toast `"Thanh toán chưa thành công — thử lại nhé"`

**CTA loading state:** Button background dims to `#444` · spinner 16px white center · copy hidden · non-interactive until callback resolves

---

**Legal line:** `margin-top: 8px` · `text-align: center` · font 10px · `--text-2` · line-height 1.6

`"Không tự gia hạn · thanh toán qua PayOS"`

---

#### Layout — Paid State (S-11 entry after purchase)

When `subscription_status = 'active'` AND entry point is S-11 Settings → "Gói dịch vụ" (not a hard gate redirect):

Replace pricing grid, value anchor, and CTA entirely with:

| Component | Spec |
|---|---|
| **Status badge** | `border-radius: 8px` · background `#F0FAF5` · border `1px solid #C0DFC0` · `padding: 14px` · center-aligned |
| **Badge icon** | `✓` emoji or SVG checkmark 24px · color `#3A7A5A` |
| **Status label** | `"Gói đang hoạt động"` · font 13px bold · `--text-1` · `margin-top: 6px` |
| **Plan name** | `"Gói {plan_name} · Hết hạn {expiry_date}"` · font 12px · `--text-2` |
| **Expiry format** | `DD/MM/YYYY` — or `"Không hết hạn"` if `expires_at = NULL` (Lifetime) |
| **Renew row** | Only shown if `expires_at IS NOT NULL AND expires_at < now() + 30 days` · `"Mua gia hạn →"` · font 12px · `--text-1` · underline · tap → replaces status block with pricing grid |
| **Back link** | `"← Quay lại Cài đặt"` · font 12px · `--text-2` · tap → S-11 |

---

#### Renewal State (≤ 30 days before expiry — S-12a ribbon re-activation)

S-12a ribbon on S-05 reappears with copy:  
`"Còn {N} ngày · gia hạn để không bị gián đoạn"` → button "Gia hạn →" → S-12c paid state → "Mua gia hạn" → pricing grid → user can choose any plan (not forced same plan)

---

**Copywrite — full string list:**

```
Lock title:       "Hết 14 ngày dùng thử miễn phí"
History link:     "Xem lại {total_meals_completed} bữa đã lên kế hoạch →"
Value label:      "14 ngày qua, gia đình bạn đã có"
Value count:      "{suggestions_received} gợi ý"
Value sub:        "trong đó {health_filtered_count} món tự lọc vì bệnh lý {health_member_label}"
Price hero label: "Tiếp tục từ"
Price hero price: "4.600đ"
Price hero sub:   "mỗi ngày · rẻ hơn 1 ly trà đá ☕"
Quote:            "Không còn phải nghĩ chiều nay ăn gì nữa"
Attribution:      "— Lan Anh, TP.HCM · dùng được 2 tháng"
CTA 6m line1:     "Mua gói 6 tháng — trả một lần"
CTA 6m line2:     "990.000đ · không tự gia hạn"
CTA 12m line1:    "Mua gói 12 tháng — trả một lần"
CTA 12m line2:    "1.690.000đ · không tự gia hạn"
CTA LT line1:     "Mua Lifetime — trả một lần, dùng mãi"
CTA LT line2:     "2.990.000đ · không bao giờ gia hạn"
Legal:            "Không tự gia hạn · thanh toán qua PayOS"
Error toast:      "Thanh toán chưa thành công — thử lại nhé"
Paid status:      "Gói đang hoạt động"
Paid plan:        "Gói {plan_name} · Hết hạn {expiry_date}"
Paid lifetime:    "Gói Lifetime · Không hết hạn"
Renew ribbon:     "Còn {N} ngày · gia hạn để không bị gián đoạn"
```

**Routes:**
- Top-right gear → S-11 Settings (always accessible)
- History link → S-10 Lịch sử (always accessible)
- CTA tap → PayOS checkout → return → S-12d (success) | S-12c (fail, toast)
- Hard gate unblock → `/app/home` S-05 (no S-12d if triggered from non-expired paid entry)

---

### S-12d — Post-Purchase Success

| Component | Mô tả |
|---|---|
| **Icon** | ✓ circle 44×44 border 2px |
| **Title** | "Từ hôm nay, gia đình được chăm sóc lâu dài hơn rồi." |
| **Body** | "Gói [N tháng] đã kích hoạt. Hiệu lực đến [DD/MM/YYYY]." |
| **Receipt** | Background #f5f5f5 · Gói · Thanh toán · Hết hạn |
| **CTA** | "Về nhà với gia đình →" |
| **Legal** | "Biên lai đã gửi qua email" |

---

## PHẦN 7 — REWARDS

---

### S-R01 — Weekly Report Card

**Trigger:** Chủ Nhật 20:00 · ≥ 3 bữa

| Component | Mô tả |
|---|---|
| **Card** | Gradient #f0f4ef br-12px |
| **Week Label** | "Tuần [N] · Tháng [M]/[YYYY]" uppercase xanh nhạt |
| **Primary** | Fraunces "5" 28px · "bữa đã plan cho gia đình" |
| **Secondary** | "[N] món distinct" · "[N] vi phạm bệnh lý" (green if 0) · "[N] ngày chăm sóc" |
| **Caption** | Editable · "✏ Chạm để chỉnh caption" |
| **Share** | "↗ Chia sẻ lên Facebook" · "Zalo" pill |
| **Auto-save** | "Lưu vào Sổ Gia Đình tự động →" |

**Caption template (no LLM):** `[N] bữa tuần [N] — [family_name] đang được chăm sóc đều đặn`

---

### S-R02 — Monthly Report Card

**Trigger:** Cuối tháng · ≥ 10 bữa. Server renders PNG → R2 (immutable).

| Component | Mô tả |
|---|---|
| **Card** | Gradient #f7f4ef → #eef5ee |
| **Primary** | Fraunces "[N]" · "ngày chăm sóc gia đình trong tháng" |
| **2×2 Grid** | [N] bữa đã plan · [N] món distinct · [N] vi phạm · [N] lần dùng Tủ Lạnh |
| **Top Dish** | "Món được chọn nhiều nhất tháng" · thumbnail + tên |
| **CTA** | "↗ Share" · "Sổ Gia Đình →" |

---

### S-R03 — Sổ Gia Đình Archive

**Route:** `/app/family-journal` · **Bottom Nav: Cài đặt active**  
*Ẩn cho đến tháng đầu tiên complete.*

| Component | Mô tả |
|---|---|
| **Header** | "Sổ Gia Đình" · "Nhật ký chăm sóc gia đình theo tháng" |
| **Current Month** | Border xanh nhạt · Fraunces number green · stats · ↗ |
| **Past Months** | Border neutral · muted |
| **Empty** | Dashed · "Cuối mỗi tháng, báo cáo gia đình được lưu tự động tại đây" |

---

## APPENDIX A — Route Map

```
hnag.vn (W-01)
├── Nav "Dinh Dưỡng" → W-07 (public)
├── Login CTAs → W-02a Auth Modal
│
├── New user → Onboarding
│   S-01 → S-01b → S-02 → S-03(×N) → S-04 → S-04b → /app/home
│
├── /app/home (S-05)
│   ├── Trial overlay S-12a (Day 11-14)
│   ├── Trial modal S-12b (Day 12)
│   ├── 🧊 Toggle → S-05🧊BS → S-05🧊RS
│   ├── Swipe: S-05 / S-06 → S-06c (slot override) / S-05e (empty)
│   └── All slots → S-07 (or S-07🧊)
│       └── Recipe: S-08a → S-08b → S-08c → S-08d
│           └── Done → S-09 → (first time) S-09n overlay
│
├── Bottom nav "Dinh Dưỡng" → W-07 (logged-in)
│   └── Article → W-07b
│
├── /app/settings (S-11)
│   ├── W-03 /settings/family
│   ├── W-04 /settings/kitchen
│   ├── W-05 /settings/schedule
│   ├── W-06 /settings/structure
│   ├── S-10 /app/history
│   ├── S-11p /app/settings/profile   ← Thông tin cá nhân
│   └── S-12c /app/paywall
│   ├── W-05 /settings/schedule
│   ├── W-06 /settings/structure
│   ├── S-10 /app/history
│   ├── S-12c /app/paywall
│   └── S-R03 /app/family-journal
│
├── S-12c (hard gate) → PayOS → S-12d → S-05
│
└── Rewards (server-triggered)
    S-R01 (Sun 20:00) · S-R02 (EOM) → S-R03 archive
```

---

## APPENDIX B — Bottom Nav States

| Tab | Active trên |
|---|---|
| Hôm nay | S-05, S-05e, S-05🧊*, S-06, S-06c, S-07, S-07🧊 |
| Dinh Dưỡng | W-07 logged-in, W-07b |
| Gia đình | W-03 mobile |
| Cài đặt | S-10, S-11, W-03..06, S-R03 |

---

## APPENDIX C — Responsive Rules

| Screen | Desktop ≥ 768px | Mobile < 768px |
|---|---|---|
| W-01 | Multi-column, nav full | Single col, sticky bottom CTA |
| W-02a | Modal overlay centered | Full-screen modal |
| W-03..06 | Sidebar left + content panel | Full-screen + ← back |
| W-07 | Magazine grid | Single col, horizontal scroll tabs |
| W-07b | Full-width article | Single col |
| All W | Same URL | Same URL · CSS breakpoint 768px |

---

## APPENDIX D — Copy Anti-Patterns

| ❌ Không dùng | ✅ Thay bằng |
|---|---|
| "Bạn đã hoàn thành bữa tối!" | "Gia đình được chăm sóc hôm nay." |
| "Được rồi! 🎉" | "Xong rồi." |
| "Bạn đã dùng app 18 ngày" | "18 ngày gia đình được chăm sóc" |
| "Streak" / badge / points | *(không dùng)* |
| Emoji trong UI elements | SVG icons |
| Mở đầu copy bằng "Bạn" | Bắt đầu bằng context / tên gia đình |

---

## APPENDIX E — Screen Count

| Nhóm | Count |
|---|---|
| Web landing + auth | 2 (W-01 unified, W-02a) |
| Settings webviews | 4 (W-03..06, each = 1 responsive component) |
| Dinh Dưỡng Blog | 4 (W-07 desktop, W-07 mob, W-07 logged-in, W-07b) |
| Onboarding | 6 (S-01, S-01b, S-02, S-03, S-04, S-04b) |
| Core loop | 5 (S-05, S-05e, S-06, S-06c, S-07) |
| Tủ Lạnh feature | 4 (S-05+🧊, S-05🧊BS, S-05🧊RS, S-07🧊) |
| Recipe + Cooking | 4 (S-08a..d) |
| Completion | 2 (S-09, S-09n) |
| Settings + History | 2 (S-10, S-11) |
| Paywall | 4 (S-12a..d) |
| Rewards | 3 (S-R01..03) |
| **Total** | **40** |

---

*HNAG Screen Specs v1.4 · Sync với wireframes-pwa-v4.4 · Internal Use Only · hnag.vn*
