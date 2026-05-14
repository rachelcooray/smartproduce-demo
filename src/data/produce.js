export const VARIETY_MAP = {
  banana: ['Kolikuttu', 'Ambun', 'Anamalu', 'Cavendish', 'Seeni', 'Pethpeli', 'Other'],
  mango: ['Karthakolomban', 'Willard', 'TJC', 'Imported', 'Other'],
  tomato: ['Local', 'Cherry', 'Imported'],
  apple: ['Fuji', 'Granny Smith', 'Pink Lady', 'Gala', 'Other'],
  potato: ['Local', 'Imported'],
  onion: ['Local Red', 'Local Small', 'Imported Big'],
  cabbage: ['Green', 'Purple', 'Cauliflower'],
  watermelon: ['Seeded', 'Seedless'],
  coconut: ['Green (King)', 'Dry'],
  jackfruit: ['Whole', 'Cut Piece'],
  brinjal: ['Purple Long', 'Round', 'Green'],
}

export const PRICE_PER_KG = {
  banana: 180,
  apple: 480,
  tomato: 220,
  mango: 650,
  potato: 140,
  onion: 180,
  carrot: 160,
  cabbage: 120,
  pepper: 380,
  cucumber: 140,
  avocado: 820,
  lemon: 340,
  lime: 280,
  grape: 580,
  watermelon: 120,
  pineapple: 200,
  papaya: 180,
  coconut: 160,
  jackfruit: 140,
  broccoli: 360,
  cauliflower: 280,
  garlic: 640,
  ginger: 480,
  brinjal: 160,
  default: 200,
}

export const PLU_MAP = {
  banana: 3000,
  apple: 3001,
  tomato: 3002,
  mango: 3003,
  potato: 3004,
  onion: 3005,
  carrot: 3006,
  cabbage: 3007,
  watermelon: 3008,
  coconut: 3009,
  jackfruit: 3010,
  brinjal: 3011,
  default: 3099,
}

export function getPricePerKg(category) {
  const key = category?.toLowerCase()
  return PRICE_PER_KG[key] ?? PRICE_PER_KG.default
}

export function getVarieties(category) {
  const key = category?.toLowerCase()
  return VARIETY_MAP[key] ?? null
}

export function getPLU(category) {
  const key = category?.toLowerCase()
  return PLU_MAP[key] ?? PLU_MAP.default
}

export function calcPrice(weightGrams, pricePerKg) {
  return (weightGrams / 1000) * pricePerKg
}
