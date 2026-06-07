import { writeFileSync } from 'fs';
import { buildFullProductImageMap, buildLocalImageMap } from './image-resolver.js';

export { buildFullProductImageMap, buildLocalImageMap };

export function writeLocalProductImagesFile(map, outPath) {
  const output = `// Auto-generated from public/images — do not edit manually
export const localProductImages = ${JSON.stringify(map, null, 2)};

export function applyLocalProductImages(products) {
  return products.map((product) => {
    const localImage = localProductImages[product.name];
    if (localImage) {
      return { ...product, image: localImage };
    }
    return product;
  });
}
`;
  writeFileSync(outPath, output, 'utf8');
}

export function getLocalImageForProduct(name, map) {
  return map[name] || null;
}
