import React from "react";
import "../../styles/user-handler-styles/login.css"; // Custom styles for the login component
import "../../styles/global.css";

const Login = () => {
  return (
    <>
      <h1 className="pageTitle text-center p-4"> Login Page</h1>
      <div className="LoginPage">
        {/* <h1 className="pageTitle text-center p-4"> Login Page</h1> */}
        <div className="Logincontainer">
          <h2 className="text-center">Login here!</h2>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <a href="/sign-up">Register here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
