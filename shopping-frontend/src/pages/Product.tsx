import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Product.css';
import { Product as ProductType } from '../types/forms';
import { fetchAllProducts, fetchProductsByCategory, getImageUrl } from '../service/ApiService/ProductService';

const Product = () => {
  const { category } = useParams<{ category?: string }>();
  const { addToCart } = useUser();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = category 
        ? await fetchProductsByCategory(category)
        : await fetchAllProducts();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item: ProductType) => {
    setSelectedProduct(item);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async (item: ProductType) => {
    const success = await addToCart(item.id);
    if (success) {
      alert(`${item.name} added to cart!`);
    } else {
      alert('Failed to add item to cart. Please make sure you are logged in.');
    }
  };

  if (loading) {
    return <div className="product-container"><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className="product-container"><h1>Error: {error}</h1></div>;
  }

  return (
    <div className="product-container">
      <h1>{category ? `${category} Products` : 'All Products'}</h1>
      <div className="ProductTable">
        {products.map((item) => (
          <div key={item.id} className="ProductBox" onClick={() => openDialog(item)}>
            <h3>
              <span className="ProductID">{item.id}</span>
              <span className="ProductName">{item.name}</span>
            </h3>
            <img src={getImageUrl(item.image)} alt={item.name} />
            <p className="brandAndCategory">
              <span>{item.brand} - {item.category}</span>
            </p>
            <p>
              {item.description.length > 80
                ? `${item.description.slice(0, 90)}...`
                : item.description}
            </p>
            <h2>
              <span className="price">${item.price}</span>
              <span
                className="buyButton"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                Buy
              </span>
            </h2>
          </div>
        ))}
      </div>

      {/* Product Details Dialog */}
      {selectedProduct && (
        <div className="ProductDialogOverlay" onClick={closeDialog}>
          <div className="ProductDialogContent" onClick={(e) => e.stopPropagation()}>
            <h3>
              <span className="ProductID">{selectedProduct.id}</span>
              <span className="ProductName">Product Details</span>
              <button className="DialogClose" onClick={closeDialog}>
                ✕
              </button>
            </h3>
            <img className="DialogImage" src={getImageUrl(selectedProduct.image)} alt={selectedProduct.name} />
            <div className="DialogProductName">{selectedProduct.name}</div>
            <div className="DialogBrandAndCategory">
              {selectedProduct.brand} - {selectedProduct.category}
            </div>
            <div className="DialogDescription">{selectedProduct.description}</div>
            <div className="DialogPrice">${selectedProduct.price}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
