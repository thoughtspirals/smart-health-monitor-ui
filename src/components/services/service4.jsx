import React from "react";
import "../../styles/services-styles/services.css";
import service4 from "../../images/service-images/serivice4.jpg";

const Service4 = () => {
  return (
    <div className="service1 my-2">
      <div className="service1-container container">
        <div className="row">
          <div className="col-md-6 text-center mb-2">
            <img src={service4} alt="Logo" className="header-logo" />
          </div>
          <div className="service-content col-md-6 text-center">
            <h3>24/7 Support</h3>
            <p>
              Our team is here to help you at all hours. Feel free to reach out
              whenever you need assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service4;
