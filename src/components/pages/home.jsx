import React from "react";
import "../../styles/pages/HomePage.css";
import "../../styles/global.css";
import Service1 from "../services/service1";
import Service2 from "../services/service2";
import Service3 from "../services/service3";
import Service4 from "../services/service4";
import Service5 from "../services/service5";

const HomePage = () => {
  return (
    <div>
      <div className="hero-section">
        <div className="hero-section-container">
          <div className="Project-title">
            <h1 className="hero-title">Bio-Track</h1>
          </div>

          <div className="project-description">
            <p className="hero-subtitle">Real-time patient health monitoring</p>
            <p className="hero-description">
              Empowering real-time health monitoring for patients and healthcare
              professionals
            </p>
          </div>
        </div>
      </div>
      <Service1 />
      <Service2 />
      <Service3 />
      <Service4 />
      <Service5 />

      <button className="menu-toggle my-2">Get Started Now!</button>
    </div>
  );
};

export default HomePage;
