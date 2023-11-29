import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import notFound from "../notfound.png";
import "./CartList.css";

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const UserID = localStorage.getItem("UserID") ?? 1;

  function removeItem(UserID, ISBN, num) {
    fetch(
      "http://localhost:4000/removeItem",
      // fetch("http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/removeItem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserID: UserID, ISBN: ISBN, num: num }),
      }
    );
  }

  useEffect(() => {
    fetch(`http://localhost:4000/getCart?UserID=${UserID}`)
      .then((response) => {
        // console.log("Response:" + response.json());
        return response.json();
      })
      .then((data) => {
        setCartItems(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [UserID]);

  return (
    <div className="cart">
      <div className="cart-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          cartItems.map((item) => (
            <Row key={item.ISBN} className="cart-item">
              <Col xs={2}>
                <Image
                  src={`https://covers.openlibrary.org/b/isbn/${item.ISBN}-M.jpg?default=false`}
                  onError={(e) => {
                    e.target.src = notFound; // Set default image on error
                  }}
                />
              </Col>
              <Col xs={5}>
                <h5>{item.Title}</h5>
                <p>{item.Authors}</p>
                <p>Price: ${(item.PageCount * 0.04).toFixed(2)}</p>
                <p>Quantity: {item.count}</p>
              </Col>
              <Col>
                <br />
                <p>
                  Total: $
                  {((item.PageCount * 0.04).toFixed(2) * item.count).toFixed(2)}
                </p>
                <Button onClick={() => removeItem(UserID, item.ISBN, 1)}>
                  Remove
                </Button>
              </Col>
            </Row>
          ))
        )}
      </div>
      <div className="cart-summary">
        <h4>Cart Summary</h4>
        <p>Subtotal: $0.00</p>
        <p>Tax: $0.00</p>
        <p>Shipping: $0.00</p>
        <p>Total: $0.00</p>
        <Button>Checkout</Button>
      </div>
    </div>
  );
};

export default CartList;
