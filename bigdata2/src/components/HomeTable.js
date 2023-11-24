import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import "./HomeTable.css";
import notFound from "../notfound.png";

const HomeTable = () => {
  const [dataFromDynamoDB, setDataFromDynamoDB] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/dbinfo?page=${pageNumber}`)
      .then((response) => response.json())
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
                  <Card.Title>{item.Title}</Card.Title>
                  <Card.Text>{item.Authors}</Card.Text>
                  <div className="imageAndCart">
                    {/* <Image src="https://covers.openlibrary.org/b/isbn/" + {item.ISBN}+"-M.jpg" /> */}
                    <Image
                      src={`https://covers.openlibrary.org/b/isbn/${item.ISBN}-M.jpg?default=false`}
                      onError={(e) => {
                        e.target.src = notFound; // Set default image on error
                      }}
                    />
                    <div className="priceAndCart">
                      <Card.Text id="price">
                        ${(item.NumPages * 0.04).toFixed(2)}
                      </Card.Text>
                      <Button id="addToCart">Add To Cart</Button>
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
