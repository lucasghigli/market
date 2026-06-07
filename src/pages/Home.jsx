import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { STORE, STORE_ADDRESS_SINGLE } from '../config/store';
import { getImageSrc } from '../utils/imagePath';
import ReviewsMarquee from '../components/ReviewsMarquee';
import { reviews } from '../data/reviews';
import { useReviewsModal } from '../context/ReviewsModalContext';

const FEATURES = [
  { icon: '🚚', title: 'Free Delivery', desc: 'On orders over €50 — straight to your door across Alba.' },
  { icon: '🌿', title: 'Farm-Fresh Quality', desc: 'Carefully sourced produce with country of origin on every item.' },
  { icon: '⚡', title: 'Fast Checkout', desc: 'Shop quickly with pickup or delivery — your choice.' },
  { icon: '🔒', title: 'Secure Shopping', desc: 'Safe payments and real-time order tracking you can trust.' },
];

const STEPS = [
  {
    num: '01',
    icon: 'browse',
    title: 'Browse & discover',
    desc: 'Explore 9 departments with real product photos and country-of-origin details.',
  },
  {
    num: '02',
    icon: 'cart',
    title: 'Build your basket',
    desc: 'Add fresh groceries and everyday essentials — adjust quantities anytime.',
  },
  {
    num: '03',
    icon: 'checkout',
    title: 'Checkout your way',
    desc: `Choose home delivery or free pickup at our ${STORE.city} store.`,
  },
  {
    num: '04',
    icon: 'track',
    title: 'Track & receive',
    desc: 'Follow your order in real time and enjoy farm-fresh quality at home.',
  },
];

function StepIcon({ type }) {
  const icons = {
    browse: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" strokeLinecap="round" />
      </svg>
    ),
    cart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M6 6h15l-1.5 9H7.5L6 6z" strokeLinejoin="round" />
        <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="19" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="17" cy="19" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    ),
    checkout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" strokeLinecap="round" />
      </svg>
    ),
    track: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M4 7h11v10H4z" strokeLinejoin="round" />
        <path d="M15 10h2l3 3v4h-5v-7z" strokeLinejoin="round" />
        <circle cx="7.5" cy="18.5" r="1.5" />
        <circle cx="17.5" cy="18.5" r="1.5" />
        <path d="M9 12h2M9 9h4" strokeLinecap="round" />
      </svg>
    ),
  };
  return <span className="step-icon">{icons[type]}</span>;
}

export default function Home() {
  const { openReviews } = useReviewsModal();
  const categories = productService.getAllCategories();
  const featured = productService.getFeaturedProducts().slice(0, 8);
  const heroProducts = productService.getAllProducts()
    .filter((p) => p.image.startsWith('/images/'))
    .slice(0, 6);
  const productCount = productService.getAllProducts().length;

  return (
    <div className="home">
      <section className="hero hero--split">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container hero-split">
          <div className="hero-content">
            <span className="hero-eyebrow">Alba&apos;s neighborhood supermarket, online</span>
            <h1 className="hero-title">Fresh Groceries, Delivered Fast</h1>
            <p className="hero-subtitle">
              Browse {productCount}+ quality products across {categories.length} categories.
              Real photos, transparent origins, and everyday essentials — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn--primary btn--lg">Shop Now</Link>
              <Link to="/products?category=fruits" className="btn btn--outline btn--lg">Browse Categories</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{productCount}+</span>
                <span className="hero-stat-label">Products</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">{categories.length}</span>
                <span className="hero-stat-label">Categories</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">€50</span>
                <span className="hero-stat-label">Free delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase" aria-hidden="true">
            <div className="hero-showcase-grid">
              {heroProducts.map((product, index) => (
                <div key={product.id} className={`hero-showcase-item hero-showcase-item--${index + 1}`}>
                  <img src={getImageSrc(product.image)} alt="" loading="eager" />
                </div>
              ))}
            </div>
            <div className="hero-showcase-badge">
              <span>100%</span>
              <small>Real product photos</small>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-strip-inner">
          <span>✓ Quality guaranteed</span>
          <span>✓ Secure checkout</span>
          <span>✓ Pickup & delivery</span>
          <span>✓ Country of origin shown</span>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-intro section-intro--centered">
            <span className="section-eyebrow">Why FreshMart</span>
            <h2 className="section-title">Shopping made simple</h2>
            <p className="section-desc">Everything you need for a smoother, more enjoyable grocery experience.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-intro section-intro--centered">
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title">From aisle to doorstep</h2>
            <p className="section-desc">Four simple steps from browsing to your doorstep — no hassle, no guesswork.</p>
          </div>
          <div className="steps-flow">
            {STEPS.map((step, index) => (
              <article key={step.num} className={`step-card step-card--${index + 1}`}>
                <div className="step-card-top">
                  <StepIcon type={step.icon} />
                  <span className="step-num">{step.num}</span>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {index < STEPS.length - 1 && <span className="step-connector" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-intro section-intro--centered">
            <span className="section-eyebrow">Departments</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-desc">Explore our aisles and find exactly what you need.</p>
          </div>
          <div className="category-chips">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-chip">
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section store-spotlight">
        <div className="container store-spotlight-inner">
          <div className="store-spotlight-text">
            <span className="section-eyebrow">Visit us in Alba</span>
            <h2 className="section-title">Your local FreshMart store</h2>
            <p className="store-address">{STORE_ADDRESS_SINGLE}</p>
            <p className="store-hours">{STORE.hours}</p>
            <p className="store-contact">{STORE.phone} · {STORE.email}</p>
            <Link to="/contact" className="btn btn--outline">Get directions</Link>
          </div>
          <div className="store-spotlight-visual">
            <img src={getImageSrc('/images/Whole Milk.png')} alt="" className="store-spotlight-img store-spotlight-img--1" />
            <img src={getImageSrc('/images/Strawberries.png')} alt="" className="store-spotlight-img store-spotlight-img--2" />
            <img src={getImageSrc('/images/Croissants.png')} alt="" className="store-spotlight-img store-spotlight-img--3" />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-header section-header--centered">
            <div className="section-intro section-intro--centered">
              <span className="section-eyebrow">Top picks</span>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-desc">Customer favorites and seasonal highlights hand-picked for you.</p>
            </div>
            <Link to="/products?featured=true" className="section-link">View all featured →</Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <div className="section-intro section-intro--centered">
            <span className="section-eyebrow">Community</span>
            <h2 className="section-title">What our shoppers say</h2>
            <p className="section-desc">
              Trusted by {reviews.length}+ happy customers across Alba — real feedback, real experiences.
            </p>
            <button type="button" className="btn btn--primary reviews-open-btn" onClick={openReviews}>
              See all reviews
            </button>
          </div>
        </div>
        <ReviewsMarquee />
      </section>

      <section className="section promo-banner">
        <div className="container promo-content">
          <div className="promo-text">
            <span className="promo-eyebrow">New customers</span>
            <h2>Get 20% off your first order</h2>
            <p>Use code <strong className="promo-code">WELCOME20</strong> at checkout. Limited-time welcome offer.</p>
          </div>
          <Link to="/register" className="btn btn--primary btn--lg promo-btn">Create free account</Link>
        </div>
      </section>
    </div>
  );
}
