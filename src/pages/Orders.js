import React, { useState, useEffect } from 'react'
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import app from '../backend/firebase';
import { getUid } from '../backend/auth';
import { Col, Row } from 'react-bootstrap';

const db = getFirestore(app);


function Orders() {
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

    useEffect(() => {
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
            setIsLoading(false);
        }


    }

    const cancelOrder = async (item, index) => {
        let orders = [...userDetails.orders];
        item.status = 'Cancelled'
        orders[index] = item;

        await updateDoc(doc(db, 'users', uid), {
            orders: orders
        })

    }


    if (isLoading) {
        return <div></div>
    }

    return (
        <div className='cart'>
            <div className='total'>
                <h3>Orders</h3>
                <Col className='total-box'>
                    <Row className='total-text'>
                        <Col>Total Orders</Col>
                        <Col style={{ color: '#32cd32' }}>{userDetails.orders.length}</Col>
                    </Row>

                    <Row className='total-text'>
                        <Col>Orders In-Transit</Col>
                        <Col style={{ color: '#32cd32' }}>{userDetails.orders.filter((order) => order.status === 'In-Transit').length}</Col>
                    </Row>
                </Col>
            </div>
            <div className='cart-items'>
                {
                    userDetails.orders.map((item, index) => {
                        return <div className='cart-item'>
                            <div className='cart-img-div'>
                                <img src={item.photoURL} className='cart-img' />
                            </div>
                            <div className='cart-data'>
                                <h5>{item.name}</h5>
                                <h6 style={{color: '#32cd32'}}>{`Rs. ${item.price}`}</h6>
                                <div style={{marginTop: '10px'}}>
                                    <h5>{item.address.title}</h5>
                                    <div className='name-phone'>
                                        <h6>{item.address.name}</h6>
                                        <h6>{item.address.phone}</h6>
                                    </div>
                                    <p>{item.address.address}</p>
                                    <p>{item.address.pincode}</p>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                                    <div>Quantity: </div>
                                    <div style={{ color: '#32cd32', marginLeft: '10px' }}>{item.quantity}</div>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                                    <div>Status: </div>
                                    <div style={{ color: item.status !== 'Cancelled' ? '#32cd32' : 'grey', marginLeft: '20px' }}>{item.status}</div>
                                </div>
                                {item.status !== 'Cancelled' && <div className='remove-btn' onClick={() => cancelOrder(item)}>Cancel</div>}
                            </div>
                        </div>
                    }).reverse()
                }
            </div>

        </div>
    )
}

export default Orders
