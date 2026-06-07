import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { getImageSrc } from '../utils/imagePath';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') === 'true';
  const categories = productService.getAllCategories();

  useEffect(() => {
    let result;
    if (search) {
      result = productService.searchProducts(search);
    } else if (featured) {
      result = productService.getFeaturedProducts();
    } else if (category) {
      result = productService.getProductsByCategory(category);
    } else {
      result = productService.getAllProducts();
    }

    const sorted = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    setProducts(sorted);
  }, [category, search, featured, sortBy]);

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    params.delete('search');
    params.delete('featured');
    setSearchParams(params);
  };

  const activeCategory = categories.find((c) => c.id === category);
  const showCategorySections = !category && !search && !featured;

  const categorySections = showCategorySections
    ? categories
        .map((cat) => ({
          category: cat,
          products: products.filter((p) => p.category === cat.id),
        }))
        .filter((section) => section.products.length > 0)
    : [];

  return (
    <div className="page products-page">
      {activeCategory && (
        <div className="products-category-banner">
          <img src={getImageSrc(activeCategory.image)} alt="" aria-hidden="true" />
          <div className="products-category-banner-overlay">
            <span>{activeCategory.icon}</span>
            <h2>{activeCategory.name}</h2>
            <p>{activeCategory.description}</p>
          </div>
        </div>
      )}
      <div className="container">
        <div className="page-header products-page-header">
          <h1 className="page-title">
            {search
              ? `Results for "${search}"`
              : featured
                ? 'Featured Products'
                : activeCategory
                  ? activeCategory.name
                  : 'All Products'}
          </h1>
          <p className="page-subtitle">{products.length} products found</p>
        </div>

        <div className="products-layout">
          <aside className="products-sidebar">
            <h3>Categories</h3>
            <ul className="category-filter">
              <li>
                <button
                  className={`filter-btn ${!category && !featured ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`filter-btn ${category === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.icon} {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <label>
                Sort by:
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
                  <option value="name">Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </label>
            </div>

            {products.length > 0 ? (
              showCategorySections ? (
                <div className="category-sections">
                  {categorySections.map(({ category: cat, products: catProducts }) => (
                    <section key={cat.id} id={`category-${cat.id}`} className="category-products-section">
                      <div className="category-section-header">
                        <h2 className="category-section-title">
                          <span className="category-section-icon">{cat.icon}</span>
                          {cat.name}
                        </h2>
                        <p className="category-section-desc">{cat.description}</p>
                        <p className="category-section-count">{catProducts.length} items</p>
                      </div>
                      <div className="product-grid">
                        {catProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="empty-state">
                <p>No products found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
