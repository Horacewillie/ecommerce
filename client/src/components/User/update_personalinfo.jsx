import React, { Component } from "react";
import FormField from "../utils/Form/formField";
import {
  update,
  generateData,
  isFormValid,
  populateFields,
} from "../utils/Form/formActions";
import { updateProfile, clearUpdateUser } from "../../actions/user_actions";

import { connect } from "react-redux";

class UpdatePersonalInfo extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formData: {
      name: {
        element: "input",
        value: "",
        config: {
          name: "name_input",
          type: "text",
          placeholder: "Enter your name",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      lastname: {
        element: "input",
        value: "",
        config: {
          lastname: "lastname_input",
          type: "text",
          placeholder: "Enter your last name",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
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
    },
  };

  updateForm = (element) => {
    const newFormData = update(element, this.state.formData, "update_user");

    this.setState({
      formError: false,
      formData: newFormData,
    });
  };

  submitForm = (e) => {
    e.preventDefault();
    let dataToSubmit = generateData(this.state.formData, "update_user");
    let formIsValid = isFormValid(this.state.formData, "update_user");

    if (formIsValid) {
      this.props.dispatch(updateProfile(dataToSubmit)).then((res) => {
        if (this.props.user.updateUser.success) {
          this.setState(
            {
              formSuccess: true,
            },
            () => {
              setTimeout(() => {
                this.props.dispatch(clearUpdateUser);
                this.setState({
                  formSuccess: false,
                });
              }, 2000);
            }
          );
        }
      });
    } else {
      this.setState({
        formError: true,
      });
    }
  };

  componentDidMount() {
    const newFormData = populateFields(
      this.state.formData,
      this.props.user.userData
    );

    this.setState({
      formData: newFormData,
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.submitForm(e)}>
          <h2>Person Information</h2>
          <div className="form_block_two">
            <div className="block">
              <FormField
                id={"name"}
                formdata={this.state.formData.name}
                change={(element) => this.updateForm(element)}
              />
            </div>
            <div className="block">
              <FormField
                id={"lastname"}
                formdata={this.state.formData.lastname}
                change={(element) => this.updateForm(element)}
              />
            </div>
          </div>
          <div>
            <div>
              <div className="block">
                <FormField
                  id={"email"}
                  formdata={this.state.formData.email}
                  change={(element) => this.updateForm(element)}
                />
              </div>
            </div>
          </div>
          <div>
            {this.state.form ? (
              <div className="form_success">Success</div>
            ) : null}
            {this.state.formError ? <div>Please check your data</div> : null}
            <button onClick={(e) => this.submitForm(e)}>
              Update Personal Information
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(UpdatePersonalInfo);
