import React from 'react'
import Slider from 'react-slick'
import MyButton from "../utils/button"

const HomeSlider = () => {
    const slides = [
        {
            img: '/images/featured/featured_home.jpg',
            lineOne: 'Fender',
            lineTwo: 'Custom shop',
            linkTitle: 'Shop now',
            linkTo: '/shop'
        },
        {
            img: '/images/featured/featured_home_2.jpg',
            lineOne: 'B-Stocks',
            lineTwo: 'Awesome discounts',
            linkTitle: 'View Offers',
            linkTo: '/shop'
        },
    ]

    const sliderSettings ={
        speed: 500,
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    const generateSlides = () => (
        slides ? 
           slides.map((item, i) =>(
               <div key = {i}>
                   <div className = 'featured_image'
                   style = {{
                       background: `url(${item.img})`,
                       height: `${window.innerHeight}px`
                   }}>
                       <div className = 'featured_action'>
                           <div className = 'tag title'>
                               {item.lineOne}
                           </div>
                           <div className = 'tag low_title'>
                               {item.lineTwo}
                           </div>
                           <div>
                               <MyButton 
                                type = 'default'
                                title = {item.linkTitle}
                                linkTo = {item.linkTo}
                                addStyles ={{
                                    margin: '10px 0 0 0'
                                }}
                               />
                           </div>
                       </div>
                   </div>
               </div>
           ))
         
        : null
    )


    return (
        <div className="featured_container">
            <Slider {...sliderSettings}>
                {generateSlides()}
            </Slider>
            
        </div>
    )
}

export default HomeSlider
