// src/shared/api/types.ts

export interface Category {
  id: number;
  name: string;
}

export interface Symptom {
  id: number;
  name: string;
}

export interface Medicine {
  id: number;
  name: string;
  user_id: number;
  category_id: number;
  symptom_id: number | null;
  packs: number;
  blisters_per_pack: number;
  pills_per_blister: number;
  expiry: string;
  note: string;
  category_rel?: Category; // Вложенный объект категории
  symptom_rel?: Symptom;   // Вложенный объект симптома
}