import axios from "axios";

import { USER_SERVER, PRODUCT_SERVER } from "../components/utils/misc";
import {
  LOGIN_USER,
  GET_CART_ITEM_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART_USER,
  REMOVE_CART_ITEM_USER,
  ON_SUCCESS_BUY_USER,
  UPDATE_PROFILE_USER,
  CLEAR_UPDATE_USER_DATA
} from "./types";

//Action, this action has a payload of dataToSubmit
//and a type of login_user which is the request
export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((res) => res.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

//Register_User Action
export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((res) => res.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

//Authenticate User Action
export function auth() {
  const request = axios.get(`${USER_SERVER}/auth`).then((res) => {
    return res.data
  });

  return {
    type: AUTH_USER,
    payload: request,
  };
}

//Logout User
export function logOutUser() {
  const request = axios.get(`${USER_SERVER}/logout`).then((res) => {
    return res.data;
  });
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function addToCart(_id) {
  const request = axios
    .post(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then((res) => res.data);
  return {
    type: ADD_TO_CART_USER,
    payload: request,
  };
}

export function getCartItems(cartItems, userCart) {
  const request = axios
    .get(`${PRODUCT_SERVER}/articles_by_id?id=${cartItems}&type=array`)
    .then((res) => {
      userCart.forEach(item => {
        res.data.forEach((val, i) => {
          if(item.id === val._id){
            res.data[i].quantity = item.quantity
          }
        })
      })
      return res.data
    });

  return {
    type: GET_CART_ITEM_USER,
    payload: request,
  };
}

export const removeCartItem =(id) => {
  const request = axios.get(`${USER_SERVER}/removeFromCart?_id=${id}`)
  .then(res => {
    res.data.cart.forEach((item) => {
      res.data.cartDetail.forEach((val, i) => {
        if(item.id === val._id){
          res.data.cartDetail[i].quantity = item.quantity
        }
      })
    })
    return res.data
  })

  return {
    type: REMOVE_CART_ITEM_USER,
    payload: request
  }
}

export function onSuccessBuy(data){

  const request = axios.post(`${USER_SERVER}/successBuy`, data)
  .then((res) => {
    console.log(res.data)
    return res.data
  })
  return{
    type: ON_SUCCESS_BUY_USER,
    payload: request
  }
}

export function updateProfile(data){
  const request = axios.post(`${USER_SERVER}/update_profile`, data).then((res) => {
   return res.data
  })

  return {
    type: UPDATE_PROFILE_USER,
    payload: request
  }
}

export function clearUpdateUser(){
  return{
    type: CLEAR_UPDATE_USER_DATA,
    payload: ''
  }
}

