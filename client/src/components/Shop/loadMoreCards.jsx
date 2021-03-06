import React from 'react'
import CardBlockShop from '../utils/card_block_shop'

function LoadMoreCards(props) {
    return (
        <div>
            <div>
                <CardBlockShop 
                grid = {props.grid}
                list = {props.products}
                />
            </div>
            
            {
                props.size > 0 && props.size >= props.limit ?
                <div className = 'load_more_container'>
                   <span onClick = {() => props.loadMore()}>
                    Load More
                   </span>
                </div>
                : ''
            }
            
        </div>
    )
}

export default LoadMoreCards
