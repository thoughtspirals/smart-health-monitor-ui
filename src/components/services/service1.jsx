import React from "react";
import "../../styles/services-styles/services.css";
import service1 from "../../images/service-images/service1.jpg";

const Service1 = () => {
  return (
    <div className="service1 my-2">
      <h2> What we offer....</h2>

      <div className="service1-container container">
        <div className="row">
          <div className="service-content col-md-6 text-center">
            <h3> Real-Time Health Monitoring</h3>
            <p>
              Track your health metrics effortlessly with our real-time
              monitoring tools. Stay informed, stay healthy.
            </p>
          </div>
          <div className="col-md-6 text-center mb-2">
            <img src={service1} alt="Logo" className="header-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service1;
