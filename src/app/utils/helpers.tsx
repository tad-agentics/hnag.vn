import { Sun, Cloud, Moon } from "lucide-react";
import type { MealType } from "./types";

/**
 * Returns the SVG icon for a meal type.
 * @param meal - breakfast | lunch | dinner
 * @param size - icon size in px (default 16)
 */
export function getMealIcon(meal: MealType, size: number = 16) {
  switch (meal) {
    case 'breakfast':
      return <Sun size={size} strokeWidth={1.5} />;
    case 'lunch':
      return <Cloud size={size} strokeWidth={1.5} />;
    case 'dinner':
      return <Moon size={size} strokeWidth={1.5} />;
  }
}

/**
 * Returns the Vietnamese label for a meal type.
 * @param meal - breakfast | lunch | dinner
 * @param full - if true, returns "Bữa sáng"; if false, returns "Sáng"
 */
export function getMealLabel(meal: MealType, full: boolean = false): string {
  switch (meal) {
    case 'breakfast':
      return full ? 'Bữa sáng' : 'Sáng';
    case 'lunch':
      return full ? 'Bữa trưa' : 'Trưa';
    case 'dinner':
      return full ? 'Bữa tối' : 'Tối';
  }
}

/**
 * Returns the first uppercase character of a name (for avatar initials).
 */
export function getInitial(name: string): string {
  return name?.trim().charAt(0).toUpperCase() || '?';
}

/**
 * Returns the Vietnamese label for a slot type.
 */
export function getSlotLabel(slotType: string): string {
  switch (slotType) {
    case 'protein':
      return 'Món mặn';
    case 'soup':
      return 'Canh';
    case 'vegetable':
      return 'Rau';
    case 'rice':
      return 'Cơm';
    default:
      return slotType;
  }
}
