import React, { useState, useEffect } from 'react'
import { getFirestore, doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import app from '../backend/firebase';
import { getUid } from '../backend/auth';
import { getProduct } from '../backend/products';
import { Button, Col, Row } from 'react-bootstrap';
import './Cart.css'
import { Link } from 'react-router-dom';

const db = getFirestore(app);


function Cart() {
    const uid = getUid();
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        cart: [],
        orders: [],
        wishList: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [alerted, setAlerted] = useState(false);

    useEffect(() => {
        getUserDetails();
    }, [])

    useEffect(() => {
        getTotalPrice();
    }, [userDetails])

    const getUserDetails = () => {

        console.log(uid);
        if (uid) {
            onSnapshot(doc(db, 'users', uid), (snapshot) => {
                setUserDetails({
                    ...snapshot.data()
                })
            })
            setIsLoading(false);
        }


    }

    const getTotalPrice = () => {
        let total = 0;
        userDetails.cart.forEach((item) => {
            total = total + (item.price * item.quantity);
        })

        setTotalPrice(total);

    }

    const removeItem = async (item) => {
        await updateDoc(doc(db, 'users', uid), {
            cart: arrayRemove(item)
        })
    }



    const updateQuantity = async (item, index, qt) => {

        const product = await getProduct(item.categoryID, item.productID);

        const cart = [...userDetails.cart];
        const cartItem = cart[index];
        cartItem.quantity = cartItem.quantity + qt;

        cart[index] = cartItem;

        if (cartItem.quantity <= product.stock) {
            if (cartItem.quantity >= 1) {
                await updateDoc(doc(db, 'users', uid), {
                    cart: cart
                })
            }
        } else {
            alert('Limited Stocks')
        }




    }

    if (isLoading) {
        return <div></div>
    }

    return (
        <div className='cart'>
            <div className='total'>
                <h3>Cart Details</h3>
                <Col className='total-box'>
                    <Row className='total-text'>
                        <Col>Total</Col>
                        <Col style={{ color: '#32cd32' }}>Rs. {totalPrice}</Col>
                    </Row>

                    <Row className='total-text'>
                        <Col>Delivery Charges</Col>
                        <Col style={{ color: '#32cd32' }}>Free</Col>
                    </Row>

                    {userDetails.cart.length > 0 && <Row className='total-text'>
                        <Col><Link to='/checkout'><Button style={{ width: '150px' }}>Checkout</Button></Link></Col>
                    </Row>}
                </Col>
            </div>
            <div className='cart-items'>
                {
                    userDetails.cart.map((item, index) => {
                        return <div className='cart-item'>
                            <div className='cart-img-div'>
                                <img src={item.photoURL} className='cart-img' />
                            </div>
                            <div className='cart-data'>
                            <Link to={`product/${item.categoryID}/${item.productID}`} style={{
                                textDecoration: 'none',
                                color: 'inherit'
                            }}><h5>{item.name}</h5></Link>
                                <div className='price'>{`Rs. ${item.price}`}</div>
                                <div className='qt-div'>
                                    <div className='qt-btn' onClick={() => updateQuantity(item, index, -1)}>-</div>
                                    <div className='qt'>{item.quantity}</div>
                                    <div className='qt-btn' onClick={() => updateQuantity(item, index, 1)}>+</div>

                                </div>
                                <div className='remove-btn' onClick={() => removeItem(item)}>Remove</div>
                            </div>
                        </div>
                    })
                }
            </div>

        </div>
    )
}

export default Cart
