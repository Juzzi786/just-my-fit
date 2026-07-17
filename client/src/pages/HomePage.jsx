import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Categories from '../components/home/Categories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Just My Fit - Premium Men's Wear & Accessories</title>
        <meta name="description" content="Discover premium men's wear and accessories at Just My Fit. Shop the latest collection of shirts, trousers, suits, and accessories." />
      </Helmet>

      <div className="min-h-screen">
        <HeroSection />
        <FeaturedProducts />
        <Categories />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </div>
    </>
  );
};

export default HomePage;