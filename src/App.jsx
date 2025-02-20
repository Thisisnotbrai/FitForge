import React from 'react';
import Header from './components/LandingPage/Header';
import Hero from './components/LandingPage/Hero';
import About from './components/LandingPage/About';
import Features from './components/LandingPage/Features';
import Services from './components/LandingPage/Services';
import FAQ from './components/LandingPage/FAQ';
import Footer from './components/LandingPage/Footer';
import BackToTopButton from './components/LandingPage/BackToTopButton';

import './App.css';



function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <Features />
      <Services />
      <FAQ />  
      <Footer />
      <BackToTopButton />
    </div>
  );
}

export default App;