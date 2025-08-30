import React, { useState, useEffect } from "react";
import mockProducts from '../mock_products.json';
import "./Product.css";
const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const image_url = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com" 

    useEffect(() => {
        //fetchProducts();
    }, []);
    const openDialog = (item) => {
        setSelectedProduct(item);
      };
    const closeDialog = () =>{
        setSelectedProduct(null);
    }
    /*const fetchProducts = async () => {
        try {
            const response = await fetch("/api/product");
            if (response.ok) {
                setProducts(await response.json());
            } else {
                setError(response.statusText);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };*/
    const test = () => {
        alert("clicked");
    }

    return (
        <div className="product-container">
            <h1>All Products</h1>
            <div className="ProductTable">
                {mockProducts.map((item) => (
                    <div key={item.id} className="ProductBox" onClick={()=>openDialog(item)}>
                        <h3>
                            <span className="ProductID">{item.id}</span>
                            <span className="ProductName">{item.name}</span>
                        </h3>
                        <img src={image_url + item.image} alt={item.name} />
                        <p>{item.description.length > 80 ? (item.description.slice(0, 90) + "...") : item.description}</p>
                        <p className="price">${item.price}</p>
                    </div>
                ))}
            </div>
            {/* Click Product open a dialog for details*/}
            {selectedProduct &&(
            <div className="ProductDialogOverlay" onClick={()=>closeDialog()}>
                {/*stopPropagation prevents closing when clicking inside dialog */}
                <div className="ProductDialogContent" onClick={(e) => e.stopPropagation()}>
                        
                        <h3>
                            <span className="ProductID">{selectedProduct.id}</span>
                            <span className="ProductName">Product Details</span>
                            <button className="DialogClose" onClick={()=>closeDialog()}>✕</button>
                        </h3>
                        <img className="DialogImage" src={image_url + selectedProduct.image} />
                        
                        <div className="DialogProductName">{selectedProduct.name}</div>
                        <div className="DialogDescription">{selectedProduct.description}</div>
                        <div className="DialogPrice">${selectedProduct.price}</div>
                </div>
            </div>
            )}
        </div>
    );  
};


export default Product;