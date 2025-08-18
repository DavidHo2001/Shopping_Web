import React from "react";
import "./HomePage.css";
import heroImage from "../assets/hero_comic.png";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Discover Your Perfect Vision</h1>
          <p className="hero__subtitle">
            Premium eyewear for every style and need. From classic frames to
            trendy designs, find the perfect glasses that enhance your look and
            improve your vision.
          </p>
          <div className="hero__features">
            <div className="feature">
              <h3>Premium Quality</h3>
              <p>High-quality lenses and durable frames</p>
            </div>
            <div className="feature">
              <h3>Expert Fitting</h3>
              <p>Professional consultation and fitting service</p>
            </div>
            <div className="feature">
              <h3>Wide Selection</h3>
              <p>Hundreds of styles for every taste and budget</p>
            </div>
          </div>
        </div>

        {/* Promotional Image Space */}
        <div className="hero__image">
          <div className="promo-image-placeholder">
            <img src={heroImage} alt="Comics" />
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro">
        <div className="intro__content">
          <h2>Why Choose Our Eyewear?</h2>
          <p>
            We believe that glasses are more than just a vision correction tool
            – they're an expression of your personality and style. Our carefully
            curated collection features the latest trends and timeless classics
            from top brands around the world.
          </p>
          <p>
            Whether you're looking for reading glasses, sunglasses, or
            prescription eyewear, our expert team is here to help you find the
            perfect pair that combines comfort, style, and functionality.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Find Your Perfect Glasses?</h2>
        <p>
          Browse our collection or visit our store for a personalized
          consultation
        </p>
        <div className="cta__buttons">
          <button className="btn btn--primary">Shop Now</button>
          <button className="btn btn--secondary">Book Appointment</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
