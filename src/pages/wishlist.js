import React, { useState, useEffect } from 'react'
import { getFirestore, doc, onSnapshot, onSnapshotsInSync, updateDoc, arrayRemove } from 'firebase/firestore';
import app from '../backend/firebase';
import { getUid } from '../backend/auth';
import { getProduct } from '../backend/products';
import { Button, Col, Row } from 'react-bootstrap';
import './Cart.css'
import { updateUserData } from '../backend/database';
import { Link } from 'react-router-dom';

const db = getFirestore(app);


function WishList() {
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
        userDetails.wishList.forEach((item) => {
            total = total + (item.price * item.quantity);
        })

        setTotalPrice(total);

    }

    const checkInCart = (item) => {
        for (let i = 0; i < userDetails.cart.length; i++) {
            console.log()
            if (userDetails.cart[i].productID === item.productID) {
                return true;
            }
        }
        return false;
    }

    const checkStock = async (item) => {
        const product = await getProduct(item.categoryID, item.productID);
        if (product.stock <= 0) {

            alert(`${item.name} is currently out of stock!`);
            return false;
        }
        return true;
    }

    const addToCart = async (item) => {
        let user = userDetails;
        const inStock = await checkStock(item);
        if (inStock && !checkInCart(item)) {
            user.cart.push({
                categoryID: item.categoryID,
                productID: item.productID,
                quantity: 1,
                price: item.price,
                name: item.name,
                photoURL: item.photoURL
            })
            updateUserData(uid, user);
        }

    }

    const removeItem = async (item) => {
        await updateDoc(doc(db, 'users', uid), {
            wishList: arrayRemove(item)
        })
    }


    if (isLoading) {
        return <div></div>
    }

    return (
        <div className='cart'>
            <div className='total'>
                <h3>Wishlist Details</h3>
                <Col className='total-box'>
                    <Row className='total-text'>
                        <Col>Total items</Col>
                        <Col style={{ color: '#32cd32' }}>{userDetails.wishList.length}</Col>
                    </Row>

                    <Row className='total-text'>
                        <Col><Link style={{ textDecoration: 'none', color: '#fff' }} to='/cart'><Button style={{ width: '150px' }}>Go to cart</Button></Link></Col>
                    </Row>
                </Col>
            </div>
            <div className='cart-items'>
                {
                    userDetails.wishList.map((item, index) => {
                        return <div className='cart-item'>
                            <div className='cart-img-div'>
                                <img src={item.photoURL} className='cart-img' />
                            </div>
                            <div className='cart-data'>
                                <Link to={`product/${item.categoryID}/${item.productID}`} target='_blank' style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}><h5>{item.name}</h5></Link>
                                <div className='price'>{`Rs. ${item.price}`}</div>
                                {!checkInCart(item) ? <Button className='cart-btn-w' onClick={() => addToCart(item)}>Add to cart</Button> : <Button className='cart-btn-w' variant='secondary'>Added to cart<i className="fas fa-check" style={{ marginLeft: '10px', color: '#32cd32' }}></i></Button>}
                                <div className='remove-btn' onClick={() => removeItem(item)}>Remove</div>
                            </div>
                        </div>
                    })
                }
            </div>

        </div>
    )
}

export default WishList
