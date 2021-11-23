import React, { useState, useEffect } from 'react'
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import app from '../backend/firebase';
import { getUid } from '../backend/auth';
import { Button, Col, Row, Form, Modal } from 'react-bootstrap';
import { updateUserData } from '../backend/database';
import {updateSoldCount} from '../backend/products'
import { Redirect } from 'react-router-dom';
import './Account.css'

const db = getFirestore(app);

function Checkout() {

    const uid = getUid();

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        cart: [],
        orders: [],
        wishList: [],
        address: {},
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
        userDetails.cart.forEach((item) => {
            total = total + (item.price * item.quantity);
        })

        setTotalPrice(total);

    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [add_title, setTitle] = useState('');
    const [add_name, setName] = useState('');
    const [add_phone, setPhone] = useState('');
    const [add_address, setAddress] = useState('');
    const [add_pincode, setPincode] = useState('');

    const saveAddress = async (e) => {

        e.preventDefault();

        const newAddress = {
            name: add_name,
            title: add_title,
            phone: add_phone,
            address: add_address,
            pincode: add_pincode
        }

        await updateDoc(doc(db, 'users', uid), {
            address: newAddress
        })

        setTitle('');
        setName('');
        setAddress('');
        setPhone('');
        setPincode('');

        handleClose();

    }

    const [paymentStatus, setPaymentStatus] = useState(false)

    const addAddressModal = () => {
        return <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveAddress}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title for the Address" onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Phone Number" onChange={(e) => setPhone(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control type="text" placeholder="Enter Pincode" onChange={(e) => setPincode(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Complete Address" onChange={(e) => setAddress(e.target.value)} required />
                    </Form.Group>

                    <div>
                        <Button variant="primary" type="submit" style={{ marginRight: '10px', marginTop: '10px' }}>
                            Save
                        </Button>
                        <Button variant="secondary" style={{ marginRight: '10px', marginTop: '10px' }} onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>

                </Form>

            </Modal.Body>
        </Modal>
    }

    const saveOrder = async () => {
        let user = userDetails;
        let orders = userDetails.orders;
        user.cart.forEach((item) => {
            const newOrder = {
                ...item,
                status: 'In-Transit',
                address: userDetails.address,
                timestamp: Date.now().toString()
            }
            orders.push(newOrder);
        })
        user.cart = []
        await updateUserData(uid, user);
        setPaymentStatus(true);

    }

    const updateSold = async () => {
        userDetails.cart.forEach((item) => {
            updateSoldCount(item.categoryID, item.productID, item.quantity)
        })
    }

    const displayRazorPay = async () => {

        const res = await loadRazorPay();

        if(!res){
            alert('RzorPay SDK failed to load!');
            return;
        }

        const options = {
            "key": process.env.RAZOR_PAY_KEY || "rzp_test_OWwHQ3vX3oZS9X", // Enter the Key ID generated from the Dashboard
            "amount": totalPrice * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": userDetails.name,
            "description": "Test Transaction",
            "image": "https://avatars.githubusercontent.com/u/7713209?s=280&v=4",
            "handler": function (response) {
                alert(`Payment Successful, Payment id: ${response.razorpay_payment_id}`);
                saveOrder();
                updateSold();
            },
            "prefill": {
                "name": userDetails.name,
                "email": userDetails.email,
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert('Payment Failed');
        });

        rzp1.open();
    }

    const loadRazorPay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            
            script.onload = () => {
                resolve(true);
            }

            script.onerror = () => {
                resolve(false);
            }

            document.body.appendChild(script);
        })
        

    }

    if (isLoading) {
        return <div></div>
    }

    if(paymentStatus){
        return <Redirect to='/confirm' />
    }

    return (
        <div className='account'>
            <div className='side-box'>
                <h3>Bill Details</h3>
                <Col className='details'>
                    <Row className='total-text'>
                        <Col>Total Items</Col>
                        <Col style={{ color: '#32cd32' }}>{userDetails.cart.length}</Col>
                    </Row>

                    <Row className='total-text'>
                        <Col>Amount</Col>
                        <Col style={{ color: '#32cd32' }}>Rs. {totalPrice}</Col>
                    </Row>

                    <Row className='total-text'>
                        <Col><Button style={{ width: '150px' }}  onClick={() => {
                            if(Object.keys(userDetails.address).length > 0){
                                displayRazorPay();
                            }else{
                                alert('Provide an address.');
                            }
                        }}>Pay</Button></Col>
                    </Row>
                </Col>
            </div>
            {addAddressModal()}
            <div className='main-box'>
                <div className='title'>
                    <h4>Address</h4>
                    <i class="fas fa-pen" style={{ color: '#32cd32', margin: '20px', cursor: 'pointer' }} onClick={handleShow}></i>
                </div>
                {
                    Object.keys(userDetails.address).length <= 0 ? <div style={{ color: '#32cd32', cursor: 'pointer', marginBottom: '20px' }} onClick={handleShow}>Add address</div>
                        : <div className='address-details'>
                            <h5>{userDetails.address.title}</h5>
                            <div className='name-phone'>
                                <h6>{userDetails.address.name}</h6>
                                <h6>{userDetails.address.phone}</h6>
                            </div>
                            <p>{userDetails.address.address}</p>
                            <p>{userDetails.address.pincode}</p>
                        </div>
                }
                <div className='title'>
                    <h4>Items</h4>
                </div>
                <div className='items'>
                    {
                        userDetails.cart.map((item, index) => {
                            return <div className='item'>
                                <Col style={{ marginTop: '10px' }}>
                                    <div>{index + 1}. {item.name} x {item.quantity}</div>
                                    <div style={{ marginLeft: '15px', color: '#32cd32' }}>Rs. {item.price * item.quantity}</div>
                                </Col>
                            </div>
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default Checkout
