export const ALL_PRODUCE = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Beet', 'Broccoli', 'Cabbage',
  'Carrot', 'Cauliflower', 'Chilli', 'Corn', 'Cucumber', 'Daikon', 'Garlic',
  'Grape', 'Grapefruit', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Melon',
  'Nectarine', 'Onion', 'Orange', 'Pear', 'Pepper', 'Plum', 'Pomegranate',
  'Pomelo', 'Potato', 'Pumpkin', 'Radish', 'Salad', 'Tangerine', 'Tomato',
  'Watermelon', 'Zucchini',
]

export const VARIETY_MAP = {
  // Keells-specific varieties
  'apple':      ['Fuji', 'Green', 'Red', 'Red Royal Gala', 'Yellow'],
  'banana':     ['Kolikuttu', 'Ambul', 'Ambun', 'Cavendish', 'CIC Quality', 'Seeni'],
  'mango':      ['Bud', 'K/C', 'Tjc', 'Vilad'],
  'melon':      ['Cantaloupe', 'Dark Bell', 'Red Fantasy'],
  'orange':     ['Local', 'Imported'],
  'pear':       ['Green', 'Local', 'Red', 'Yellow'],
  'grape':      ['Black', 'Red', 'Green'],
  'tomato':     ['Standard', 'Cherry', 'Organic'],
  'pepper':     ['Green', 'Red', 'Yellow'],
  'carrot':     ['Standard', 'Organic'],
  'potato':     ['Standard', 'Organic'],
  'onion':      ['Big', 'Red', 'Pre-Packed'],
  'cabbage':    ['Green', 'Red'],
  'watermelon': ['Seeded', 'Seedless'],
  'cucumber':   ['Standard', 'Salad'],
  'pumpkin':    ['Standard', 'Organic'],
}

const DEFAULT_VARIETIES = ['Standard', 'Organic', 'Imported']

export function getVarieties(category, hasVarieties) {
  if (!hasVarieties) return null
  const key = category?.toLowerCase()
  return VARIETY_MAP[key] ?? DEFAULT_VARIETIES
}

export const PRICE_PER_KG = {
  apple: 2000, apricot: 600, avocado: 540, banana: 300,
  beet: 200, broccoli: 2400, cabbage: 130, carrot: 370,
  cauliflower: 1110, chilli: 400, corn: 200, cucumber: 300,
  daikon: 150, garlic: 800, grape: 3060, grapefruit: 500,
  kiwi: 3000, lemon: 200, lime: 180, mango: 500,
  melon: 140, nectarine: 800, onion: 290, orange: 410,
  pear: 2340, pepper: 610, plum: 500, pomegranate: 3200,
  pomelo: 400, potato: 340, pumpkin: 80, radish: 200,
  salad: 400, tangerine: 300, tomato: 560, watermelon: 140,
  zucchini: 300,
  default: 400,
}

export const PLU_MAP = {
  apple: 4131, apricot: 3301, avocado: 3302, banana: 4011,
  beet: 3303, broccoli: 3082, cabbage: 3115, carrot: 3060,
  cauliflower: 3304, chilli: 3305, corn: 3306, cucumber: 4062,
  daikon: 3307, garlic: 3308, grape: 4022, grapefruit: 3309,
  kiwi: 3310, lemon: 3311, lime: 3312, mango: 3114,
  melon: 3313, nectarine: 3314, onion: 3148, orange: 3107,
  pear: 3315, pepper: 3627, plum: 3316, pomegranate: 3317,
  pomelo: 3318, potato: 4072, pumpkin: 3319, radish: 3320,
  salad: 3321, tangerine: 3458, tomato: 3664, watermelon: 3421,
  zucchini: 3322,
  default: 3000,
}

export function getPricePerKg(category) {
  return PRICE_PER_KG[category?.toLowerCase()] ?? PRICE_PER_KG.default
}

export function getPLU(category) {
  return PLU_MAP[category?.toLowerCase()] ?? PLU_MAP.default
}

export function randomWeight() {
  return Math.round((150 + Math.random() * 750) / 5) * 5
}

export function calcPrice(weightGrams, pricePerKg) {
  return (weightGrams / 1000) * pricePerKg
}
