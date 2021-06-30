import React, { Component } from "react";
import PageTop from "../utils/page_top";
import ProdInfo from "./prodinfo";
import ProdImg from "./prodimg";

import { CircularProgress } from "@material-ui/core";

import { connect } from "react-redux";
import {
  getProductDetail,
  clearProductDetail,
} from "../../actions/products_actions";
import {addToCart} from "../../actions/user_actions"

class ProductPage extends Component {
  componentDidMount() { 
    const id = this.props.match.params.id;
    this.props.dispatch(getProductDetail(id)).then(res => {
        if(!this.props.products.prodDetail){
            this.props.history.push('/')
        }
    });
  }

  componentWillUnmount() {
    this.props.dispatch(clearProductDetail());
  }

  addToCartHandler(id){
    this.props.dispatch(addToCart(id));
  }

  render() {
    return (
      <div>
        <PageTop />
        <div className="container">
          {this.props.products.prodDetail ? (
            <div className="product_detail_wrapper">
              <div className="left">
                <div style={{ width: "500px" }}>
                  <ProdImg detail={this.props.products.prodDetail} />
                </div>
              </div>
              <div className="right">
                <ProdInfo
                  addToCart={(id) => this.addToCartHandler(id)}
                  detail={this.props.products.prodDetail}
                />
              </div>
            </div>
          ) : (
            <CircularProgress style={{ color: "#2196F3" }} thickness={7} />
          )}
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

export default connect(mapStateToProps)(ProductPage);
