import React from "react";
import "../../styles/services-styles/services.css";
import service2 from "../../images/service-images/service2.jpg";

const Service2 = () => {
  return (
    <div className="service1 my-2">
      <div className="service1-container container">
        <div className="row">
          <div className="col-md-6 text-center mb-2">
            <img src={service2} alt="Logo" className="header-logo" />
          </div>

          <div className="service-content col-md-6 text-center">
            <h3> Personalised Health Insights</h3>
            <p>
              Recieve custom insights based on your data to make informed
              decisions for better health outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service2;
