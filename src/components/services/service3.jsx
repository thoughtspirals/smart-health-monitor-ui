import React from "react";
import "../../styles/services-styles/services.css";
import service3 from "../../images/service-images/service3.jpg";

const Service3 = () => {
  return (
    <div className="service1 my-2">
      <div className="service1-container container">
        <div className="row">
          <div className="service-content col-md-6 text-center">
            <h3>Remote Doctor Consultation</h3>
            <p>
              Easily connect with healthcare professionals from the comfort of
              your own home. Our remote doctor consultation service allows you
              to schedule a video call with a doctor at a time that suits you.
            </p>
          </div>
          <div className="col-md-6 text-center mb-2">
            <img src={service3} alt="Logo" className="header-logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service3;
