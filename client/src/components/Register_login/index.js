import React from "react";
import MyButton from "../utils/button";
import Login from './login'

const RegisterLogin = () => {
  return (
    <div className="page_wrapper">
      <div className="container">
        <div className="register_login_container">
          <div className="left">
            <h1>New Customer</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit
              aperiam quia nobis non eum explicabo! Eius voluptas temporibus
              beatae necessitatibus repellendus, repudiandae quibusdam, fuga
              quos, aspernatur cumque cum? Sit, nulla?
            </p>
            <MyButton
              type="default"
              title="Create an account"
              linkTo="/register"
              addStyles={{ margin: "10px 0 0 0" }}
            />
          </div>
          <div className="right">
              <h2>Registered Customers</h2>
              <p>If you have an account please log in.</p>
              <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;
