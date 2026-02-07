import React, { useState, useEffect, ChangeEvent, FormEvent, DragEvent } from 'react';
import './AdminProduct.css';
import { Product, ProductFormData } from '../types/forms';
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getImageUrl,
} from '../service/ApiService/ProductService';
import { validateImageFile, validateFileSize } from '../utils/validation';
import { VALIDATION_RULES } from '../utils/constants';

const AdminProduct= () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const loadProducts = async () => {
    try {
      const data = await fetchAllProducts();
      setProducts(data);
      setLoadingProducts(false);
    } catch (error) {
      setEditError('Failed to load products');
      setLoadingProducts(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!validateImageFile(file)) {
      setUploadError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    if (!validateFileSize(file, VALIDATION_RULES.MAX_FILE_SIZE_MB)) {
      setUploadError(`File size must be less than ${VALIDATION_RULES.MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadError('');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setUploadError('');
    setUploadSuccess('');

    if (!formData.name || !formData.price || !formData.category) {
      setUploadError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      await addProduct(formData, selectedFile);
      setUploadSuccess('Product uploaded successfully!');
      setFormData({ name: '', description: '', price: '', category: '', brand: '' });
      removeImage();
      await loadProducts();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      brand: product.brand || '',
    });
    setEditPreviewUrl(product.image ? getImageUrl(product.image) : null);
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

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFileSelect = (file: File) => {
    if (!validateImageFile(file)) {
      setEditError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    if (!validateFileSize(file, VALIDATION_RULES.MAX_FILE_SIZE_MB)) {
      setEditError(`File size must be less than ${VALIDATION_RULES.MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setEditSelectedFile(file);
    const url = URL.createObjectURL(file);
    setEditPreviewUrl(url);
    setEditError('');
  };

  const removeEditImage = () => {
    setEditSelectedFile(null);
    if (editPreviewUrl && !selectedProduct?.image) {
      URL.revokeObjectURL(editPreviewUrl);
    }
    setEditPreviewUrl(selectedProduct?.image ? getImageUrl(selectedProduct.image) : null);
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      await updateProduct(selectedProduct.id, editFormData, editSelectedFile);
      setEditSuccess('Product updated successfully!');
      closeEditDialog();
      await loadProducts();
    } catch (err: any) {
      setEditError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      await deleteProduct(productToDelete.id);
      setEditSuccess('Product deleted successfully!');
      closeDeleteDialog();
      await loadProducts();
    } catch (err: any) {
      setEditError(err.message || 'Delete failed.');
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
                onClick={() => document.getElementById('fileInput')?.click()}
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
                  rows={3}
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
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Product'}
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
                    <button className="edit-btn" onClick={() => openEditDialog(product)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => openDeleteDialog(product)}>
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
              <button className="dialog-close" onClick={closeEditDialog}>
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-form">
              {/* Image Upload */}
              <div className="edit-image-section">
                <div className="current-image">
                  {editPreviewUrl ? (
                    <div className="image-preview">
                      <img src={editPreviewUrl} alt="Product" />
                      <button type="button" className="remove-image" onClick={removeEditImage}>
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
                    const file = e.target.files?.[0];
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
                    rows={3}
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && productToDelete && (
        <div className="dialog-overlay" onClick={closeDeleteDialog}>
          <div
            className="dialog-content delete-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header">
              <h3>Confirm Delete</h3>
              <button className="dialog-close" onClick={closeDeleteDialog}>
                ✕
              </button>
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
                {loading ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
