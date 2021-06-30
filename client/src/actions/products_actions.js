import axios from "axios";
import { PRODUCT_SERVER } from "../components/utils/misc";

import {
  GET_PRODUCT_BY_SALE,
  GET_PRODUCT_BY_ARRIVAL,
  GET_BRANDS,
  ADD_BRAND,
  GET_WOODS,
  ADD_WOOD,
  GET_PRODUCTS_TO_SHOP,
  ADD_PRODUCT,
  CLEAR_PRODUCT,
  GET_PRODUCT_DETAIL,
  CLEAR_PRODUCT_DETAIL 
} from "./types";

export function getProductDetail(id) {
  const request = axios.get(`${PRODUCT_SERVER}/articles_by_id?id=${id}&type=single`)
  .then(res => {
    return res.data[0]
  })
  return {
    type: GET_PRODUCT_DETAIL,
    payload: request
  }
}

export function clearProductDetail(){
  return{
    type: CLEAR_PRODUCT_DETAIL,
    payload: ''
  }
}

export function getProduct(type) {
  const request = axios
    .get(`${PRODUCT_SERVER}/articles?sortby=${type}&order=desc&limit=4`)
    .then((res) => res.data);

  return {
    type: type === "createdAt" ? GET_PRODUCT_BY_ARRIVAL : GET_PRODUCT_BY_SALE,
    payload: request,
  };
}

export function getProductCategories(path) {
  const request = axios.get(`${PRODUCT_SERVER}/${path}`)
  .then((res) => res.data);

  return {
    type: path === 'brands' ? GET_BRANDS : GET_WOODS,
    payload: request
  }
}

export function addBrand(dataToSubmit, existingBrands) {
  const request = axios.post(`${PRODUCT_SERVER}/brand`, dataToSubmit)
  .then(res => {
    let brands = [
      ...existingBrands,
      res.data.brand
    ]
    return {
      success: res.data.success,
      brands
    }
  })
  return {
    type: ADD_BRAND,
    payload: request
  }
}

export function addWood(dataToSubmit, existingWoods) {
  const request = axios.post(`${PRODUCT_SERVER}/wood`, dataToSubmit)
  .then(res => {
    let woods = [
      ...existingWoods,
      res.data.wood
    ]
    return {
      success: res.data.success,
      woods
    }
  })
  return {
    type: ADD_WOOD,
    payload: request
  }
}

export function getProductsToShop(skip, limit, filters = [], previousState = []){
  const dataToSubmit = {
    skip,
    limit,
    filters
  }
  const request = axios.post(`${PRODUCT_SERVER}/shop`, dataToSubmit, (res => {
    let newState = [...previousState, ...res.data.articles]
    return {
      articles: newState,
      size: res.data.size
    }
  }))
  return{
    type: GET_PRODUCTS_TO_SHOP,
    payload: request
  }
}

export const addProduct = (dataToSubmit) =>{
  const request = axios.post(`${PRODUCT_SERVER}/article`, dataToSubmit)
  .then(res =>{
    return res.data
  }).catch(err => {
    console.log(err)
  })
  return {
    type:ADD_PRODUCT,
    payload: request
  }
}

export const clearProduct = () =>{
  return{
    type: CLEAR_PRODUCT,
    payload: ''
  }
}