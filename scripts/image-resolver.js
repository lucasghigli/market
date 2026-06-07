import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

const manualFileAliases = {
  redapples: 'Red Apples',
  bloodorange: 'Blood Oranges',
  icebergelettuce: 'Iceberg Lettuce',
  feta: 'Feta Cheese',
  havarty: 'Havarti',
  shreddeditalianbread: 'Shredded Italian Blend',
  blackforeestham: 'Black Forest Ham',
  porkchopesbonein: 'Pork Chops Bone-In',
  groundbeef8020: 'Ground Beef 80/20',
  groundbeef9010: 'Ground Beef 90/10',
  groundbeef937: 'Ground Beef 93/7',
};

const manualProductImageSource = {
  'Pasture-Raised Eggs': 'Free-Range Eggs',
};

export function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function toImagePath(filename) {
  return `/images/${filename}`;
}

export function loadImageFiles() {
  try {
    return readdirSync(imagesDir)
      .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
      .map((filename) => ({
        filename,
        base: filename.replace(/\.[^.]+$/, ''),
        norm: normalize(filename.replace(/\.[^.]+$/, '')),
        path: toImagePath(filename),
      }));
  } catch {
    return [];
  }
}

export function findExactProductName(base, productNames) {
  const norm = normalize(base);

  if (manualFileAliases[norm]) {
    const alias = manualFileAliases[norm];
    if (productNames.includes(alias)) return alias;
  }

  const exact = productNames.find((name) => normalize(name) === norm);
  if (exact) return exact;

  const compact = base.toLowerCase().replace(/\s+/g, '');
  const spacedMatch = productNames.find((name) => name.toLowerCase().replace(/\s+/g, '') === compact);
  if (spacedMatch) return spacedMatch;

  const pluralFromSingular = productNames.find(
    (name) => normalize(name) === `${norm}s` || normalize(name) === `${norm}es`
  );
  if (pluralFromSingular) return pluralFromSingular;

  const singularFromPlural = productNames.find((name) => {
    const n = normalize(name);
    return `${n}s` === norm || `${n}es` === norm || n.slice(0, -1) === norm;
  });
  if (singularFromPlural) return singularFromPlural;

  return null;
}

function matchScore(productName, imageBase) {
  const productNorm = normalize(productName);
  const imageNorm = normalize(imageBase);

  if (productNorm === imageNorm) return 1000;
  if (productNorm.includes(imageNorm) || imageNorm.includes(productNorm)) {
    return 500 + imageNorm.length;
  }

  const productTokens = new Set(tokenize(productName));
  const imageTokens = tokenize(imageBase);
  let score = 0;

  for (const token of imageTokens) {
    if (productTokens.has(token)) score += token.length * 2;
  }

  return score;
}

function inferImageCategory(imageBase, productsByCategory, categoryBases) {
  let bestCategory = null;
  let bestScore = 0;

  for (const [category, bases] of Object.entries(categoryBases)) {
    for (const base of bases) {
      const score = matchScore(base, imageBase);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }
  }

  if (bestScore >= 8) return bestCategory;

  for (const [category, items] of Object.entries(productsByCategory)) {
    for (const product of items) {
      const score = matchScore(product.name, imageBase);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }
  }

  return bestCategory;
}

export function buildFullProductImageMap(products, categoryBases = {}) {
  const productNames = products.map((product) => product.name);
  const productsByCategory = {};
  const productByName = new Map();

  for (const product of products) {
    productsByCategory[product.category] = productsByCategory[product.category] || [];
    productsByCategory[product.category].push(product);
    productByName.set(product.name, product);
  }

  const imageFiles = loadImageFiles();
  const imageMeta = imageFiles.map((file) => {
    const assignedProduct = findExactProductName(file.base, productNames);
    const category = assignedProduct
      ? productByName.get(assignedProduct)?.category
      : inferImageCategory(file.base, productsByCategory, categoryBases);

    return {
      ...file,
      category,
      assignedProduct,
    };
  });

  const imagesByCategory = {};
  for (const image of imageMeta) {
    if (!image.category) continue;
    imagesByCategory[image.category] = imagesByCategory[image.category] || [];
    imagesByCategory[image.category].push(image);
  }

  const productImageMap = {};

  for (const image of imageMeta) {
    if (!image.assignedProduct) continue;
    productImageMap[image.assignedProduct] = image.path;
  }

  for (const [aliasProduct, sourceProduct] of Object.entries(manualProductImageSource)) {
    if (productByName.has(aliasProduct) && productImageMap[sourceProduct]) {
      productImageMap[aliasProduct] = productImageMap[sourceProduct];
    }
  }

  for (const product of products) {
    if (productImageMap[product.name]) continue;

    const categoryImages = imagesByCategory[product.category] || [];
    if (categoryImages.length === 0) continue;

    let bestImage = null;
    let bestScore = 0;

    for (const image of categoryImages) {
      const score = matchScore(product.name, image.base);
      if (score > bestScore) {
        bestScore = score;
        bestImage = image;
      }
    }

    if (!bestImage) continue;

    const productNorm = normalize(product.name);
    const imageNorm = normalize(bestImage.base);
    const strongMatch =
      bestScore >= 12 &&
      (productNorm.includes(imageNorm) || imageNorm.includes(productNorm));

    if (strongMatch) {
      productImageMap[product.name] = bestImage.path;
    }
  }

  return productImageMap;
}

export function hasExactLocalImage(name, productNames = [name]) {
  return loadImageFiles().some(
    (file) => findExactProductName(file.base, productNames) === name
  );
}

export function buildLocalImageMap(productNames) {
  const products = productNames.map((name) => ({ name, category: 'unknown' }));
  const map = buildFullProductImageMap(products);
  const result = {};
  for (const name of productNames) {
    if (map[name]) result[name] = map[name];
  }
  return result;
}
