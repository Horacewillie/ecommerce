import React from "react";
import MyButton from "../utils/button";
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faTruck, faCheck, faTimes);

const ProdInfo = (props) => {
  const showProdTags = (detail) => (
    <div className="product_tags">
      {detail.shipping ? (
        <div className="tag">
          <div>
            <FontAwesomeIcon icon={faTruck} />
          </div>
          <div className="tag_text">
            <div>Free Shipping</div>
            <div>And return</div>
          </div>
        </div>
      ) : null}
      <div className="tag">
        <div>
          <FontAwesomeIcon icon={detail.available ? faCheck : faTimes} />
        </div>
        {detail.available ? available() : notavailable()}
      </div>
    </div>
  );

  const available = () => (
    <div className="tag_text">
      <div>Available</div>
      <div>in store</div>
    </div>
  );

  const notavailable = () => (
    <div className="tag_text">
      <div>Not Available</div>
      <div>Preorder only</div>
    </div>
  );

  const showProdActions = (detail) => (
    <div className="product_actions">
      <div className="price">$ {detail.price}</div>
      <div className="cart">
        <MyButton
          type="add_to_cart_link"
          runAction={() => props.addToCart(detail._id)}
        />
      </div>
    </div>
  );

  const showProdSpecifications = (detail) => (
    <div className="product_specificaions">
      <h2>Specs:</h2>
      <div>
        <div className="item">
          <strong>Frets:</strong> {detail.frets}
        </div>
        <div className="item">
          <strong>Wood:</strong> {detail.wood.name}
        </div>
      </div>
    </div>
  );

  const detail = props.detail;
  return (
    <div>
      <h1>
        {detail.brand.name} {detail.name}
      </h1>

      <p>{detail.description}</p>
      {showProdTags(detail)}
      {showProdActions(detail)}
      {showProdSpecifications(detail)}
    </div>
  );
};

export default ProdInfo;
