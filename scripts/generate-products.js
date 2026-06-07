import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getImageForProduct } from './product-images.js';
import { getDescriptionForProduct } from './product-descriptions.js';
import { getOriginForProduct } from './product-origins.js';
import { buildFullProductImageMap, writeLocalProductImagesFile } from './local-image-map.js';
import { hasExactLocalImage } from './image-resolver.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_PER_CATEGORY = 50;
const BAKERY_COUNT = 40;
const BEVERAGES_COUNT = 40;
const SNACKS_COUNT = 40;
const VEGETABLE_COUNT = 20;
const SEAFOOD_COUNT = 10;

const EGG_BASES = [
  'Large Eggs', 'Organic Eggs', 'Free-Range Eggs', 'Brown Eggs', 'Egg Whites Carton',
  'Pasture-Raised Eggs',
];

const SEAFOOD_BASES = [
  'Atlantic Salmon Fillet', 'Wild Caught Salmon', 'Sockeye Salmon', 'Smoked Salmon',
  'Cod Fillet', 'Tilapia Fillet', 'Halibut Fillet', 'Mahi Mahi', 'Sea Bass', 'Swordfish Steak',
];

const categoryData = {
  fruits: {
    units: ['lb', 'bunch', 'bag', 'each', 'pack', 'oz'],
    priceRange: [0.99, 8.99],
    image: 'https://images.unsplash.com/photo-1610831309487-5b41b0b0b0b0',
    fruitBases: [
      'Red Apples', 'Green Apples', 'Gala Apples', 'Honeycrisp Apples', 'Fuji Apples',
      'Bananas', 'Plantains', 'Avocados', 'Lemons', 'Limes', 'Oranges', 'Blood Oranges',
      'Grapefruit', 'Clementines', 'Mandarins', 'Tangerines', 'Strawberries', 'Blueberries',
      'Raspberries', 'Blackberries', 'Cranberries', 'Grapes Red', 'Grapes Green', 'Grapes Black',
      'Watermelon', 'Cantaloupe', 'Honeydew', 'Pineapple', 'Mango', 'Papaya', 'Kiwi',
      'Peaches', 'Nectarines', 'Plums', 'Apricots', 'Cherries', 'Pears', 'Asian Pears',
    ],
    modifiers: ['Organic', 'Fresh', 'Local Farm', 'Premium', 'Baby', 'Ripe', 'Sweet', 'Crisp'],
    desc: (name) => `Fresh ${name.toLowerCase()}, carefully selected for quality and flavor.`,
  },
  vegetables: {
    units: ['lb', 'bunch', 'bag', 'each', 'pack', 'oz'],
    priceRange: [0.99, 8.99],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    bases: [
      'Spinach', 'Kale', 'Romaine Lettuce', 'Iceberg Lettuce', 'Arugula', 'Mixed Greens',
      'Broccoli', 'Cauliflower', 'Carrots', 'Celery', 'Cucumbers', 'Zucchini', 'Yellow Squash',
      'Bell Peppers Red', 'Bell Peppers Green', 'Bell Peppers Yellow', 'Jalapeños', 'Serrano Peppers',
      'Tomatoes', 'Cherry Tomatoes', 'Grape Tomatoes', 'Roma Tomatoes', 'Heirloom Tomatoes',
      'Onions Yellow', 'Onions Red', 'Onions White', 'Garlic', 'Shallots', 'Scallions',
      'Potatoes Russet', 'Potatoes Red', 'Potatoes Yukon', 'Sweet Potatoes', 'Yams',
      'Mushrooms White', 'Mushrooms Cremini', 'Mushrooms Portobello', 'Asparagus', 'Green Beans',
      'Sugar Snap Peas', 'Snow Peas', 'Corn on the Cob', 'Eggplant', 'Beets', 'Radishes',
      'Cabbage Green', 'Cabbage Red', 'Bok Choy', 'Brussels Sprouts', 'Artichokes', 'Leeks',
      'Fennel', 'Okra', 'Collard Greens', 'Swiss Chard', 'Turnips', 'Parsnips', 'Ginger Root',
      'Cilantro Bunch', 'Parsley Bunch', 'Basil Bunch', 'Mint Bunch', 'Dill Bunch',
      'Organic Baby Carrots', 'Pre-Cut Veggie Tray', 'Salad Mix Spring', 'Coleslaw Mix',
      'Stir Fry Vegetable Blend',
    ],
    modifiers: ['Organic', 'Fresh', 'Local Farm', 'Premium', 'Baby', 'Crisp', 'Tender', 'Leafy'],
    desc: (name) => `Fresh ${name.toLowerCase()}, carefully selected for quality and flavor.`,
  },
  dairy: {
    units: ['gallon', 'half gallon', 'quart', 'pack', 'lb', 'oz', 'each', 'tub'],
    priceRange: [1.49, 14.99],
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da',
    bases: [
      'Whole Milk', '2% Milk', '1% Milk', 'Skim Milk', 'Lactose-Free Milk', 'Organic Milk',
      'Chocolate Milk', 'Buttermilk', 'Heavy Cream', 'Half and Half', 'Whipping Cream',
      'Sour Cream', 'Cottage Cheese', 'Cream Cheese', 'Ricotta Cheese', 'Mascarpone',
      'Cheddar Cheese Block', 'Sharp Cheddar', 'Mild Cheddar', 'Mozzarella Cheese',
      'Fresh Mozzarella', 'Parmesan Cheese', 'Pecorino Romano', 'Swiss Cheese', 'Provolone',
      'Gouda Cheese', 'Brie Cheese', 'Camembert', 'Blue Cheese', 'Feta Cheese', 'Goat Cheese',
      'Monterey Jack', 'Colby Jack', 'Pepper Jack', 'Havarti', 'Muenster', 'Fontina',
      'American Cheese Slices', 'String Cheese', 'Shredded Mexican Blend', 'Shredded Italian Blend',
      'Greek Yogurt Plain', 'Greek Yogurt Vanilla', 'Greek Yogurt Strawberry', 'Regular Yogurt',
      'Icelandic Yogurt', 'Kefir Plain', 'Kefir Berry', 'Probiotic Drink', 'Smoothie Yogurt',
      'Salted Butter', 'Unsalted Butter', 'European Style Butter', 'Whipped Butter',
      'Margarine', 'Vegan Butter', 'Coffee Creamer', 'Flavored Creamer Vanilla',
      'Flavored Creamer Hazelnut', 'Almond Milk', 'Oat Milk', 'Soy Milk', 'Coconut Milk',
      'Cashew Milk', 'Rice Milk', 'Chocolate Almond Milk', 'Vanilla Oat Milk',
      'Cheese Slices Cheddar', 'Cheese Slices Swiss', 'Snack Cheese Cubes',
      'Deli Swiss Slices', 'Deli Provolone Slices', 'Deli American Slices',
      'Laughing Cow Wedges', 'Cheese Spread', 'Queso Fresco', 'Queso Blanco',
      'Paneer', 'Halloumi', 'Burrata', 'Fresh Mozzarella Balls', 'Smoked Gouda',
      'Aged Cheddar 2 Year', 'Aged Cheddar 5 Year', 'Gruyère Cheese', 'Manchego',
      'Asiago Cheese', 'Romano Cheese', 'Parmesan Grated', 'Parmesan Shaved',
      'Cream Cheese Spread Strawberry', 'Cream Cheese Spread Chive', 'Neufchâtel',
      'Clotted Cream', 'Crème Fraîche', 'Egg Nog', 'Flan Mix', 'Pudding Cups Vanilla',
      'Pudding Cups Chocolate', 'Custard Cups', 'Dessert Yogurt', 'Frozen Yogurt Tub',
      'Whipped Topping', 'Cool Whip Style Topping', 'Sour Cream Dip', 'Ranch Dip Cup',
      'Onion Dip Cup', 'Cheese Ball', 'Cheese Curds', 'Farmers Cheese',
    ],
    modifiers: ['Organic', 'Farm Fresh', 'Premium', 'Low-Fat', 'Full-Fat', 'Family Size'],
    desc: (name) => `Quality ${name.toLowerCase()} from trusted dairy suppliers.`,
  },
  eggs: {
    units: ['dozen', 'pack', 'carton', 'each', 'oz'],
    priceRange: [2.49, 8.99],
    image: 'https://images.unsplash.com/photo-1582722872405-2c924fcd15f2',
    bases: EGG_BASES,
    modifiers: ['Organic', 'Farm Fresh', 'Free-Range', 'Pasture-Raised', 'Large', 'Brown'],
    desc: (name) => `Quality ${name.toLowerCase()} from trusted farms.`,
  },
  meat: {
    units: ['lb', 'pack', 'each', 'oz', 'tray'],
    priceRange: [3.99, 24.99],
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
    bases: [
      'Chicken Breast Boneless', 'Chicken Thighs', 'Chicken Drumsticks', 'Chicken Wings',
      'Whole Chicken', 'Chicken Tenderloins', 'Ground Chicken', 'Chicken Cutlets',
      'Turkey Breast', 'Ground Turkey', 'Turkey Cutlets', 'Whole Turkey',
      'Beef Ribeye Steak', 'Beef Sirloin Steak', 'Beef T-Bone Steak', 'Beef Filet Mignon',
      'Beef Strip Steak', 'Beef Flank Steak', 'Beef Skirt Steak', 'Beef Chuck Roast',
      'Beef Brisket', 'Beef Short Ribs', 'Ground Beef 80/20', 'Ground Beef 90/10',
      'Ground Beef 93/7', 'Beef Stew Meat', 'Beef Cube Steak', 'Beef Liver',
      'Pork Chops Bone-In', 'Pork Chops Boneless', 'Pork Tenderloin', 'Pork Shoulder',
      'Pork Ribs Baby Back', 'Pork Ribs Spare', 'Pork Belly', 'Ground Pork',
      'Pork Sausage Links', 'Italian Sausage', 'Bratwurst', 'Kielbasa', 'Chorizo',
      'Bacon Thick Cut', 'Bacon Regular Cut', 'Turkey Bacon', 'Canadian Bacon',
      'Ham Slices', 'Honey Ham', 'Black Forest Ham', 'Prosciutto', 'Salami',
      'Pepperoni Slices', 'Mortadella', 'Pastrami', 'Roast Beef Deli', 'Corned Beef',
      'Lamb Chops', 'Lamb Leg', 'Ground Lamb', 'Lamb Stew Meat', 'Veal Cutlets',
      'Meatballs Beef', 'Meatballs Turkey', 'Meatloaf Mix', 'Kebab Meat Beef',
      'Kebab Meat Chicken', 'Fajita Chicken Strips', 'Fajita Beef Strips',
      'Stuffed Chicken Breast', 'Rotisserie Chicken', 'Hot Dogs Beef',
    ],
    modifiers: ['Fresh', 'Premium', 'Organic', 'Grass-Fed', 'Free-Range', 'Angus'],
    desc: (name) => `Premium ${name.toLowerCase()}, sourced for freshness and great taste.`,
  },
  seafood: {
    units: ['lb', 'pack', 'each', 'oz', 'tray'],
    priceRange: [4.99, 29.99],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b2a2',
    bases: [
      ...SEAFOOD_BASES,
      'Tuna Steak', 'Shrimp Raw Peeled', 'Shrimp Cooked', 'Jumbo Shrimp',
      'Scallops', 'Crab Legs', 'Lobster Tail', 'Mussels', 'Clams', 'Oysters',
      'Calamari Rings', 'Octopus', 'Catfish Fillet', 'Trout Fillet', 'Sardines Fresh',
      'Anchovies', 'Crawfish', 'Crab Meat', 'Imitation Crab', 'Fish Sticks Pack',
    ],
    modifiers: ['Fresh', 'Premium', 'Wild-Caught', 'Sustainable', 'Frozen', 'Day-Boat'],
    desc: (name) => `Premium ${name.toLowerCase()}, sourced for freshness and great taste.`,
  },
  bakery: {
    units: ['loaf', 'pack', 'each', 'dozen', 'box', 'oz'],
    priceRange: [1.99, 12.99],
    image: 'https://images.unsplash.com/photo-1509440155596-9aae8455f224',
    bases: [
      'Sourdough Bread', 'Whole Wheat Bread', 'White Bread', 'Multigrain Bread',
      'Rye Bread', 'Pumpernickel Bread', 'Ciabatta Loaf', 'French Baguette',
      'Italian Bread', 'Focaccia', 'Naan Bread', 'Pita Bread', 'Tortillas Flour',
      'Tortillas Corn', 'Croissants', 'Chocolate Croissants', 'Almond Croissants',
      'Danish Pastry', 'Blueberry Danish', 'Cheese Danish', 'Apple Danish',
      'Muffins Blueberry', 'Muffins Chocolate Chip', 'Muffins Banana Nut',
      'Muffins Bran', 'Muffins Lemon Poppy', 'Donuts Glazed', 'Donuts Chocolate',
      'Donuts Jelly Filled', 'Donuts Old Fashioned', 'Donut Holes',
      'Bagels Plain', 'Bagels Everything', 'Bagels Cinnamon Raisin', 'Bagels Sesame',
      'Bagels Blueberry', 'English Muffins', 'Cinnamon Rolls', 'Sticky Buns',
      'Dinner Rolls', 'Hawaiian Rolls', 'Pretzel Rolls', 'Brioche Buns',
      'Hamburger Buns', 'Hot Dog Buns', 'Sub Rolls', 'Hoagie Rolls',
      'Garlic Bread', 'Cheese Bread', 'Banana Bread', 'Zucchini Bread',
      'Pumpkin Bread', 'Lemon Loaf', 'Marble Loaf', 'Coffee Cake',
      'Pound Cake', 'Angel Food Cake', 'Chocolate Cake Slice', 'Cheesecake Slice',
      'Tiramisu Cup', 'Eclairs', 'Cannoli', 'Baklava', 'Strudel Apple',
      'Pie Apple', 'Pie Cherry', 'Pie Pumpkin', 'Pie Pecan', 'Pie Blueberry',
      'Pie Key Lime', 'Tart Fruit', 'Brownies', 'Blondies', 'Cookies Chocolate Chip',
      'Cookies Oatmeal Raisin', 'Cookies Sugar', 'Cookies Peanut Butter',
      'Snickerdoodles', 'Macarons Assorted', 'Cupcakes Vanilla', 'Cupcakes Chocolate',
      'Cupcakes Red Velvet', 'Cupcakes Carrot', 'Whoopie Pies', 'Scones Plain',
      'Scones Cranberry', 'Biscuits Buttermilk', 'Cornbread', 'Flatbread',
      'Pizza Dough Fresh', 'Pie Crust Ready', 'Phyllo Dough', 'Puff Pastry Sheets',
      'Cake Donuts', 'Bear Claws', 'Palmiers', 'Turnovers Apple', 'Turnovers Cherry',
      'Kolaches Fruit', 'Kolaches Sausage',
    ],
    modifiers: ['Fresh Baked', 'Artisan', 'Homestyle', 'Premium', 'Daily Baked', 'Warm'],
    desc: (name) => `Freshly baked ${name.toLowerCase()}, made in-store every morning.`,
  },
  beverages: {
    units: ['bottle', 'pack', 'can', 'box', 'gallon', 'liter', 'each'],
    priceRange: [0.99, 18.99],
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
    bases: [
      'Orange Juice', 'Apple Juice', 'Grape Juice', 'Cranberry Juice', 'Pineapple Juice',
      'Grapefruit Juice', 'Tomato Juice', 'V8 Vegetable Juice', 'Lemonade', 'Pink Lemonade',
      'Limeade', 'Fruit Punch', 'Mango Nectar', 'Peach Nectar', 'Tropical Blend Juice',
      'Cold Brew Coffee', 'Iced Coffee', 'Bottled Latte', 'Espresso Drink', 'Cappuccino Drink',
      'Bottled Mocha', 'Energy Drink Original', 'Energy Drink Sugar Free', 'Energy Drink Tropical',
      'Sports Drink Blue', 'Sports Drink Red', 'Sports Drink Lemon-Lime', 'Sports Drink Orange',
      'Electrolyte Water', 'Coconut Water', 'Aloe Vera Drink', 'Kombucha Ginger',
      'Kombucha Berry', 'Kombucha Original', 'Probiotic Drink', 'Smoothie Strawberry',
      'Smoothie Mango', 'Smoothie Green', 'Protein Shake Chocolate', 'Protein Shake Vanilla',
      'Cola Regular', 'Cola Zero', 'Diet Cola', 'Root Beer', 'Ginger Ale', 'Cream Soda',
      'Orange Soda', 'Grape Soda', 'Cherry Soda', 'Lemon-Lime Soda', 'Club Soda',
      'Tonic Water', 'Sparkling Water Plain', 'Sparkling Water Lime', 'Sparkling Water Berry',
      'Sparkling Water Grapefruit', 'Flavored Water Lemon', 'Flavored Water Strawberry',
      'Flavored Water Peach', 'Mineral Water', 'Spring Water', 'Distilled Water',
      'Black Tea Bottled', 'Green Tea Bottled', 'Sweet Tea', 'Iced Tea Peach',
      'Iced Tea Lemon', 'Iced Tea Raspberry', 'Herbal Tea Chamomile', 'Herbal Tea Peppermint',
      'Chai Tea Latte', 'Hot Chocolate Mix', 'Apple Cider', 'Sparkling Cider',
      'Egg Nog Seasonal', 'Horchata', 'Agua Fresca Mango', 'Agua Fresca Watermelon',
      'Cold Pressed Juice Green', 'Cold Pressed Juice Beet', 'Cold Pressed Juice Carrot',
      'Wheatgrass Shot', 'Ginger Shot', 'Turmeric Shot', 'Meal Replacement Shake',
      'Chocolate Milk Bottle', 'Strawberry Milk', 'Kefir Drink', 'Yogurt Drink',
      'Wine Cooler', 'Hard Seltzer Lime', 'Hard Seltzer Berry', 'Mocktail Mojito',
      'Mocktail Margarita', 'Sangria Mix', 'Margarita Mix', 'Piña Colada Mix',
      'Bloody Mary Mix', 'Tonic Syrup', 'Simple Syrup', 'Coffee Concentrate',
      'Tea Concentrate', 'Instant Coffee Jar', 'Instant Tea Mix', 'Hot Cocoa K-Cups',
      'Juice Boxes Apple', 'Juice Boxes Grape', 'Juice Boxes Fruit Punch',
      'Powdered Drink Mix', 'Hydration Tablets', 'Vitamin Water', 'Almond Milk Drink',
    ],
    modifiers: ['Organic', 'No Sugar Added', 'Low Calorie', 'Premium', 'Family Size', 'Chilled'],
    desc: (name) => `Refreshing ${name.toLowerCase()}, perfect for any occasion.`,
  },
  snacks: {
    units: ['bag', 'box', 'pack', 'oz', 'each', 'tub', 'jar'],
    priceRange: [0.99, 11.99],
    image: 'https://images.unsplash.com/photo-1599490659213-2b952326a087',
    bases: [
      'Potato Chips Classic', 'Potato Chips BBQ', 'Potato Chips Sour Cream', 'Potato Chips Salt & Vinegar',
      'Potato Chips Jalapeño', 'Kettle Chips Sea Salt', 'Kettle Chips Pepper', 'Tortilla Chips',
      'Nacho Cheese Chips', 'Pita Chips', 'Veggie Chips', 'Plantain Chips', 'Banana Chips',
      'Pretzels Classic', 'Pretzels Honey Mustard', 'Pretzels Yogurt Covered', 'Pretzel Rods',
      'Popcorn Butter', 'Popcorn Kettle Corn', 'Popcorn Cheddar', 'Microwave Popcorn',
      'Cheese Puffs', 'Corn Puffs', 'Veggie Straws', 'Rice Cakes Plain', 'Rice Cakes Caramel',
      'Trail Mix Classic', 'Trail Mix Tropical', 'Trail Mix Nut Free', 'Mixed Nuts',
      'Cashews Roasted', 'Almonds Roasted', 'Peanuts Salted', 'Pistachios Shelled',
      'Walnuts', 'Pecans', 'Macadamia Nuts', 'Sunflower Seeds', 'Pumpkin Seeds',
      'Granola Bars Oats', 'Granola Bars Chocolate', 'Granola Bars Peanut Butter',
      'Protein Bars Chocolate', 'Protein Bars Peanut', 'Energy Bars Fruit', 'Cereal Bars',
      'Cookies Chocolate Chip', 'Cookies Oatmeal', 'Cookies Sandwich Creme', 'Cookies Wafer',
      'Cookies Shortbread', 'Cookies Ginger Snap', 'Crackers Saltine', 'Crackers Wheat',
      'Crackers Cheese', 'Crackers Ritz Style', 'Graham Crackers', 'Animal Crackers',
      'Goldfish Crackers', 'Cheese Crackers', 'Rice Crackers', 'Beef Jerky', 'Turkey Jerky',
      'Meat Sticks', 'Pork Rinds', 'Beef Sticks', 'Dried Mango', 'Dried Apricots',
      'Dried Cranberries', 'Raisins', 'Dates', 'Prunes', 'Fruit Snacks', 'Fruit Leather',
      'Gummy Bears', 'Gummy Worms', 'Sour Patch Candies', 'Licorice', 'Jelly Beans',
      'M&Ms Style Candies', 'Chocolate Bar Milk', 'Chocolate Bar Dark', 'Chocolate Bar White',
      'Chocolate Truffles', 'Peanut Butter Cups', 'Candy Bar Assorted', 'Mints Peppermint',
      'Gum Spearmint', 'Gum Bubble', 'Taffy', 'Toffee', 'Caramel Candies', 'Marshmallows',
      'S\'mores Kit', 'Pudding Snack Cups', 'Jello Cups', 'Applesauce Cups', 'Pudding Parfait',
      'Hummus Snack Pack', 'Guacamole Snack Pack', 'Salsa & Chips Combo', 'Cheese Snack Pack',
      'Beef Stick & Cheese', 'Ants on a Log Kit', 'Snack Mix Chex Style', 'Party Mix',
      'Wasabi Peas', 'Edamame Dry Roasted', 'Seaweed Snacks', 'Beef Ramen Cup',
      'Mac and Cheese Cup', 'Instant Noodle Cup', 'Peanut Butter Crackers', 'Cheese Dip Cups',
    ],
    modifiers: ['Organic', 'Gluten-Free', 'Low Sodium', 'Family Size', 'Single Serve', 'Party Size'],
    desc: (name) => `Delicious ${name.toLowerCase()}, a perfect snack for any time of day.`,
  },
};

function getCategoryBases(category, data) {
  if (category === 'fruits') return data.fruitBases;
  return data.bases;
}

function getAllCategoryBases() {
  const result = {};
  for (const [category, data] of Object.entries(categoryData)) {
    result[category] = getCategoryBases(category, data);
  }
  return result;
}

function collectProductNames() {
  const names = [];
  for (const [category, data] of Object.entries(categoryData)) {
    for (const base of getCategoryBases(category, data)) names.push(base);
  }
  return names;
}

function buildFruitNames(data) {
  return data.fruitBases.filter((name) => hasExactLocalImage(name, data.fruitBases));
}

function buildStandardNames(data, limit) {
  const names = new Set();

  for (const base of data.bases) {
    if (names.size >= limit) break;
    names.add(base);
  }

  let modifierIndex = 0;
  while (names.size < limit) {
    const base = data.bases[names.size % data.bases.length];
    const mod = data.modifiers[modifierIndex % data.modifiers.length];
    const variant = `${mod} ${base}`;
    if (!names.has(variant)) names.add(variant);
    modifierIndex++;
  }

  return [...names].slice(0, limit);
}

function buildCategoryNames(category, data) {
  switch (category) {
    case 'fruits':
      return buildFruitNames(data);
    case 'vegetables':
      return data.bases.slice(0, VEGETABLE_COUNT);
    case 'dairy':
      return buildStandardNames(data, PRODUCTS_PER_CATEGORY);
    case 'eggs':
      return [...data.bases];
    case 'meat':
      return buildStandardNames(data, PRODUCTS_PER_CATEGORY);
    case 'seafood':
      return data.bases.slice(0, SEAFOOD_COUNT);
    case 'bakery':
      return buildStandardNames(data, BAKERY_COUNT);
    case 'beverages':
      return buildStandardNames(data, BEVERAGES_COUNT);
    case 'snacks':
      return buildStandardNames(data, SNACKS_COUNT);
    default:
      return buildStandardNames(data, PRODUCTS_PER_CATEGORY);
  }
}

function buildProducts() {
  const products = [];
  let id = 1;

  for (const [category, data] of Object.entries(categoryData)) {
    const nameList = buildCategoryNames(category, data);

    nameList.forEach((name, index) => {
      const [minPrice, maxPrice] = data.priceRange;
      const price = +(minPrice + ((index * 7 + category.length) % 100) / 100 * (maxPrice - minPrice)).toFixed(2);
      const unit = data.units[index % data.units.length];
      const stock = 20 + ((index * 13) % 180);
      const rating = +(3.8 + ((index * 3) % 12) / 10).toFixed(1);
      const featured = index < 3 || index % 17 === 0;
      const origin = getOriginForProduct(name, category);
      const description = `${getDescriptionForProduct(name, category)} Sourced from ${origin}.`;

      products.push({
        id: id++,
        name,
        category,
        origin,
        price,
        unit,
        image: getImageForProduct(name, category),
        description,
        stock,
        featured,
        rating: Math.min(rating, 5.0),
      });
    });
  }

  return products;
}

const categoryBases = getAllCategoryBases();
const draftProducts = buildProducts();
const productImageMap = buildFullProductImageMap(draftProducts, categoryBases);
const products = draftProducts.map((product) => ({
  ...product,
  image: productImageMap[product.name] || product.image,
}));

writeFileSync(
  join(__dirname, '..', 'src', 'data', 'products.js'),
  `// Auto-generated: 9 categories (${products.length} total)\nexport const products = ${JSON.stringify(products, null, 2)};\n`,
  'utf8'
);

writeLocalProductImagesFile(
  productImageMap,
  join(__dirname, '..', 'src', 'data', 'localProductImages.js')
);

const counts = {};
const localCounts = {};
products.forEach((p) => {
  counts[p.category] = (counts[p.category] || 0) + 1;
  if (p.image.startsWith('/images/')) {
    localCounts[p.category] = (localCounts[p.category] || 0) + 1;
  }
});

console.log('Generated products:', products.length);
console.log('Per category:', counts);
console.log('Local images per category:', localCounts);
console.log('Local images mapped:', Object.keys(productImageMap).length);
