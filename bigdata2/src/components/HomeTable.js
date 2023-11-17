import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";

const HomeTable = () => {
  const [dataFromDynamoDB, setDataFromDynamoDB] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/dbinfo")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        setDataFromDynamoDB(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch request:", error);
      });
  }, []);

  return (
    <>
      <Image src="covers/000.jpg" fluid width={"150px"} />
      <br />
      <br />
      <Button>Add to cart</Button>

      <p>{JSON.stringify(dataFromDynamoDB)}</p>
    </>
  );
};

export default HomeTable;
