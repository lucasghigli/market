import { Link } from 'react-router-dom';
import { getImageSrc } from '../utils/imagePath';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${category.id}`} className="category-card">
      <div className="category-card-image">
        <img src={getImageSrc(category.image)} alt="" loading="lazy" aria-hidden="true" />
        <div className="category-card-overlay">
          <span className="category-icon" aria-hidden="true">{category.icon}</span>
          <h3 className="category-card-title">{category.name}</h3>
          <p className="category-card-desc">{category.description}</p>
          <span className="category-card-cta">Shop now →</span>
        </div>
      </div>
    </Link>
  );
}