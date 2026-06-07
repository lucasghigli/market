const categoryOrigins = {
  fruits: ['United States', 'Mexico', 'Chile', 'Ecuador', 'Peru', 'Costa Rica', 'Spain', 'Italy'],
  vegetables: ['United States', 'Mexico', 'Canada', 'Netherlands', 'Spain', 'Guatemala'],
  dairy: ['United States', 'France', 'Italy', 'Netherlands', 'Switzerland', 'Denmark', 'Greece'],
  eggs: ['United States', 'Canada'],
  meat: ['United States', 'Australia', 'Canada', 'Brazil', 'New Zealand'],
  seafood: ['Norway', 'Chile', 'United States', 'Canada', 'Iceland', 'Japan', 'Ecuador'],
  bakery: ['United States'],
  beverages: ['United States', 'Mexico', 'Colombia', 'Brazil', 'Italy', 'France'],
  snacks: ['United States', 'Mexico', 'Canada'],
};

const keywordOrigins = [
  ['honeycrisp apples', 'United States'],
  ['gala apples', 'United States'],
  ['fuji apples', 'Japan'],
  ['green apples', 'United States'],
  ['red apples', 'United States'],
  ['bananas', 'Ecuador'],
  ['plantains', 'Ecuador'],
  ['avocados', 'Mexico'],
  ['blood oranges', 'Italy'],
  ['oranges', 'United States'],
  ['clementines', 'Spain'],
  ['mandarins', 'Morocco'],
  ['tangerines', 'Morocco'],
  ['grapefruit', 'United States'],
  ['lemons', 'United States'],
  ['limes', 'Mexico'],
  ['strawberries', 'United States'],
  ['blueberries', 'United States'],
  ['raspberries', 'United States'],
  ['blackberries', 'United States'],
  ['cranberries', 'United States'],
  ['grapes red', 'Chile'],
  ['grapes green', 'Chile'],
  ['grapes black', 'Italy'],
  ['watermelon', 'United States'],
  ['cantaloupe', 'United States'],
  ['honeydew', 'Guatemala'],
  ['pineapple', 'Costa Rica'],
  ['mango', 'Mexico'],
  ['papaya', 'Mexico'],
  ['kiwi', 'New Zealand'],
  ['peaches', 'United States'],
  ['nectarines', 'United States'],
  ['cherries', 'United States'],
  ['pears', 'United States'],
  ['jalape', 'Mexico'],
  ['serrano peppers', 'Mexico'],
  ['bell peppers', 'Mexico'],
  ['tomatoes', 'Mexico'],
  ['cherry tomatoes', 'Mexico'],
  ['cucumbers', 'Mexico'],
  ['zucchini', 'Mexico'],
  ['yellow squash', 'Mexico'],
  ['avocado', 'Mexico'],
  ['spinach', 'United States'],
  ['kale', 'United States'],
  ['romaine lettuce', 'United States'],
  ['iceberg lettuce', 'United States'],
  ['arugula', 'Italy'],
  ['mixed greens', 'United States'],
  ['broccoli', 'United States'],
  ['cauliflower', 'United States'],
  ['carrots', 'United States'],
  ['celery', 'United States'],
  ['parmesan', 'Italy'],
  ['pecorino', 'Italy'],
  ['mozzarella', 'Italy'],
  ['fresh mozzarella', 'Italy'],
  ['gouda', 'Netherlands'],
  ['brie', 'France'],
  ['camembert', 'France'],
  ['blue cheese', 'France'],
  ['feta', 'Greece'],
  ['goat cheese', 'France'],
  ['havarti', 'Denmark'],
  ['swiss cheese', 'Switzerland'],
  ['provolone', 'Italy'],
  ['fontina', 'Italy'],
  ['muenster', 'France'],
  ['cheddar', 'United Kingdom'],
  ['greek yogurt', 'Greece'],
  ['icelandic yogurt', 'Iceland'],
  ['kefir', 'Russia'],
  ['probiotic drink', 'United States'],
  ['salmon', 'Norway'],
  ['cod', 'Iceland'],
  ['tilapia', 'Ecuador'],
  ['halibut', 'United States'],
  ['mahi mahi', 'Ecuador'],
  ['sea bass', 'Greece'],
  ['swordfish', 'United States'],
  ['shrimp', 'Ecuador'],
  ['lobster', 'United States'],
  ['crab', 'United States'],
  ['tuna', 'Philippines'],
  ['prosciutto', 'Italy'],
  ['salami', 'Italy'],
  ['chorizo', 'Spain'],
  ['kielbasa', 'Poland'],
  ['bratwurst', 'Germany'],
  ['lamb', 'New Zealand'],
  ['beef', 'United States'],
  ['chicken', 'United States'],
  ['turkey', 'United States'],
  ['pork', 'United States'],
  ['bacon', 'United States'],
  ['eggs', 'United States'],
  ['sourdough', 'United States'],
  ['baguette', 'France'],
  ['ciabatta', 'Italy'],
  ['croissants', 'France'],
  ['naan', 'India'],
  ['pita', 'Lebanon'],
  ['tortillas', 'Mexico'],
  ['orange juice', 'United States'],
  ['apple juice', 'United States'],
  ['coffee', 'Colombia'],
  ['kombucha', 'United States'],
  ['coconut water', 'Thailand'],
  ['cola', 'United States'],
  ['potato chips', 'United States'],
  ['tortilla chips', 'Mexico'],
  ['plantain chips', 'Ecuador'],
  ['cashews', 'Vietnam'],
  ['almonds', 'United States'],
  ['pistachios', 'Iran'],
  ['macadamia', 'Australia'],
  ['dried mango', 'Philippines'],
  ['chocolate', 'Belgium'],
  ['gummy', 'Germany'],
];

const stripPrefixes = [
  'organic', 'fresh', 'local farm', 'premium', 'baby', 'ripe', 'sweet', 'crisp',
  'farm fresh', 'low-fat', 'full-fat', 'family size', 'gluten-free', 'low sodium',
  'single serve', 'party size', 'no sugar added', 'low calorie', 'chilled',
  'fresh baked', 'artisan', 'homestyle', 'daily baked', 'warm', 'grass-fed',
  'free-range', 'wild-caught', 'angus', 'wild caught',
];

function normalizeName(name) {
  let normalized = name.toLowerCase().trim();
  for (const prefix of stripPrefixes) {
    if (normalized.startsWith(`${prefix} `)) {
      normalized = normalized.slice(prefix.length + 1);
    }
  }
  return normalized;
}

function hashIndex(str, length) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function getOriginForProduct(name, category) {
  const normalized = normalizeName(name);

  for (const [keyword, origin] of keywordOrigins) {
    if (normalized.includes(keyword)) {
      return origin;
    }
  }

  const pool = categoryOrigins[category] || categoryOrigins.fruits;
  return pool[hashIndex(normalized, pool.length)];
}
