import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home(){
  return (
    <div className="home-wrapper">
      <div className="home-hero">
        <div className="home-overlay" />
        <div className="home-content">
          <h1 className="home-title">Welcome to HotelStay+</h1>
          <p className="home-subtitle">
            Experience luxurious stays & unforgettable dining.
          </p>

          <div className="home-actions">
            <Link className="home-btn primary" to="/rooms">Browse Rooms</Link>
            <Link className="home-btn secondary" to="/tables">Reserve a Table</Link>
          </div>
        </div>
      </div>

      <section className="home-info">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="card-grid">
          <div className="info-card">
            <h3>Luxury Rooms</h3>
            <p>
              Fully furnished rooms with world-class amenities and exciting views.
            </p>
          </div>
          <div className="info-card">
            <h3>Fine Dining</h3>
            <p>
              Delicious multi-cuisine dining experience curated by top chefs.
            </p>
          </div>
          <div className="info-card">
            <h3>24/7 Support</h3>
            <p>
              We’re here to make your stay comfortable, day or night.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
