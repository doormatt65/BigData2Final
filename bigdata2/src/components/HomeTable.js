import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import "./HomeTable.css";
import notFound from "../notfound.png";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeTable = () => {
  const [dataFromDynamoDB, setDataFromDynamoDB] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const UserID = localStorage.getItem("UserID") ?? 1;

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
    );
    toast.success(`Added ${item["Title"]} to cart`, {
      position: "top-center",
      autoClose: 2000, // Close the toast after 2 seconds
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    // alert(`Added ${item["Title"]} to cart`);
  }

  useEffect(() => {
    fetch(
      // `http://localhost:4000/dbinfo?page=${pageNumber}`
      `http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/dbinfo?page=${pageNumber}`
    )
      .then((response) => {
        // console.log("Response:", response);
        return response.json();
      })
      .then((data) => {
        setDataFromDynamoDB(data); // Set the received data
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [pageNumber]);

  return (
    <>
      <div className="pagination">
        <p>Page {pageNumber}</p>
        <Button onClick={() => setPageNumber(pageNumber - 1)}>Previous</Button>
        <Button onClick={() => setPageNumber(pageNumber + 1)}>Next</Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Row xs={1} md={2} lg={3}>
          {dataFromDynamoDB.map((item, index) => (
            <Col key={index}>
              <Card>
                {/* Display title and author */}
                <Card.Body>
                  <Link to={`/products/${item.GroupID}/${item.ISBN}`}>
                    <Card.Title>{item.Title}</Card.Title>
                  </Link>
                  <Card.Text>{item.Authors}</Card.Text>
                  <div className="imageAndCart">
                    <Link to={`/products/${item.GroupID}/${item.ISBN}`}>
                      <Image
                        src={`https://covers.openlibrary.org/b/isbn/${item.ISBN}-M.jpg?default=false`}
                        onError={(e) => {
                          e.target.src = notFound; // Set default image on error
                        }}
                      />
                    </Link>
                    <div className="priceAndCart">
                      <Card.Text id="price">
                        ${(item.PageCount * 0.04).toFixed(2)}
                      </Card.Text>
                      <Button id="addToCart" onClick={() => addToCart(item)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div className="pagination">
        <p>Page {pageNumber}</p>
        <Button onClick={() => setPageNumber(pageNumber - 1)}>Previous</Button>
        <Button onClick={() => setPageNumber(pageNumber + 1)}>Next</Button>
      </div>
    </>
  );
};

export default HomeTable;
