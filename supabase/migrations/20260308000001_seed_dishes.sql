-- Seed a few dishes so the deck has content (run after initial_schema).
-- In production, use the full dish pipeline; this is for local/dev.

INSERT INTO dishes (
  slug, name_vi, dish_type, category, image_status, cook_time_minutes, budget_tier,
  is_published, image_url
) VALUES
  ('ca-kho-to', 'Cá Kho Tộ', 'man', 'braise', 'ready', 35, 'mid', true, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400'),
  ('thit-kho-trung', 'Thịt Kho Trứng', 'man', 'braise', 'ready', 45, 'mid', true, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400'),
  ('canh-chua-ca', 'Canh Chua Cá', 'canh', 'soup', 'ready', 30, 'low', true, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400'),
  ('rau-muong-xao-toi', 'Rau Muống Xào Tỏi', 'rau', 'stir_fry', 'ready', 15, 'low', true, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'),
  ('com-trang', 'Cơm Trắng', 'tinh_bot', 'rice', 'ready', 25, 'low', true, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400')
ON CONFLICT (slug) DO NOTHING;
