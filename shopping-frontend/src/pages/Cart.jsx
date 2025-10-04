import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import "./Cart.css";

const Cart = () => {
    const { user, cart, cartLoading, removeFromCart, clearCart } = useUser();
    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        cardType: 'VISA'
    });
    const image_url = "https://shopping-web-bucket.s3.ap-southeast-2.amazonaws.com"
    const [cartFinal, setCartFinal] = useState([]);

    useEffect(() => {
        fetchCartFinalItems();
    }, [user, cart]);

    const fetchCartFinalItems = async () => {
        if (!user || !user.userId) {
            setCartFinal([]);
            return;
        }
        
        try {
            const response = await fetch(`/api/cart/fetchFinalCartItems/${user.userId}`, {
                credentials: "include"
            });
            
            if (response.ok) {
                const data = await response.json();
                // Ensure data is always an array
                if (Array.isArray(data)) {
                    setCartFinal(data);
                } else {
                    setCartFinal([]);
                }
            } else {
                setCartFinal([]);
            }
        } catch (error) {
            setCartFinal([]);
        }
    }
    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handlePurchase = () => {
        // Empty function as requested
        alert("Purchase functionality not implemented yet");
    }

    const calculateTotal = () => {
        return cartFinal.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }

    if (cartLoading) return <div>Loading cart...</div>;

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            
            {!user ? (
                <div className="empty-cart">
                    <p>Please log in to view your cart</p>
                </div>
            ) : cartFinal.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <>
                    <div className="cart-actions">
                        <button 
                            onClick={async () => {
                                await clearCart();
                                await fetchCartFinalItems();
                            }} 
                            className="clear-cart-btn"
                        >
                            Clear Cart
                        </button>
                    </div>
                    
                    <div className="CartTable">
                        {cartFinal.map((item) => (
                            <div key={item.id} className="CartItemRow">
                                <img 
                                    src={image_url + item.image} 
                                    alt={item.name} 
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>{item.brand} - {item.category}</p>
                                    <p className="item-price">${item.price}</p>
                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                    <p className="item-total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                    <button 
                                        onClick={async () => {
                                            await removeFromCart(item.id);
                                            await fetchCartFinalItems();
                                        }}
                                        className="remove-item-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="CartTotal">
                        <h2>Total: ${calculateTotal()}</h2>
                    </div>
                    
                    <div className="CartForm">
                        <h2>Payment Information</h2>
                        <form className="payment-form">
                            <div className="form-group">
                                <label htmlFor="cardType">Card Type:</label>
                                <select 
                                    id="cardType"
                                    name="cardType" 
                                    value={paymentForm.cardType}
                                    onChange={handlePaymentFormChange}
                                >
                                    <option value="VISA">VISA</option>
                                    <option value="MASTERCARD">MasterCard</option>
                                    <option value="AMEX">American Express</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="cardHolderName">Card Holder Name:</label>
                                <input
                                    type="text"
                                    id="cardHolderName"
                                    name="cardHolderName"
                                    value={paymentForm.cardHolderName}
                                    onChange={handlePaymentFormChange}
                                    placeholder="Enter card holder name"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number:</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={paymentForm.cardNumber}
                                    onChange={handlePaymentFormChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date:</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={paymentForm.expiryDate}
                                        onChange={handlePaymentFormChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV:</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={paymentForm.cvv}
                                        onChange={handlePaymentFormChange}
                                        placeholder="123"
                                        maxLength="4"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={handlePurchase}
                                className="purchase-btn"
                            >
                                Purchase
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );  
};

export default Cart;