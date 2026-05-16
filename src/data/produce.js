export const ALL_PRODUCE = [
  'Apple', 'Ash Plantain', 'Avocado', 'Banana', 'Beans', 'Bell Pepper',
  'Bitter Gourd', 'Brinjal', 'Broccoli', 'Cabbage', 'Capsicum', 'Carrot',
  'Cauliflower', 'Cucumber', 'Curry Leaves', 'Dragon Fruit', 'Garlic',
  'Ginger', 'Grape', 'Guava', 'Jackfruit', 'Kiwi', 'Leek', 'Lemon',
  'Lettuce', 'Lime', 'Mango', 'Mandarin', 'Melon', 'Mushroom', 'Okra',
  'Onion', 'Orange', 'Papaya', 'Passion Fruit', 'Pear', 'Pineapple',
  'Pomegranate', 'Potato', 'Pumpkin', 'Rambutan', 'Spinach', 'Sweet Potato',
  'Tomato', 'Watermelon',
]

export const VARIETY_MAP = {
  'apple':       ['Fuji', 'Green', 'Red', 'Red Royal Gala', 'Yellow'],
  'banana':      ['Kolikuttu', 'Ambul', 'Ambun', 'Cavendish', 'CIC Quality', 'Seeni'],
  'mango':       ['Bud', 'K/C', 'Tjc', 'Vilad'],
  'mandarin':    ['Honey Small', 'Local', 'Imported'],
  'melon':       ['Cantaloupe', 'Dark Bell', 'Red Fantasy'],
  'orange':      ['Local', 'Imported'],
  'pear':        ['Green', 'Local', 'Red', 'Yellow'],
  'grape':       ['Black', 'Red'],
  'tomato':      ['Standard', 'Cherry', 'Organic'],
  'capsicum':    ['Green', 'Red', 'Yellow'],
  'bell pepper': ['Green', 'Red', 'Yellow'],
  'carrot':      ['Standard', 'Organic'],
  'potato':      ['Standard', 'Organic'],
  'onion':       ['Big', 'Red', 'Pre-Packed'],
  'brinjal':     ['Purple Long', 'Round', 'Green'],
  'cabbage':     ['Green', 'Red', 'Cauliflower'],
  'watermelon':  ['Seeded', 'Seedless'],
  'cucumber':    ['Standard', 'Salad'],
  'pumpkin':     ['Standard', 'Organic'],
}

const DEFAULT_VARIETIES = ['Standard', 'Organic', 'Imported']

export function getVarieties(category, hasVarieties) {
  if (!hasVarieties) return null
  const key = category?.toLowerCase()
  return VARIETY_MAP[key] ?? DEFAULT_VARIETIES
}

export const PRICE_PER_KG = {
  apple: 2000, banana: 300, mango: 500, avocado: 540,
  tomato: 560, carrot: 370, potato: 340, onion: 290,
  capsicum: 610, 'bell pepper': 610, broccoli: 2400, cabbage: 130,
  cauliflower: 1110, cucumber: 300, pumpkin: 80, watermelon: 140,
  pineapple: 280, papaya: 120, grape: 3060, grapes: 3060,
  orange: 410, melon: 140, kiwi: 3000, pear: 2340,
  mandarin: 410, 'passion fruit': 690, rambutan: 1590, guava: 720,
  pomegranate: 3200, 'dragon fruit': 2540, brinjal: 300,
  default: 400,
}

export const PLU_MAP = {
  apple: 4131, banana: 4011, mango: 3114, tomato: 3664,
  carrot: 3060, potato: 4072, onion: 3148, capsicum: 3627,
  'bell pepper': 3627, broccoli: 3082, cabbage: 3115,
  cucumber: 4062, watermelon: 3421, pineapple: 3135,
  grape: 4022, grapes: 4022, orange: 3107, mandarin: 3458,
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
