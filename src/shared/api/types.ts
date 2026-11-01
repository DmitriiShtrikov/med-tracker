// src/shared/api/types.ts
export interface Medicine {
  id: number;
  name: string;
  category: string; 
  packs: number;
  blisters_per_pack: number;
  pills_per_blister: number;
  expiry: string;
  note: string;
}