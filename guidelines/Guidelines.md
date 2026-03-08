# Hôm Nay Ăn Gì? — Design System Guidelines
## For Figma Make · v2.0 · Q1 2025

> **Product:** "Hôm Nay Ăn Gì?" (HNAG) — Vietnamese AI-powered family meal planning PWA  
> **Aesthetic direction:** Flat · Feminine · Editorial · Non-techy  
> **Reference aesthetic:** Food Mood app — warm, cream-based, SVG icons only, no shadow, no emoji  

---

## 1. Design Principles (Non-Negotiable)

These 5 principles govern every design decision. Apply them before choosing any token.

1. **Flat, always.** Depth is created by border color variation and background contrast — never by box-shadow (except overlays/modals).
2. **Single accent rule.** Every interactive element uses terracotta primary `#D9622B`. Sage green is for health indicators only. Gold is for premium badges only. Nothing else.
3. **No emoji.** 100% SVG icons — stroke 1.5px, rounded linecap, `currentColor`. Emoji break visual consistency and look unfinished.
4. **Warm, not sterile.** No pure white, no cool gray, no blue. All surfaces are warm cream-based.
5. **Feminine, editorial.** Fraunces serif for display/headings gives editorial warmth. Be Vietnam Pro for UI keeps it readable on mobile.

---

## 2. Color Tokens

### 2.1 Full Token Reference

```
/* BACKGROUNDS */
--color-bg:              #FEF8F1   /* Warm cream — primary app canvas */
--color-surface:         #FFFDF9   /* Card / panel background */
--color-surface-alt:     #F7EDE0   /* Input fields, muted sections */
--color-surface-warm:    #FDF3E3   /* Highlighted section background */

/* PRIMARY — Terracotta */
--color-primary:         #D9622B   /* ALL interactive actions — buttons, active states, CTAs */
--color-primary-hover:   #BF5024   /* Pressed / hover state */
--color-primary-light:   #FAEAE0   /* Tag backgrounds, tints */
--color-primary-border:  #F0CBBA   /* Tint borders, active card borders */

/* HEALTH — Sage Green (restricted use only) */
--color-health:          #5A8A6A   /* Health safety indicators ONLY — never for actions or navigation */
--color-health-light:    #E8F2EC
--color-health-border:   #C0DACA

/* SEMANTIC */
--color-gold:            #C9933A   /* Premium badge ONLY — not for actions */
--color-warn:            #C97B2A   /* Caution state */
--color-warn-light:      #FEF3E2
--color-warn-border:     #F0D5A0
--color-error:           #C04030   /* Error state — never decorative */
--color-error-light:     #FAEAE8

/* TEXT */
--color-text-primary:    #1E1410   /* Warm near-black — headings, primary body */
--color-text-secondary:  #6B5447   /* Muted warm brown — supporting text */
--color-text-disabled:   #B09A8C   /* Disabled / placeholder */

/* BORDERS */
--color-border:          #EAD8C8   /* Default divider */
--color-border-strong:   #D4B8A5   /* Selected state, section dividers */
--color-border-accent:   #D9622B   /* Active / accent border */
```

### 2.2 Color Usage Rules (Enforce Strictly)

| Context | ❌ Never | ✅ Always |
|---|---|---|
| CTA / primary button | `#1a1a1a` near-black | `--color-primary` `#D9622B` |
| Active nav tab indicator | Black border | `#D9622B` border-bottom |
| Trial / urgency ribbon | Amber / gold | `--color-primary` — trial = action |
| Memory engine banner | Green tint `#f0f4f0` | `--color-surface-alt` — neutral |
| Health indicators | Primary terracotta | `--color-health` `#5A8A6A` |
| Premium badge | Terracotta | `--color-gold` `#C9933A` |
| Any decoration | Multi-accent / blue / cool gray | Warm palette only |
| Streak counter | 🔥 emoji | SVG flame icon, `--color-primary` |
| Section labels | Emoji + dark text | SVG icon + `#D9622B` text, uppercase |

### 2.3 Depth Hierarchy (Border-Based, No Shadow)

| Level | Usage | Background | Border |
|---|---|---|---|
| 0 | App canvas | `#FEF8F1` | None |
| 1 | Card / panel | `#FFFDF9` | `1px #EAD8C8` |
| 2 | Input / muted area | `#F7EDE0` | `1px #D4B8A5` |
| 3 | Active / selected | `#FAEAE0` | `1px #F0CBBA` |
| Overlay only | Bottom sheet / modal | — | `box-shadow: 0 -4px 32px rgba(30,20,16,0.10)` |

> **Shadow rule:** `box-shadow` appears only on bottom sheets and modals. Banned everywhere else.

---

## 3. Typography

### 3.1 Font Stack

```
--font-display: "Fraunces", Georgia, serif
--font-body:    "Be Vietnam Pro", "Helvetica Neue", sans-serif
--font-mono:    "Be Vietnam Pro", sans-serif  /* No separate mono — use letter-spacing instead */
```

Google Fonts import:
```
Fraunces: ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600
Be Vietnam Pro: ital,wght@0,400;0,500;0,600;1,400
subset=vietnamese
```

### 3.2 Type Scale

| Role | Font | Size | Weight | Color | Usage |
|---|---|---|---|---|---|
| Display | Fraunces | 36px | 600 | `--color-text-primary` | Dish names on swipe card, screen hero title |
| Heading | Fraunces | 22px | 600 | `--color-text-primary` | Section headers, meal summary |
| Subhead | Be Vietnam Pro | 17px | 600 | `--color-text-primary` | Card title, sub-headings |
| Body | Be Vietnam Pro | 15px | 400 | `--color-text-secondary` | Descriptions, body text |
| Label | Be Vietnam Pro | 10px | 500 | `--color-primary` | Section labels — uppercase + `letter-spacing: 0.14em` |
| Meta | Be Vietnam Pro | 12px | 400 | `--color-text-secondary` | Tags, health indicators, timestamps |

### 3.3 Typography Rules

- **"Mono" feel** is achieved with Be Vietnam Pro + `letter-spacing: 0.12–0.15em` + `text-transform: uppercase`. No separate monospace font needed.
- Dish names on swipe cards → always Fraunces (display)
- Screen/section labels (S-01, S-02…) → Be Vietnam Pro + letter-spacing
- All UI labels and callout labels → Be Vietnam Pro uppercase tracked
- Body line-height: `1.65`. Label line-height: `1.4`.
- Full Vietnamese diacritic support — both fonts cover the full Vietnamese character set.

---

## 4. Icon System

### 4.1 Global Icon Rules

- **No emoji anywhere** — not in buttons, tabs, banners, completion states, labels.
- All icons are SVG, stroke-based, `currentColor`.
- `stroke-width: 1.5px` — always.
- `stroke-linecap: round`, `stroke-linejoin: round` — always.
- No filled/solid icons except: FAB button (circle fill primary, icon white).

### 4.2 Icon Sizes

```
--icon-xs: 14px   /* Inline within tags, pill labels */
--icon-sm: 16px   /* Inline within body text, button prefix */
--icon-md: 20px   /* Tag / meta context */
--icon-lg: 24px   /* Navigation, action buttons */
--icon-xl: 32px   /* Empty state illustration */
```

### 4.3 Icon Color by Context

| Context | Icon Color | Token |
|---|---|---|
| Action / interactive | Terracotta | `--color-primary` |
| Navigation / neutral | Muted warm brown | `--color-text-secondary` |
| Health / safety | Sage green | `--color-health` |
| On primary background (FAB) | White | `#ffffff` |
| Do NOT mix | Multiple colors in one component | — |

### 4.4 Core Icon Library

| Icon Name | Usage |
|---|---|
| `time` (clock) | Cooking time |
| `people` (users) | Family members / servings |
| `budget` (grid) | Price / budget |
| `check-circle` | Suitable / approved |
| `info-circle` | Caution note |
| `x-circle` | Not suitable |
| `meal-morning` (sun with rays) | Bữa sáng tab |
| `meal-noon` (full sun) | Bữa trưa tab |
| `meal-evening` (moon) | Bữa tối tab |
| `heart` | Favourites |
| `ai-brain` (bulb) | Memory engine banner |
| `streak` (flame) | Streak counter — replaces 🔥 |
| `cook` (pot) | Bắt đầu nấu |
| `delivery` (truck) | Gọi món |
| `share` (nodes) | Chia sẻ |
| `notification` (signal) | Thông báo |
| `history` (lines) | Lịch sử |
| `family` (person) | Gia đình profile |
| `settings` (rays) | Cài đặt |
| `arrow-left` | Quay lại |
| `lock` | Paywall header |
| `star` (×5) | Social proof rating — `--color-gold` |
| `clock` | Notification sheet |

### 4.5 Emoji → SVG Replacement Table

| Old Emoji | Replace With | Context |
|---|---|---|
| 🌙 | SVG moon · 16px · `currentColor` | Bữa tối tab |
| 🌤 | SVG sun-with-cloud · 16px | Bữa trưa tab |
| ☀️ | SVG sun · 16px | Bữa sáng tab |
| 🍖 🥩 | SVG meat/protein · 14px · `#C43A2A` | Slot label — Mặn |
| 🍜 | SVG bowl/soup · 14px · `--color-primary` | Slot label — Canh |
| 🥦 | SVG leaf · 14px · `--color-health` | Slot label — Rau |
| 🍚 | SVG rice bowl · 14px · `--color-text-disabled` | Cơm auto slot |
| 🧠 | SVG brain/bulb · 14px · `--color-primary` | Memory engine banners |
| 🔥 | SVG flame · 14px · `--color-primary` | Streak counter |
| 🎉 | **Remove** — text only: "Bắt đầu chuỗi nấu cho gia đình!" | S-09 completion |
| ⏰ | SVG clock · 18px · `--color-primary` | Notification sheet |
| ↗ | SVG share · 14px | Share button |
| 🍲 | SVG bowl · 32px · `--color-border` | Empty state illustration |
| ⭐⭐⭐⭐⭐ | 5× SVG star · 10px · `--color-gold` | Social proof |
| 🔒 | SVG lock · 24px · `--color-text-disabled` | Paywall header |

---

## 5. Spacing

4px base grid. All spacing values are multiples of 4.

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

---

## 6. Border Radius

```
--radius-sm:   6px    /* Inline tags, small elements */
--radius-md:   12px   /* Cards, panels, input fields */
--radius-lg:   16px   /* Section containers, callout boxes */
--radius-xl:   24px   /* Swipe cards */
--radius-full: 9999px /* Pill buttons, pill tags, badge labels */
```

---

## 7. Elevation / Shadow

```
/* ONLY valid shadow in the entire system */
--shadow-overlay: 0 -4px 32px rgba(30, 20, 16, 0.10)
/* Use: bottom sheet, modal overlay ONLY */

/* All other depth = border + background contrast */
```

---

## 8. Animation

```
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1.0)  /* Swipe card snap, selection confirm */
--ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1.0)      /* Standard dismiss/fade */
--dur-fast:      150ms   /* Hover states, micro-interactions */
--dur-default:   250ms   /* Standard transitions */
--dur-medium:    350ms   /* Page transitions, card reveal */
```

---

## 9. Components

### 9.1 Buttons

| Variant | Background | Border | Text | Height | Radius |
|---|---|---|---|---|---|
| Primary | `--color-primary` `#D9622B` | `2px solid --color-primary` | White `#ffffff` | 52px | `--radius-full` |
| Primary (hover) | `#BF5024` | `2px solid #BF5024` | White | 52px | `--radius-full` |
| Outline | Transparent | `2px solid --color-primary` | `--color-primary` | 52px | `--radius-full` |
| Outline (hover) | `--color-primary-light` `#FAEAE0` | `2px solid --color-primary` | `--color-primary` | 52px | `--radius-full` |
| Ghost | Transparent | `1px solid --color-border-strong` | `--color-text-secondary` | 52px | `--radius-full` |
| Ghost (hover) | `--color-surface-alt` `#F2EAE4` | `1px solid --color-border-strong` | `--color-text-secondary` | 52px | `--radius-full` |
| Small (any variant) | — | — | — | 40px | `--radius-full` |
| Disabled (any variant) | — | — | — | — | opacity: 0.4 · cursor: not-allowed |

**Button rules:**
- Font: Be Vietnam Pro 600, 15px (small: 13px)
- Icon prefix: SVG 16px, `currentColor`, `stroke-width: 1.5`
- No emoji prefix
- No shadow on any button state — **including hover**
- Transition: `all 150ms ease` (`--dur-fast`)
- Hover = color shift only, no elevation, no shadow, no scale

### 9.2 Pill Tags

Height: 32px · Padding: `0 12px` · Font: Be Vietnam Pro 500 12px · Radius: `--radius-full`

| Variant | Background | Text Color | Border |
|---|---|---|---|
| Default | `--color-surface-alt` | `--color-text-secondary` | `--color-border` |
| Primary | `--color-primary-light` | `--color-primary` | `--color-primary-border` |
| Health | `--color-health-light` | `--color-health` | `--color-health-border` |
| Warn | `--color-warn-light` | `--color-warn` | `--color-warn-border` |
| Error | `--color-error-light` | `--color-error` | `#F0C0BC` |

Icon in tag: 12px SVG · `currentColor` · gap from text: 5px

### 9.3 Swipe Card

```
Width:          220px (single) / full-bleed deck stack
Border-radius:  --radius-xl (24px)
Border:         1px solid --color-border-strong (default state)
Background:     --color-surface
Overflow:       hidden
Shadow:         NONE
```

**Card image area:**
- Height: 180px
- Gradient overlay (bottom to top): `rgba(30,20,16,0.7)` → transparent at 55%
- Dish name sits above overlay: Fraunces 700 16px white

**Card body:**
- Padding: `12px 14px`
- Tags row: flex, gap 6px, margin-bottom 8px
- Action buttons row: centered, separated by `border-top: 1px solid --color-border`
- Action buttons: 40px × 40px circle, `border: 1.5px solid`

**Swipe state behavior:**
| State | Visual |
|---|---|
| Default | `border: 1px solid --color-border-strong` |
| Drag right (Chọn) | `rotate: +5deg`, background `rgba(90,138,106,0.06)` green tint |
| Drag left (Bỏ) | `rotate: -5deg`, background `rgba(217,98,43,0.06)` primary tint |

No shadow at any swipe state.

### 9.4 Callout Box (Food Mood "Floating Label" Pattern)

This is the signature pattern for all contextual banners: memory engine, health context, trial warnings, section notes.

```
Position:       relative
Border:         1px solid (color varies by type)
Border-radius:  --radius-lg (16px)
Padding:        20px 20px 16px
```

**Floating label:**
```
Position:       absolute, top: -10px, right: 16px (or left: 20px)
Font:           Be Vietnam Pro 500, 9–10px, uppercase, letter-spacing: 0.15em
Background:     matches callout background (to break border)
Padding:        2px 10px
Border:         1px solid (same as callout)
Border-radius:  --radius-full
```

**Callout variants:**

| Type | Background | Border | Label Color |
|---|---|---|---|
| Default | `--color-surface` | `--color-border` | `--color-primary` |
| Memory (neutral) | `--color-surface-alt` | `--color-border` | `--color-primary` |
| Health | `--color-health-light` | `--color-health-border` | `--color-health` |
| Warning | `--color-warn-light` | `--color-warn-border` | `--color-warn` |
| Action/primary | `--color-primary-light` | `--color-primary-border` | `--color-primary` |

Body text inside callout: Be Vietnam Pro 13px, `--color-text-secondary`, line-height 1.7

### 9.5 Bottom Navigation Bar

- Background: `--color-surface` or white
- Border-top: `1px solid --color-border`
- Active tab: icon + label in `--color-primary`, `border-bottom: 2px solid --color-primary` on tab
- Inactive tab: icon + label in `--color-text-disabled`
- No shadow on nav bar itself
- Tab labels: Be Vietnam Pro 500 10px uppercase

### 9.6 Input Fields

- Background: `--color-surface-alt` `#F7EDE0`
- Border: `1px solid --color-border-strong` `#D4B8A5`
- Border-radius: `--radius-md` 12px
- Focus border: `--color-primary`
- Font: Be Vietnam Pro 400 15px
- Placeholder color: `--color-text-disabled`
- No shadow on focus

---

## 10. Screen-Level Layout Patterns

### App Canvas
- Background: `--color-bg` `#FEF8F1` — full screen
- Max content width on tablet: 480px centered
- Body padding: `0 16px`

### Section Headers
- Fraunces 600 22px `--color-text-primary`
- Secondary label above: Be Vietnam Pro 10px uppercase `--color-primary` `letter-spacing: 0.14em`
- Separator: `border-bottom: 1px solid --color-border` with `padding-bottom: 16px`

### Empty States
- SVG illustration icon: 32px · `--color-border` (muted, not primary)
- Text: Be Vietnam Pro 400 15px `--color-text-secondary`
- No emoji illustrations

### Health Indicator Row
- Icons: `--icon-xs` 14px · `--color-health` for compliant, `--color-warn` for caution
- All in a flex row, wrapped
- Always inside a callout box (health variant)

---

## 11. Anti-Patterns (What to Never Generate)

| ❌ Do Not | ✅ Instead |
|---|---|
| `box-shadow` on cards, buttons, tags | `border` + background contrast only |
| `#1a1a1a` / pure black for CTA buttons | `--color-primary` `#D9622B` |
| Any emoji character in UI elements | Equivalent SVG icon |
| Blue, purple, or cool-toned colors | Warm cream + terracotta palette only |
| Multiple accent colors competing | Single accent (terracotta). Green = health. Gold = premium. |
| `font-family: Inter` | `--font-display` (Fraunces) or `--font-body` (Be Vietnam Pro) |
| Solid/filled icons (except FAB) | Stroke 1.5px rounded icons |
| shadow on hover/active button states | Color shift only (`--color-primary-hover` · `--color-primary-light` · `--color-surface-alt`) |
| 🎉 celebration emoji in completion state | Text-only confirmation copy |
| Green tint for memory/AI banners | `--color-surface-alt` neutral background |
| Multiple icon colors in one component | 1 color per component context |

---

## 12. Full CSS Token Reference

```css
:root {
  /* ── COLORS ── */
  --color-bg:              #FEF8F1;
  --color-surface:         #FFFDF9;
  --color-surface-alt:     #F7EDE0;

  --color-primary:         #D9622B;
  --color-primary-hover:   #BF5024;
  --color-primary-light:   #FAEAE0;
  --color-primary-border:  #F0CBBA;

  --color-health:          #5A8A6A;
  --color-health-light:    #E8F2EC;
  --color-health-border:   #C0DACA;

  --color-gold:            #C9933A;
  --color-warn:            #C97B2A;
  --color-warn-light:      #FEF3E2;
  --color-warn-border:     #F0D5A0;
  --color-error:           #C04030;
  --color-error-light:     #FAEAE8;

  --color-text-primary:    #1E1410;
  --color-text-secondary:  #6B5447;
  --color-text-disabled:   #B09A8C;
  --color-border:          #EAD8C8;
  --color-border-strong:   #D4B8A5;

  /* ── TYPOGRAPHY ── */
  --font-display: "Fraunces", Georgia, serif;
  --font-body:    "Be Vietnam Pro", "Helvetica Neue", sans-serif;

  /* ── SPACING (4px base) ── */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px;

  /* ── RADIUS ── */
  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  /* ── ELEVATION — FLAT, BORDER ONLY ── */
  --shadow-overlay: 0 -4px 32px rgba(30, 20, 16, 0.10);
  /* No other shadows. Use border + background for depth. */

  /* ── ICONS — SVG only, no emoji ── */
  --icon-xs: 14px;  --icon-sm: 16px;
  --icon-md: 20px;  --icon-lg: 24px;
  --icon-xl: 32px;
  /* stroke: currentColor, stroke-width: 1.5, rounded caps */

  /* ── ANIMATION ── */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);
  --ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1.0);
  --dur-fast: 150ms; --dur-default: 250ms; --dur-medium: 350ms;
}
```

---

*Đầu Bếp Gia Đình · Design System v2.0 · Internal Use Only*