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
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: ""
  });
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const image_url = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com";

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product/fetchAllProducts");
      if (response.ok) {
        setProducts(await response.json());
        setLoadingProducts(false);
      } else {
        setErrorProducts(response.message);
      }
    }
    fetchProducts();
  }, []);

  
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
      setUploadError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
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
    setUploadError("");
    setUploadSuccess("");

    // Validate required fields, only name, price, and category are required
    if (!formData.name || !formData.price || !formData.category) {
      setUploadError("Please fill in all required fields");
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
        setUploadSuccess("Product uploaded successfully!");
        // Reset form
        setFormData({ name: "", description: "", price: "", category: "", brand: "" });
        removeImage();
        // Refresh products list
        const productsResponse = await fetch("/api/product/fetchAllProducts");
        if (productsResponse.ok) {
          setProducts(await productsResponse.json());
        }
       } else {
         const errorData = await response.json();
         setUploadError(errorData.message || "Upload failed.");
       }
     } catch (err) {
       setUploadError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Edit and Delete functions moved outside handleSubmit
  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      brand: product.brand || ""
    });
    setEditPreviewUrl(product.image ? image_url + product.image : null);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedProduct(null);
    setIsEditDialogOpen(false);
    setEditSelectedFile(null);
    if (editPreviewUrl && !selectedProduct?.image) {
      URL.revokeObjectURL(editPreviewUrl);
    }
    setEditPreviewUrl(null);
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      setEditError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setEditError('File size must be less than 5MB');
      return;
    }

    setEditSelectedFile(file);
    const url = URL.createObjectURL(file);
    setEditPreviewUrl(url);
  };

  const removeEditImage = () => {
    setEditSelectedFile(null);
    if (editPreviewUrl && !selectedProduct?.image) {
      URL.revokeObjectURL(editPreviewUrl);
    }
    setEditPreviewUrl(selectedProduct?.image ? image_url + selectedProduct.image : null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEditError("");
    setEditSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', selectedProduct.id);
      formDataToSend.append('name', editFormData.name);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('price', editFormData.price);
      formDataToSend.append('category', editFormData.category);
      formDataToSend.append('brand', editFormData.brand);
      formDataToSend.append('image', editSelectedFile || "");
      const response = await fetch("/api/admin/edit-product", {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        setEditSuccess("Product updated successfully!");
        closeEditDialog();
        // Refresh products list
        const productsResponse = await fetch("/api/product/fetchAllProducts");
        if (productsResponse.ok) {
          setProducts(await productsResponse.json());
        }
      } else {
        const errorData = await response.text();
        setEditError(errorData || "Update failed.");
      }
    } catch (err) {
      setEditError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setLoading(true);
    setEditError("");
    setEditSuccess("");

    try {
      const response = await fetch(`/api/admin/delete-product/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEditSuccess("Product deleted successfully!");
        closeDeleteDialog();
        // Refresh products list
        const productsResponse = await fetch("/api/product/fetchAllProducts");
        if (productsResponse.ok) {
          setProducts(await productsResponse.json());
        }
      } else {
        const errorData = await response.text();
        setEditError(errorData || "Delete failed.");
      }
    } catch (err) {
      setEditError("Network error. Please check your connection.");
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
          {uploadError && <div className="error-message">{uploadError}</div>}
          {uploadSuccess && <div className="success-message">{uploadSuccess}</div>}

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
          {loadingProducts ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <div className="product-item" key={product.id}>
                  <div className="product-info">
                    <span className="product-id">#{product.id}</span>
                    <span className="product-name">{product.name}</span>
                    <span className="product-category">{product.category}</span>
                    <span className="product-brand">{product.brand || 'N/A'}</span>
                    <span className="product-price">${product.price}</span>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => openEditDialog(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => openDeleteDialog(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Messages */}
        {editError && <div className="error-message">{editError}</div>}
        {editSuccess && <div className="success-message">{editSuccess}</div>}
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && selectedProduct && (
        <div className="dialog-overlay" onClick={closeEditDialog}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Edit Product</h3>
              <button className="dialog-close" onClick={closeEditDialog}>✕</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              {/* Image Upload */}
              <div className="edit-image-section">
                <div className="current-image">
                  {editPreviewUrl ? (
                    <div className="image-preview">
                      <img src={editPreviewUrl} alt="Product" />
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={removeEditImage}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="no-image">No image</div>
                  )}
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleEditFileSelect(file);
                  }}
                  className="file-input"
                />
              </div>

              {/* Form Fields */}
              <div className="edit-form-fields">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={editFormData.brand}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>

              <div className="dialog-actions">
                <button type="button" className="cancel-btn" onClick={closeEditDialog}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && productToDelete && (
        <div className="dialog-overlay" onClick={closeDeleteDialog}>
          <div className="dialog-content delete-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Confirm Delete</h3>
              <button className="dialog-close" onClick={closeDeleteDialog}>✕</button>
            </div>
            
            <div className="delete-content">
              <p>Are you sure you want to delete this product?</p>
              <div className="product-details">
                <strong>{productToDelete.name}</strong>
                <span>Category: {productToDelete.category}</span>
                <span>Price: ${productToDelete.price}</span>
              </div>
              <p className="warning">This action cannot be undone.</p>
            </div>

            <div className="dialog-actions">
              <button type="button" className="cancel-btn" onClick={closeDeleteDialog}>
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-confirm-btn" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminProduct;
