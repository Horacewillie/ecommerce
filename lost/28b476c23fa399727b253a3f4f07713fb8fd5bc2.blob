import React, { Component } from 'react'
import HomeSlider from './home_slider'
import HomePromotion from './home_promotion'
import CardBlock from '../utils/card_block'




import {getProduct} from '../../actions/products_actions'
import {connect} from 'react-redux'

class Home extends Component {

    componentDidMount(){
        this.props.dispatch(getProduct('createdAt'))
        this.props.dispatch(getProduct('sold'))
    }


    render() {
        return (
            <div>
                <HomeSlider />
                <CardBlock 
                title = 'Best Selling Guitars'
                list = {this.props.products.bySold}
                />
                <HomePromotion />
                <CardBlock 
                title = 'New Arrivals'
                list = {this.props.products.byArrival}
                />
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(Home)
