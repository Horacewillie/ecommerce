import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logOutUser} from '../../../actions/user_actions'
import {withRouter} from 'react-router-dom'

class Header extends Component {

    state = {
        page: [
            {
                name: 'Home',
                linkTo: '/',
                public: true
            },
            {
                name: 'Guitars',
                linkTo: '/shop',
                public: true
            }
        ],

        user: [
            {
                name: 'My Cart',
                linkTo: '/user/cart',
                public: false
            },
            {
                name: 'My Account',
                linkTo: '/user/dashboard',
                public: false
            },
            {
                name: 'Log in',
                linkTo : '/register_login',
                public: true
            },
            {
                name: 'Log out',
                linkTo : '/user/logout',
                public: false
            }
        ]
    }

    linksTodisplay = (type) =>{
        let list = []
        
        if(this.props.user.userData){
            type.forEach((item) => {
                if(!this.props.user.userData.isAuth){
                    if(item.public){
                        list.push(item)
                    }
                }else{
                    if(item.name !== 'Log in'){
                        list.push(item)
                    }
                }
            })
        }

        return list.map((item, i) => {
            if(item.name !== 'My Cart'){
                return this.defaultLinks(item, i) 
            }else{
                return this.cartLink(item, i)
            }
        })
             
    }

    cartLink = (item, i) => {
        let user = this.props.user.userData
        return (
            <div className = 'cart_link' key = {i}>
                <span>
                    {user.cart ? user.cart.length: 0}
                </span>
                <Link to = {item.linkTo}>
                    {item.name}
                </Link>
            </div>
        )
    }

    defaultLinks = (item, i) => (
        item.name === 'Log out' ? 
           <div 
           className = 'log_out_link'
           onClick = {() => this.logoutHandler()}
           key ={i}
           >
               {item.name}
           </div>
        :
        <Link to = {item.linkTo} key = {i}>
            {item.name}
        </Link>
    )

    logoutHandler = () => {
        this.props.dispatch(logOutUser()).then(res => {
            if(res.payload.success){
                this.props.history.push("/");
            }
        })
    }


    render() {
        return (
            <header className = 'bck_b_light'>
                <div className = 'container'>
                    <div className = 'left'>
                        <div className = 'logo'>
                            Waves
                        </div>
                    </div>
                    <div className='right'>
                        <div className= 'top'>
                            {this.linksTodisplay(this.state.user)}
                        </div>
                        <div className= 'bottom'>
                           {this.linksTodisplay(this.state.page)}
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(withRouter(Header))
