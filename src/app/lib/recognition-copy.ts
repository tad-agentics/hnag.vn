/**
 * Recognition copy library for S-07 Summary (tech-spec §18).
 * 12+ variants; pick one avoiding last_recognition_copy_key. Write chosen key to users.last_recognition_copy_key.
 */

import { supabase } from '@/lib/supabase';

export interface RecognitionCopy {
  key: string;
  copy: string;
}

const RECOGNITION_COPIES: RecognitionCopy[] = [
  { key: 'milestone_1', copy: 'Ngày đầu tiên gia đình được chăm sóc 🌱' },
  { key: 'milestone_7', copy: '7 ngày rồi — gia đình đang được chăm sóc đều đặn' },
  { key: 'milestone_30', copy: '30 ngày. Một tháng gia đình ăn có chủ đích.' },
  { key: 'milestone_100', copy: '100 ngày chăm sóc gia đình — không phải ai cũng làm được điều này.' },
  { key: 'generic_a', copy: 'Quyết định xong rồi — gia đình được chăm sóc hôm nay' },
  { key: 'generic_b_sang', copy: 'Bữa sáng đã plan — nhẹ hơn một gánh lo' },
  { key: 'generic_b_trua', copy: 'Bữa trưa đã plan — nhẹ hơn một gánh lo' },
  { key: 'generic_b_toi', copy: 'Bữa tối đã plan — nhẹ hơn một gánh lo' },
  { key: 'generic_c', copy: 'Hôm nay thêm một ngày gia đình được chăm sóc' },
  { key: 'generic_d', copy: 'Xong rồi — tối nay cả nhà có bữa ăn có chủ đích' },
  { key: 'generic_e', copy: 'Một bữa nữa đã được chăm sóc đúng cách' },
  { key: 'generic_f', copy: 'Gia đình có bữa hôm nay — nhỏ thôi nhưng đáng' },
];

const MILESTONE_DAYS = [1, 7, 30, 100] as const;
const MILESTONE_KEYS: Record<number, string> = {
  1: 'milestone_1',
  7: 'milestone_7',
  30: 'milestone_30',
  100: 'milestone_100',
};

export interface RecognitionContext {
  lastCopyKey: string | null;
  careDays: number;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

/**
 * Pick recognition copy for S-07. Prefer milestone for care_days_count 1,7,30,100; else rotate generic (never repeat last key).
 */
export function getRecognitionCopy(context: RecognitionContext): RecognitionCopy | null {
  const { lastCopyKey, careDays, mealType = 'dinner' } = context;
  if (careDays < 1) return null;

  const milestoneKey = MILESTONE_DAYS.includes(careDays as (typeof MILESTONE_DAYS)[number])
    ? MILESTONE_KEYS[careDays as keyof typeof MILESTONE_KEYS]
    : null;
  if (milestoneKey) {
    const entry = RECOGNITION_COPIES.find((c) => c.key === milestoneKey);
    if (entry && entry.key !== lastCopyKey) return entry;
  }

  const genericKeys = [
    'generic_a',
    mealType === 'breakfast' ? 'generic_b_sang' : mealType === 'lunch' ? 'generic_b_trua' : 'generic_b_toi',
    'generic_c',
    'generic_d',
    'generic_e',
    'generic_f',
  ];
  const candidates = RECOGNITION_COPIES.filter(
    (c) => genericKeys.includes(c.key) && c.key !== lastCopyKey
  );
  if (candidates.length === 0) {
    const anyOther = RECOGNITION_COPIES.find((c) => c.key !== lastCopyKey);
    return anyOther ?? RECOGNITION_COPIES[0];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Persist chosen copy key so we don't repeat it next time (tech-spec §18). */
export async function updateLastRecognitionCopyKey(userId: string, copyKey: string): Promise<void> {
  await supabase
    .from('users')
    .update({ last_recognition_copy_key: copyKey, updated_at: new Date().toISOString() })
    .eq('id', userId);
}
