import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";

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
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeTable;
