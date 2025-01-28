import React from "react";
import "../../styles/services-styles/services.css";
import service5 from "../../images/service-images/service5.jpg";

const Service5 = () => {
  return (
    <div className="service1 my-2">
      <div className="service1-container container">
        <div className="row">
          <div className="service-content col-md-6 text-center">
            <h3>Secure Data Handling</h3>
            <p>
              Your health data is safe with us. We follow the highest standards
              to ensure your privacy and security.
            </p>
          </div>
          <div className="col-md-6 text-center mb-2">
            <img src={service5} alt="Logo" className="header-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service5;
