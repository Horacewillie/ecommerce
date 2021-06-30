import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../actions/user_actions";
import { CircularProgress } from "@material-ui/core";

//Composed Component
//eslint-disable-next-line
export default function (ComposedClass, reload, adminRoute = null) {
  class AuthenticationCheck extends Component {
    state = {
      loading: true,
    };

    componentDidMount() {
      this.props.dispatch(auth()).then((res) => {
        let user = this.props.user.userData;

        if (!user.isAuth) {
          if (reload) {
            this.props.history.push("/register_login");
          }
        } else {
          if(adminRoute && !user.isAdmin){
            this.props.history.push('/user/dashboard')
          }else{
            if(reload === false){
              this.props.history.push('/user/dashboard')
            }
          } 
        }
        this.setState({
            loading: false
        })
      });
    }
    render() {
      if (this.state.loading) {
        return (
          <div className="main_loader">
            <CircularProgress style={{ color: "#2196F3" }} thickness={7} />
          </div>
        );
      }
      return (
        <div>
          <ComposedClass {...this.props} user={this.props.user} />
        </div>
      );
    }
  }

  //aids to connect to store
  //to retrieve data needed by component
  function mapStateToProps(state) {
    return {
      user: state.user,
    };
  }

  return connect(mapStateToProps)(AuthenticationCheck);
}
