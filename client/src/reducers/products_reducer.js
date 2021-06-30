import {
    GET_BRANDS,
    GET_PRODUCT_BY_ARRIVAL,
    GET_PRODUCT_BY_SALE,
    GET_WOODS,
    GET_PRODUCTS_TO_SHOP,
    ADD_PRODUCT,
    ADD_BRAND,
    ADD_WOOD,
    CLEAR_PRODUCT,
    GET_PRODUCT_DETAIL,
    CLEAR_PRODUCT_DETAIL
  } from "../actions/types";
  
  // eslint-disable-next-line
  export default function (state = {}, action) {
    switch (action.type) {
      case GET_PRODUCT_BY_ARRIVAL:
        return { ...state, byArrival: action.payload };
  
      case GET_PRODUCT_BY_SALE:
        return { ...state, bySold: action.payload };
      case GET_BRANDS:
        return { ...state, brands: action.payload };
      case GET_WOODS:
        return { ...state, woods: action.payload };
      case GET_PRODUCTS_TO_SHOP:
        return {
          ...state,
          toShop: action.payload.data.articles,
          toShopSize: action.payload.data.size,
        };
      case ADD_PRODUCT:
        return { ...state, addProduct: action.payload };
      case CLEAR_PRODUCT:
        return { ...state, addProduct: action.payload };
      case ADD_BRAND:
        return {
          ...state,
          addBrand: action.payload.success,
          brands: action.payload.brands,
        };
      case ADD_WOOD:
        return {
          ...state,
          addWood: action.payload.success,
          woods: action.payload.woods,
        };
      case GET_PRODUCT_DETAIL:
        return {...state, prodDetail: action.payload}
      case CLEAR_PRODUCT_DETAIL:
        return {...state, prodDetail: action.payload}
      default:
        return state;
    }
  }