import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import notFound from "../notfound.png";
import "./ProductContent.css";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { groupId, isbn } = useParams();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const UserID = localStorage.getItem("UserID") ?? 1;

  function addToCart(item) {
    fetch(
      "http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/addToCart",
      // "http://localhost:4000/addToCart",
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
    // Fetch product data based on ISBN
    fetch(
      // `http://localhost:4000/products/${groupId}/${isbn}`
      `http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/products/${groupId}/${isbn}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProductData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [isbn, groupId]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="product">
            <div className="cover">
              {/* Display product details */}
              <h2>{productData.Title}</h2>
              <Image
                src={`https://covers.openlibrary.org/b/isbn/${productData.ISBN}-L.jpg?default=false`}
                onError={(e) => {
                  e.target.src = notFound; // Set default image on error
                }}
              />
            </div>
            {/* Other product details */}

            <div className="details">
              <p>
                <strong>ISBN:</strong> <p>{productData.ISBN}</p>
              </p>
              <p>
                <strong>Authors:</strong> <p>{productData.Authors}</p>
              </p>

              <p>
                <strong>Publisher:</strong> <p>{productData.Publisher}</p>
              </p>
              <p>
                <strong>Pages:</strong> <p>{productData.PageCount}</p>
              </p>

              <p>
                <strong>Rating:</strong> <p>{productData.Rating}⭐</p>
              </p>
            </div>
            <div className="purchase">
              <p>
                <strong>Price:</strong>
                <p>${(productData.PageCount * 0.04).toFixed(2)}</p>
              </p>
              <Button onClick={() => addToCart(productData)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
