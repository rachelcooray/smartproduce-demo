export const VARIETY_MAP = {
  banana:     ['Kolikuttu', 'Ambun', 'Anamalu', 'Cavendish', 'Seeni', 'Pethpeli'],
  mango:      ['Karthakolomban', 'Willard', 'TJC', 'Imported'],
  tomato:     ['Local', 'Cherry', 'Imported'],
  apple:      ['Fuji', 'Granny Smith', 'Pink Lady', 'Gala'],
  potato:     ['Local', 'Imported'],
  onion:      ['Local Red', 'Local Small', 'Imported Big'],
  cabbage:    ['Green', 'Purple', 'Cauliflower'],
  watermelon: ['Seeded', 'Seedless'],
  coconut:    ['Green King', 'Dry'],
  jackfruit:  ['Whole', 'Cut Piece'],
  brinjal:    ['Purple Long', 'Round', 'Green'],
}

export const PRICE_PER_KG = {
  banana: 180, apple: 480, tomato: 220, mango: 650, potato: 140,
  onion: 180, carrot: 160, cabbage: 120, pepper: 380, cucumber: 140,
  avocado: 820, lemon: 340, lime: 280, grape: 580, watermelon: 120,
  pineapple: 200, papaya: 180, coconut: 160, jackfruit: 140,
  broccoli: 360, cauliflower: 280, garlic: 640, ginger: 480,
  gotukola: 320, mukunuwenna: 280, karapincha: 240, drumstick: 360,
  brinjal: 160, beetroot: 180, leeks: 200, okra: 220,
  'green chilli': 380, corn: 160, pomegranate: 580, rambutan: 340,
  default: 200,
}

export const PLU_MAP = {
  banana: 3000, apple: 3001, tomato: 3002, mango: 3003, potato: 3004,
  onion: 3005, carrot: 3006, cabbage: 3007, watermelon: 3008,
  coconut: 3009, jackfruit: 3010, brinjal: 3011, gotukola: 3012,
  default: 3099,
}

export function getPricePerKg(category) {
  return PRICE_PER_KG[category?.toLowerCase()] ?? PRICE_PER_KG.default
}

export function getVarieties(category) {
  return VARIETY_MAP[category?.toLowerCase()] ?? null
}

export function getPLU(category) {
  return PLU_MAP[category?.toLowerCase()] ?? PLU_MAP.default
}

export function randomWeight() {
  // realistic produce weight 150–800g in 5g steps
  return Math.round((150 + Math.random() * 650) / 5) * 5
}

export function calcPrice(weightGrams, pricePerKg) {
  return (weightGrams / 1000) * pricePerKg
}
