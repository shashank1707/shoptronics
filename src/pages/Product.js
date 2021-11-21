import React, { useEffect, useState } from 'react'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import app from '../backend/firebase';
import { Button, Col } from 'react-bootstrap';
import './Product.css'
import { useParams } from 'react-router';
import { getUid } from '../backend/auth';
import { updateUserData } from '../backend/database';

const db = getFirestore(app);

function Product(props) {

    const uid = getUid();

    const { categoryID, productID } = useParams();

    const [productDetails, setProductDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        cart: [],
        orders: [],
        wishList: [],
    });

    useEffect(() => {
        getProduct();
        getUserDetails();
    }, [])

    const getUserDetails = () => {

        console.log(uid);
        if (uid) {
            onSnapshot(doc(db, 'users', uid), (snapshot) => {
                setUserDetails({
                    ...snapshot.data()
                })
            })
        }
    }

    const getProduct = () => {
        const path = `categories/${categoryID}/products`;
        onSnapshot(doc(db, path, productID), (doc) => {
            setProductDetails(doc.data())

        })
        console.log(productDetails)
        setIsLoading(false);
    }

    const checkInCart = () => {
        for (let i = 0; i < userDetails.cart.length; i++) {
            console.log()
            if (userDetails.cart[i].productID == productID) {
                return true;
            }
        }
        return false;
    }

    const checkInWish = () => {
        for (let i = 0; i < userDetails.wishList.length; i++) {
            console.log()
            if (userDetails.wishList[i].productID == productID) {
                return true;
            }
        }
        return false;
    }

    const addToCart = () => {
        let user = userDetails;
        if (!checkInCart()) {
            user.cart.push({
                categoryID,
                productID,
                quantity: 1,
                price: productDetails.price,
                name: productDetails.name,
                photoURL: productDetails.photoURL
            })
            updateUserData(uid, user);
        }

    }

    const addToWish = () => {
        let user = userDetails;
        if (!checkInWish()) {
            user.wishList.push({
                categoryID,
                productID,
                price: productDetails.price,
                name: productDetails.name,
                photoURL: productDetails.photoURL
            })
            updateUserData(uid, user);
        }

    }

    if (isLoading || Object.keys(productDetails).length == 0) {
        return <div></div>
    }

    return (

        <div className='product'>
            <div className='img-col'>
                <div><img src={productDetails.photoURL} className='product-img' /></div>
            </div>
            <div className='product-details'>
                <div className='product-name'>{productDetails.name}</div>
                <div className='product-desc'>{productDetails.description}</div>
                {
                    productDetails.stock > 0 ? <div className='product-price'>Rs. {productDetails.price}</div> : <div className='product-out'>Out of stock</div>
                }
                {uid ? <div className='btns'>
                        {!checkInCart() ? productDetails.stock > 0 ? <Button className='cart-btn' onClick={addToCart}>Add to cart</Button> : <div></div> : <Button className='cart-btn' variant='secondary'>Added to cart<i className="fas fa-check" style={{ marginLeft: '10px', color: '#32cd32' }}></i></Button>}

                        {!checkInWish() ? <Button className='cart-btn' onClick={addToWish}>Add to wishlist</Button> : <Button className='cart-btn' variant='secondary'>Added to wishlist<i className="fas fa-check" style={{ marginLeft: '10px', color: '#32cd32' }}></i></Button>}
                </div> : <div style={{margin: '20px'}}></div>}
                <div className='product-name'>Specifications</div>
                {Object.keys(productDetails.specifications).map((spec) => {
                    const specs = productDetails.specifications;
                    return <div className='product-specs'>
                        <Col><p>{spec}</p></Col>
                        <Col><p>{specs[spec]}</p></Col>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Product
