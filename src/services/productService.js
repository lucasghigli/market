import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { applyLocalProductImages } from '../data/localProductImages';

const PRODUCTS_KEY = 'supermarket_products';
const CATEGORIES_KEY = 'supermarket_categories';
const CATALOG_VERSION_KEY = 'supermarket_catalog_version';
const CATALOG_VERSION = '286-v27-full-local-images-ui';

const seedProductsById = new Map(initialProducts.map((product) => [product.id, product]));

function enrichProducts(products) {
  return applyLocalProductImages(products).map((product) => {
    const seed = seedProductsById.get(product.id);
    const origin = product.origin || seed?.origin || 'United States';
    let description = product.description || seed?.description || '';

    if (origin && !/sourced from/i.test(description)) {
      const base = description.trim().replace(/\.\s*$/, '');
      description = `${base}. Sourced from ${origin}.`;
    }

    return { ...product, origin, description };
  });
}

function ensureCatalogFresh() {
  const savedVersion = localStorage.getItem(CATALOG_VERSION_KEY);
  if (savedVersion !== CATALOG_VERSION) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(enrichProducts(initialProducts)));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
    localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
  }
}

function getStored(key, initial) {
  ensureCatalogFresh();
  const stored = localStorage.getItem(key);

  if (!stored) {
    const data = key === PRODUCTS_KEY ? enrichProducts(initial) : initial;
    localStorage.setItem(key, JSON.stringify(data));
    return [...data];
  }

  const parsed = JSON.parse(stored);
  if (key === PRODUCTS_KEY) {
    return enrichProducts(parsed);
  }
  return parsed;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const productService = {
  getAllProducts() {
    return getStored(PRODUCTS_KEY, initialProducts);
  },

  getProductById(id) {
    const products = this.getAllProducts();
    return products.find((p) => p.id === Number(id));
  },

  getProductsByCategory(categoryId) {
    return this.getAllProducts().filter((p) => p.category === categoryId);
  },

  getFeaturedProducts() {
    return this.getAllProducts().filter((p) => p.featured);
  },

  searchProducts(query) {
    const q = query.toLowerCase();
    return this.getAllProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.origin && p.origin.toLowerCase().includes(q))
    );
  },

  addProduct(product) {
    const products = this.getAllProducts();
    const newProduct = { ...product, id: Date.now(), rating: product.rating || 4.0 };
    products.push(newProduct);
    save(PRODUCTS_KEY, products);
    return newProduct;
  },

  updateProduct(id, updates) {
    const products = this.getAllProducts();
    const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...updates, id: Number(id) };
    save(PRODUCTS_KEY, products);
    return products[index];
  },

  deleteProduct(id) {
    const products = this.getAllProducts().filter((p) => p.id !== Number(id));
    save(PRODUCTS_KEY, products);
  },

  getAllCategories() {
    return getStored(CATEGORIES_KEY, initialCategories);
  },

  getCategoryById(id) {
    return this.getAllCategories().find((c) => c.id === id);
  },

  addCategory(category) {
    const categories = this.getAllCategories();
    const newCategory = { ...category, id: category.id || category.name.toLowerCase().replace(/\s+/g, '-') };
    categories.push(newCategory);
    save(CATEGORIES_KEY, categories);
    return newCategory;
  },

  updateCategory(id, updates) {
    const categories = this.getAllCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...updates, id };
    save(CATEGORIES_KEY, categories);
    return categories[index];
  },

  deleteCategory(id) {
    const categories = this.getAllCategories().filter((c) => c.id !== id);
    save(CATEGORIES_KEY, categories);
  },
};
