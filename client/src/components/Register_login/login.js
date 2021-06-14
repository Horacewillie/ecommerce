import React, { Component } from "react";
import FormField from "../utils/Form/formField";
import { update, generateData, isFormValid } from "../utils/Form/formActions";
import {withRouter} from 'react-router-dom'

/*Because this component will connect to our API */
import { connect } from "react-redux";


import {loginUser} from '../../actions/user_actions'

class Login extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formdata: {
      email: {
        element: "input",
        value: "",
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email",
        },
        validation: {
          required: true,
          email: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      password: {
        element: "input",
        value: "",
        config: {
          name: "password_input",
          type: "password",
          placeholder: "Enter your password",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    },
  };

  submitForm = (e) => {
      e.preventDefault()
      let dataToSubmit = generateData(this.state.formdata, 'login')
      let formIsValid = isFormValid(this.state.formdata, 'login')

      if(formIsValid){
        this.props.dispatch(loginUser(dataToSubmit)).then(response => {
            if(response.payload.loginSuccess){
                console.log(response.payload)
                this.props.history.push('/user/dashboard')
            }else{
                this.setState({
                    formError: true
                })
            }
        })
      }else{
          this.setState({
              formError: 'true'
          })
      }

  };

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "login");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };
  render() {
    return (
      <div className="signin_wrapper">
        <form onSubmit={(e) => this.submitForm(e)}>
          <FormField
            id={"email"}
            formdata={this.state.formdata.email}
            change={(element) => this.updateForm(element)}
          />

          <FormField
            id={"password"}
            formdata={this.state.formdata.password}
            change={(element) => this.updateForm(element)}
          />

          {this.state.formError ? (
            <div className = 'error_label'>Please check your data</div>
          ) : null}
          <button onClick = {(e) => this.submitForm(e)}>
              LOG IN
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(withRouter(Login));
