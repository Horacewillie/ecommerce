import React, { Component } from "react";

import FormField from "../../utils/Form/formField";
import {
  update,
  generateData,
  isFormValid,
  resetFields,
} from "../../utils/Form/formActions";

import { connect } from "react-redux";
import {
  getProductCategories,
  addWood,
} from "../../../actions/products_actions";

class ManageWoods extends Component {
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
          placeholder: "Enter your wood",
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

  showCategoryItems = () =>
    this.props.products.woods
      ? this.props.products.woods.map((item, i) => (
          <div className="category_item" key={item._id}>
            {item.name}
          </div>
        ))
      : null;

  submitForm = (e) => {
    e.preventDefault();
    let dataToSubmit = generateData(this.state.formData, "woods");
    let formIsValid = isFormValid(this.state.formData, "woods");
    let existingWoods = this.props.products.woods;
    if (formIsValid) {
      this.props.dispatch(addWood(dataToSubmit, existingWoods)).then((res) => {
        if (res.payload.success) {
          this.resetFieldsHandler();
        } else {
          this.setState({
            formError: true,
          });
        }
      });
    } else {
      this.setState({
        formError: true,
      });
    }
  };

  updateForm = (element) => {
    const newFormData = update(element, this.state.formData, "woods");

    this.setState({
      formError: false,
      formData: newFormData,
    });
  };

  resetFieldsHandler = () => {
    const newFormData = resetFields(this.state.formData, "woods");
    this.setState({
      formSuccess: true,
      formData: newFormData,
    });
  };

  componentDidMount() {
    this.props.dispatch(getProductCategories("woods"));
  }

  render() {
    return (
      <div className="admin_category_wrapper">
        <h1>Woods</h1>
        <div className="admin_two_column">
          <div className="left">
            <div className="brands_container">{this.showCategoryItems()}</div>
          </div>
          <div className="right">
            <form onSubmit={(e) => this.submitForm(e)}>
              <FormField
                id={"name"}
                formdata={this.state.formData.name}
                change={(element) => this.updateForm(element)}
              />
              {this.state.formError ? <div>Please check your data</div> : null}
              <button onClick={(e) => this.submitForm(e)}>Add Wood</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps)(ManageWoods);
