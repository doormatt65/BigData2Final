import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Image from "react-bootstrap/Image";
import notFound from "../notfound.png";
import "./ProductContent.css";

const ProductPage = () => {
  const { groupId, isbn } = useParams();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch product data based on ISBN
    fetch(`http://localhost:4000/products/${groupId}/${isbn}`)
      // fetch(
      //   `http://ec2-3-133-154-215.us-east-2.compute.amazonaws.com:4000/product/${groupId}/${isbn}`
      // )
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
                <strong>Price:</strong>{" "}
                <p>${(productData.PageCount * 0.04).toFixed(2)}</p>
              </p>
              <button>Add to Cart</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
