import { useState } from 'react';
import { STORE, STORE_ADDRESS_LINES } from '../config/store';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page contact-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We'd love to hear from you</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-card">
              <span className="contact-icon">📍</span>
              <h3>Address</h3>
              <p>
                {STORE_ADDRESS_LINES.map((line) => (
                  <span key={line}>{line}<br /></span>
                ))}
              </p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📧</span>
              <h3>Email</h3>
              <p>{STORE.email}</p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📞</span>
              <h3>Phone</h3>
              <p>{STORE.phone}</p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">🕐</span>
              <h3>Hours</h3>
              <p>{STORE.hours}</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="alert alert--success">
                Thank you! Your message has been sent. We'll get back to you soon.
              </div>
            )}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" value={form.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn--primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

