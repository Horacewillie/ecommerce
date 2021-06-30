export const update = (element, formdata, formName) => {
    const newFormdata = {
      ...formdata,
    };
  
    const newElement = {
      ...newFormdata[element.id],
    };
  
    newElement.value = element.e.target.value;
  
    if (element.blur) {
      let validData = validate(newElement, formdata);
      newElement.valid = validData[0];
      newElement.validationMessage = validData[1];
    }
  
    newElement.touched = element.blur;
  
    newFormdata[element.id] = newElement;
  
    return newFormdata;
  };
  
  //Here, we are validating to check if the user enter the field
  //and left without typing nothing.
  //if the user did enter the field, blur is true, and then we check
  //if the user actually typed something
  export const validate = (stateToValidate, formdata = []) => {
    let error = [true, ""];
  
    if (stateToValidate.validation.email) {
      const valid = /\S+@\S+\.\S+/.test(stateToValidate.value);
      const message = `${valid ? "" : "Must be a valid email"}`;
      //const message = `${!valid ?'This field is required' : ''}`
      error = !valid ? [valid, message] : error;
    }
  
    if (stateToValidate.validation.password) {
      const valid = stateToValidate.value.length >= 5;
      const message = `${
        valid ? "" : "Must be greater than 4 letters or numbers"
      }`;
      error = !valid ? [valid, message] : error;
    }
  
    if (stateToValidate.validation.confirm) {
      const valid =
        stateToValidate.value.trim() ===
        formdata[stateToValidate.validation.confirm].value;
      const message = `${valid ? "" : "Password do not match"}`;
      //const message = `${!valid ?'This field is required' : ''}`
      error = !valid ? [valid, message] : error;
    }
  
    if (stateToValidate.validation.required) {
      const valid = stateToValidate.value.trim() !== "";
      const message = `${valid ? "" : "This field is required"}`;
      //const message = `${!valid ?'This field is required' : ''}`
      error = !valid ? [valid, message] : error;
    }
  
    return error;
  };
  
  export const generateData = (formdata, formName) => {
    let dataToSubmit = {};
  
    for (let key in formdata) {
      if (key !== "confirmPassword") {
        dataToSubmit[key] = formdata[key].value;
      }
    }
    return dataToSubmit;
  };
  
  export const isFormValid = (formdata, formName) => {
    for (let key in formdata) {
      if (!formdata[key].valid) {
        return false;
      }
    }
  
    return true;
  };
  
  export const populateOptionFields = (formdata, array = [], field) => {
    const newArray = [];
    const newFormData = { ...formdata };
    array.forEach((item) => {
      newArray.push({ key: item._id, value: item.name });
    });
    newFormData[field].config.options = newArray;
    return newFormData;
  };
  
  export const resetFields = (formdata, formName) => {
    const newFormData = { ...formdata };
  
    for (let key in newFormData) {
      if (key === "images") {
        newFormData[key].value = [];
      } else {
        newFormData[key].value = "";
        newFormData[key].valid = false;
        newFormData[key].touched = false;
        newFormData[key].validationMessage = "";
      }
    }
    return newFormData;
  };
  
  export const populateFields = (formdata, statedata) => {
    const newFormData = { ...formdata };
  
    for(let key in newFormData) {
      newFormData[key].value = statedata[key]
      newFormData[key].valid = true;
      newFormData[key].touched = true;
      newFormData[key].validationMessage = "";
    }
    return newFormData;
  
  }
  