import React, { Component } from "react";
import UserLayout from "../../hoc/user";
import UserProductBlock from "../utils/User/product_block";

import { connect } from "react-redux";
import { getCartItems, removeCartItem, onSuccessBuy} from "../../actions/user_actions";
import { bindActionCreators } from "redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFrown, faSmile } from "@fortawesome/free-solid-svg-icons";
import PayPal from '../utils/paypal'
library.add(faFrown, faSmile);



class UserCart extends Component {
  state = {
    loading: true,
    total: 0,
    showSuccess: false,
    showTotal: false,
  };

  componentDidMount() {
    let cartItems = [];
    let user = this.props.user;

    if (user.userData.cart) {
      if (user.userData.cart.length > 0) {
        user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        this.props.getCartItems(cartItems, user.userData.cart).then(() => {
          if (this.props.user.cartDetail.length > 0) {
            this.calculateTotal(this.props.user.cartDetail);
          }
        });
      }
    }
  }

  removeFromCart = (id) => {
    this.props.removeCartItem(id).then(() => {
      if (this.props.user.cartDetail.length <= 0) {
        this.setState({
          showTotal: false,
        });
      } else {
        this.calculateTotal(this.props.user.cartDetail);
      }
    });
  };

  calculateTotal = (cartDetail) => {
    let total = 0;
    cartDetail.forEach((item) => {
      total += +item.price * item.quantity;
    });

    this.setState({
      total,
      showTotal: true,
    });
  };

  showNoItemMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faFrown} />
      <div>You have no item(s)</div>
    </div>
  );

  transactionError =() => {}

  transactionCancel =() => {}

  transactionSuccess =(data) => {
    this.props.onSuccessBuy({
      cartDetail: this.props.user.cartDetail,
      paymentData: data
    }).then(() => {
      console.log('I"m testing!')
      if(this.props.user.successBuy){
        this.setState({
          showTotal: false,
          showSuccess: true
        })
      }
    })
  }

  render() {
    return (
      <UserLayout>
        <div>
          <h1>My cart</h1>
          <div className="user_cart">
            <UserProductBlock
              products={this.props.user}
              type="cart"
              removeItem={
                (id) => this.removeFromCart(id) 
              }
            />
          </div>
          {this.state.showTotal ? (
            <div>
              <div className="user_cart_sum">
                <div>Total amount: $ {this.state.total}</div>
              </div>
            </div>
          ) : this.state.showSuccess ? (
            <div className="cart_success">
              <FontAwesomeIcon icon={faSmile} />
              <div>THANK YOU</div>
              <div>YOUR ORDER IS NOW COMPLETE</div>
            </div>
          ) : (
            this.showNoItemMessage()
          )}
        </div>
        {this.state.showTotal ? (
          <div className="paypal_button-container">
            <PayPal 
            toPay = {this.state.total}
            transactionError= {(data) => this.transactionError(data)}
            transactionCancel = {(data) => this.transactionCancel(data)}
            onSuccess = {(data) => this.transactionSuccess(data)}
            />
          </div>
        ) : null}
      </UserLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getCartItems, removeCartItem, onSuccessBuy}, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCart);
