-- =============================================================================
-- HNAG Supabase setup — run once in Supabase Dashboard → SQL Editor
-- Project: https://hptovpbiwvtngorhdhhm.supabase.co
-- =============================================================================
-- 1. Open https://supabase.com/dashboard/project/hptovpbiwvtngorhdhhm/sql/new
-- 2. Paste this entire file and click "Run"
-- If you see "relation already exists", the schema was already applied; run only
-- the seed block at the end (from "-- SEED DISHES" downward) if you need seed data.
-- =============================================================================

-- =============================================================================
-- USERS (profile; auth.users synced via trigger below)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                           text UNIQUE,
  phone                           text,
  display_name                    text,
  avatar_url                      text,
  auth_provider                   text CHECK (auth_provider IN ('google','facebook','phone')),

  trial_started_at                timestamptz,
  subscription_status             text CHECK (subscription_status IN ('trial','active','expired')),
  subscription_expires_at         timestamptz,
  plan_type                       text CHECK (plan_type IN ('6m','12m','lifetime')),

  onboarding_completed            boolean DEFAULT false,
  push_subscription               jsonb,
  health_consent_given_at         timestamptz,
  health_consent_version          text,
  account_deletion_requested_at   timestamptz,
  is_admin                        boolean DEFAULT false,

  care_days_count                 integer DEFAULT 0,
  total_meals_completed           integer DEFAULT 0,
  last_recognition_copy_key       text,

  created_at                      timestamptz DEFAULT now(),
  updated_at                      timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users FOR SELECT TO authenticated USING (id = auth.uid());
DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- =============================================================================
-- FAMILY_MEMBERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS family_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name              text NOT NULL,
  role              text CHECK (role IN ('adult','child','elderly')),
  age               integer,
  health_conditions text[] DEFAULT '{}',
  allergies         text[] DEFAULT '{}',
  dislikes          text[] DEFAULT '{}',
  is_primary        boolean DEFAULT false,
  sort_order        integer,
  created_at        timestamptz DEFAULT now(),
  deleted_at        timestamptz
);

CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id) WHERE deleted_at IS NULL;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fm_select_own ON family_members;
CREATE POLICY fm_select_own ON family_members FOR SELECT TO authenticated USING (user_id = auth.uid() AND deleted_at IS NULL);
DROP POLICY IF EXISTS fm_insert_own ON family_members;
CREATE POLICY fm_insert_own ON family_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS fm_update_own ON family_members;
CREATE POLICY fm_update_own ON family_members FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- DISHES
-- =============================================================================
CREATE TABLE IF NOT EXISTS dishes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text UNIQUE NOT NULL,
  name_vi               text NOT NULL,
  dish_type             text CHECK (dish_type IN ('man','canh','rau','tinh_bot','khai_vi','trang_mieng')),
  category              text CHECK (category IN ('soup','braise','stir_fry','steam','rice','fresh')),
  image_url             text,
  image_status          text CHECK (image_status IN ('pending','generating','ready','failed')) DEFAULT 'pending',
  image_generated_at    timestamptz,
  cook_time_minutes     integer,
  prep_time_minutes     integer,
  budget_tier           text CHECK (budget_tier IN ('low','mid','high')),
  calories              integer,
  protein_g             decimal(6,2),
  carb_g                decimal(6,2),
  fat_g                 decimal(6,2),
  sodium_mg             decimal(7,2),
  purine_level          text CHECK (purine_level IN ('low','medium','high')),
  glycemic_index        integer,
  sat_fat_level         text CHECK (sat_fat_level IN ('low','medium','high')),
  added_sugar_level     text CHECK (added_sugar_level IN ('low','medium','high')),
  potassium_level       text CHECK (potassium_level IN ('low','medium','high')),
  phosphorus_level      text CHECK (phosphorus_level IN ('low','medium','high')),
  fiber_level           text CHECK (fiber_level IN ('low','medium','high')),
  suitable_conditions   text[] DEFAULT '{}',
  unsafe_conditions     text[] DEFAULT '{}',
  caution_conditions    text[] DEFAULT '{}',
  ingredients_required  jsonb DEFAULT '[]',
  ingredients_optional  jsonb DEFAULT '[]',
  steps                 jsonb DEFAULT '[]',
  tips                  text[] DEFAULT '{}',
  region                text CHECK (region IN ('north','central','south','nationwide')),
  is_published          boolean DEFAULT false,
  popularity_score      decimal(4,3) DEFAULT 0.5,
  search_vector         tsvector,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dishes_published ON dishes(is_published, image_status, dish_type);
CREATE INDEX IF NOT EXISTS idx_dishes_search ON dishes USING GIN(search_vector);
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dishes_select_published ON dishes;
CREATE POLICY dishes_select_published ON dishes FOR SELECT TO anon, authenticated USING (is_published = true AND image_status = 'ready');
DROP POLICY IF EXISTS admin_write_dishes ON dishes;
CREATE POLICY admin_write_dishes ON dishes FOR ALL TO authenticated USING ((auth.jwt() ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

-- =============================================================================
-- DISH_ADAPTATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS dish_adaptations (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id               uuid REFERENCES dishes(id) ON DELETE CASCADE NOT NULL,
  condition             text CHECK (condition IN ('gout','diabetes','hypertension','gastritis','child_under3','mo_mau_cao','gan_nhiem_mo','suy_than','beo_phi','dislike')),
  trigger_reason        text NOT NULL,
  safety_parameters     jsonb NOT NULL DEFAULT '{}',
  fallback_steps_vi     text[] DEFAULT '{}',
  llm_prompt_hint       text,
  dietitian_verified    boolean DEFAULT false,
  verified_at           timestamptz,
  verified_by           text,
  created_at            timestamptz DEFAULT now(),
  UNIQUE(dish_id, condition)
);

ALTER TABLE dish_adaptations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS da_select_all ON dish_adaptations;
CREATE POLICY da_select_all ON dish_adaptations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS da_admin_write ON dish_adaptations;
CREATE POLICY da_admin_write ON dish_adaptations FOR ALL TO authenticated USING ((auth.jwt() ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

-- =============================================================================
-- SWIPE_EVENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS swipe_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  dish_id       uuid REFERENCES dishes(id) NOT NULL,
  direction     text CHECK (direction IN ('right','left','defer')),
  meal_type     text CHECK (meal_type IN ('breakfast','lunch','dinner')),
  slot_type     text,
  session_id    uuid NOT NULL,
  deck_position integer,
  swiped_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_swipe_user_time ON swipe_events(user_id, swiped_at DESC);
CREATE INDEX IF NOT EXISTS idx_swipe_dish ON swipe_events(dish_id);
ALTER TABLE swipe_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS swipe_select_own ON swipe_events;
CREATE POLICY swipe_select_own ON swipe_events FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS swipe_insert_own ON swipe_events;
CREATE POLICY swipe_insert_own ON swipe_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- MEAL_PLANS
-- =============================================================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_date   date NOT NULL,
  meal_type   text CHECK (meal_type IN ('breakfast','lunch','dinner')),
  dishes      jsonb DEFAULT '[]',
  status      text CHECK (status IN ('planned','completed','skipped')) DEFAULT 'planned',
  notes       text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date ON meal_plans(user_id, meal_date DESC);
CREATE INDEX IF NOT EXISTS idx_meal_plans_status ON meal_plans(user_id, status);
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mp_select_own ON meal_plans;
CREATE POLICY mp_select_own ON meal_plans FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS mp_insert_own ON meal_plans;
CREATE POLICY mp_insert_own ON meal_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS mp_update_own ON meal_plans;
CREATE POLICY mp_update_own ON meal_plans FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- USER_PREFERENCES
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id         uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  dish_id         uuid REFERENCES dishes(id) NOT NULL,
  member_id       uuid REFERENCES family_members(id),
  score           decimal(4,3) DEFAULT 0,
  right_count     integer DEFAULT 0,
  left_count      integer DEFAULT 0,
  view_count      integer DEFAULT 0,
  last_served_at  timestamptz,
  last_accepted_at timestamptz,
  updated_at      timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_preferences ON user_preferences(user_id, dish_id, COALESCE(member_id, '00000000-0000-0000-0000-000000000000'::uuid));
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS up_select_own ON user_preferences;
CREATE POLICY up_select_own ON user_preferences FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS up_insert_own ON user_preferences;
CREATE POLICY up_insert_own ON user_preferences FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS up_update_own ON user_preferences;
CREATE POLICY up_update_own ON user_preferences FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- USER_SETTINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id               uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  active_meals          text[] DEFAULT '{"lunch","dinner"}',
  meal_schedule         jsonb DEFAULT '{}',
  budget_weekday_vnd    integer DEFAULT 120000,
  budget_weekend_vnd    integer DEFAULT 200000,
  cook_time_weekday_min integer DEFAULT 30,
  cook_time_weekend_min integer DEFAULT 60,
  meal_structure        jsonb DEFAULT '{}',
  kitchen_equipment     text[] DEFAULT '{}',
  timezone              text DEFAULT 'Asia/Ho_Chi_Minh',
  pantry_mode_enabled   boolean DEFAULT false,
  memory_toast_shown          boolean DEFAULT false,
  memory_card_last_surfaced_at timestamptz,
  first_meal_completed_at     timestamptz,
  push_optin_state            text CHECK (push_optin_state IN ('not_asked','declined','accepted')) DEFAULT 'not_asked',
  push_optin_asked_at         timestamptz,
  weekly_card_last_generated_at   timestamptz,
  monthly_report_last_generated_at timestamptz
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS us_select_own ON user_settings;
CREATE POLICY us_select_own ON user_settings FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS us_insert_own ON user_settings;
CREATE POLICY us_insert_own ON user_settings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS us_update_own ON user_settings;
CREATE POLICY us_update_own ON user_settings FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- PANTRY_ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS pantry_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  ingredient_tag   text NOT NULL,
  name_vi          text NOT NULL,
  quantity_note    text,
  added_at         timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  UNIQUE(user_id, ingredient_tag)
);

CREATE INDEX IF NOT EXISTS idx_pantry_user ON pantry_items(user_id, added_at DESC);
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pantry_select_own ON pantry_items;
CREATE POLICY pantry_select_own ON pantry_items FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS pantry_insert_own ON pantry_items;
CREATE POLICY pantry_insert_own ON pantry_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS pantry_update_own ON pantry_items;
CREATE POLICY pantry_update_own ON pantry_items FOR UPDATE TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS pantry_delete_own ON pantry_items;
CREATE POLICY pantry_delete_own ON pantry_items FOR DELETE TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- SUBSCRIPTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan_type             text CHECK (plan_type IN ('6m','12m','lifetime')),
  amount_vnd            integer NOT NULL,
  payment_method        text CHECK (payment_method IN ('momo','vnpay','atm','visa_mc')),
  payos_order_id        text UNIQUE,
  payos_transaction_id  text,
  status                text CHECK (status IN ('pending','completed','failed','refunded')),
  starts_at             timestamptz,
  expires_at            timestamptz,
  receipt_email_sent    boolean DEFAULT false,
  created_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id, starts_at DESC);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sub_select_own ON subscriptions;
CREATE POLICY sub_select_own ON subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- BLOG_ARTICLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS blog_articles (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,
  title_vi            text NOT NULL,
  meta_description    text,
  content_mdx         text,
  category            text CHECK (category IN ('gout','diabetes','hypertension','gastritis','mo_mau_cao','gan_nhiem_mo','beo_phi','tre_em','general')),
  health_tags         text[] DEFAULT '{}',
  featured_image_url  text,
  read_time_minutes   integer,
  is_published        boolean DEFAULT false,
  published_at        timestamptz,
  author_name         text,
  reviewed_by         text,
  last_reviewed_at    timestamptz,
  search_vector       tsvector,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_search ON blog_articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_articles(category) WHERE is_published = true;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS blog_select_published ON blog_articles;
CREATE POLICY blog_select_published ON blog_articles FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS blog_admin_write ON blog_articles;
CREATE POLICY blog_admin_write ON blog_articles FOR ALL TO authenticated USING ((auth.jwt() ->> 'is_admin')::boolean = true) WITH CHECK ((auth.jwt() ->> 'is_admin')::boolean = true);

-- =============================================================================
-- FAMILY_REPORTS (Phase 2)
-- =============================================================================
CREATE TABLE IF NOT EXISTS family_reports (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  report_type      text CHECK (report_type IN ('weekly','monthly')),
  period_label     text NOT NULL,
  data_snapshot    jsonb NOT NULL,
  image_url        text,
  caption_default  text,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_family_reports_user ON family_reports(user_id, created_at DESC);
ALTER TABLE family_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fr_select_own ON family_reports;
CREATE POLICY fr_select_own ON family_reports FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS fr_delete_own ON family_reports;
CREATE POLICY fr_delete_own ON family_reports FOR DELETE TO authenticated USING (user_id = auth.uid());

-- =============================================================================
-- TRIGGER: sync auth.users -> public.users + user_settings
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, auth_provider, trial_started_at, subscription_status, created_at, updated_at)
  VALUES (new.id, new.email, COALESCE(new.raw_app_meta_data->>'provider', 'email'), now(), 'trial', now(), now())
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_settings (user_id) VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- SEED DISHES (safe to run again; ON CONFLICT DO NOTHING)
-- =============================================================================
INSERT INTO dishes (slug, name_vi, dish_type, category, image_status, cook_time_minutes, budget_tier, is_published, image_url)
VALUES
  ('ca-kho-to', 'Cá Kho Tộ', 'man', 'braise', 'ready', 35, 'mid', true, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400'),
  ('thit-kho-trung', 'Thịt Kho Trứng', 'man', 'braise', 'ready', 45, 'mid', true, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400'),
  ('canh-chua-ca', 'Canh Chua Cá', 'canh', 'soup', 'ready', 30, 'low', true, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400'),
  ('rau-muong-xao-toi', 'Rau Muống Xào Tỏi', 'rau', 'stir_fry', 'ready', 15, 'low', true, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'),
  ('com-trang', 'Cơm Trắng', 'tinh_bot', 'rice', 'ready', 25, 'low', true, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400')
ON CONFLICT (slug) DO NOTHING;
