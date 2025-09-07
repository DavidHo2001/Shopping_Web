import React, { useState, useEffect } from "react";
import "./AdminProduct.css";

const AdminProduct = () => {
  const [formData, setFormData] = useState({
    
  });
  const [test, setTest]=useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{
    fetch("/api/admin/product-test")
    .then(response => {
      if (response.ok) {
        return response.text();
      }
    }).then(data =>{
      setTest(data);
    });
  },[]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <p style={{fontSize:'50px'}}>{test}</p>
    </div>
  );
}
export default AdminProduct;
