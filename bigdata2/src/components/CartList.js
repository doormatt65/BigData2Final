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
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [updateCart, setUpdateCart] = useState(0);

  const UserID = localStorage.getItem("UserID") ?? 1;

  function removeItem(UserID, ISBN, num) {
    fetch(
      // "http://localhost:4000/removeItem",
      "http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/removeItem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserID: UserID, ISBN: ISBN, num: num }),
      }
    )
      .then((response) => {
        // console.log("Response:", response);
        setUpdateCart(response.json()); //just something to update the state to trigger a rerender
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
    setUpdateCart(updateCart + 1);
  }

  function checkout(UserID) {
    fetch(
      // "http://localhost:4000/checkout",
      "http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserID: UserID }),
      }
    );
    window.location.href = "/thanks";
  }

  function addToCart(item) {
    fetch(
      "http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/addToCart",
      //"http://localhost:4000/addToCart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserID, item }),
      }
    )
      .then((response) => {
        // console.log("Response:", response);
        setUpdateCart(response.json()); //just something to update the state to trigger a rerender
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
    setUpdateCart(updateCart + 1);
  }

  useEffect(() => {
    fetch(
      // `http://localhost:4000/getCart?UserID=${UserID}`
      `http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/getCart?UserID=${UserID}`
    )
      .then((response) => {
        // console.log("Response:" + response.json());
        return response.json();
      })
      .then((data) => {
        setCartItems(data);
        setIsLoading(false);
        const calculatedSubtotal = data.reduce(
          (acc, item) => acc + item.Price * item.count,
          0
        );
        setSubtotal(calculatedSubtotal);
        setTax(calculatedSubtotal * 0.06);
        setTotal(calculatedSubtotal + tax);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [UserID, tax, updateCart]);

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
                <p>${item.Price}</p>
                <p>Quantity: {item.count}</p>
              </Col>
              <Col>
                <p>Total: ${(item.Price * item.count).toFixed(2)}</p>
                <Button
                  className="quantity"
                  onClick={() => removeItem(UserID, item.ISBN, 1)}
                >
                  -1
                </Button>
                <Button className="quantity" onClick={() => addToCart(item)}>
                  +1
                </Button>
              </Col>
            </Row>
          ))
        )}
      </div>
      <div className="cart-summary">
        <h4>Cart Summary</h4>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p>Shipping: Free</p>
        <p>Total: ${total.toFixed(2)}</p>
        <Button onClick={() => checkout(UserID)}>Checkout</Button>
      </div>
    </div>
  );
};

export default CartList;
