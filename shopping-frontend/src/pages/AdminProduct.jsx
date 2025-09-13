import React, { useState, useEffect } from "react";
import "./AdminProduct.css";

const AdminProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [test, setTest]=useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    console.log("url ", url);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields, only name, price, and category are required
    if (!formData.name || !formData.price || !formData.category) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }


    try {
      // Create FormData for multipart form submission
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('image', selectedFile || "");
      
      console.log("FormData: ", formDataToSend);

      const response = await fetch("/api/admin/add-product", {
        method: "POST",
        body: formDataToSend,
      });
      
      if (response.ok) {
        const data = await response.text();
        console.log("Response: ", data);
        setSuccess("Product uploaded successfully!");
        // Reset form
        setFormData({ name: "", description: "", price: "", category: "", brand: "" });
        removeImage();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Upload failed.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-management-table">
      <div className="product-upload-left">
        <h1>Upload Product</h1>
        
        <div className="upload-form-container">
          <form onSubmit={handleSubmit}>
          {/* Upload Area */}
          <div className="upload-area">
            <div 
              className={`upload-box ${previewUrl ? 'has-image' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="upload-content">
                  <div className="upload-icon">📁</div>
                  <p>Drag & drop your image here</p>
                  <p className="upload-hint">or click to browse</p>
                  <p className="file-info">Supports: JPG, PNG, GIF (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <div className="price-input">
                <span className="currency">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="1"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter product category"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter product brand"
              />
            </div>
          </div>

          {/* Messages */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
          </form>
        </div>
      </div>
      
      <div className="product-edit-right">
        <h1>Edit Product</h1>
        <div className="product-edit-list">
          <h2>Product List</h2>
        </div>
      </div>
    </div>
  );
}
export default AdminProduct;
