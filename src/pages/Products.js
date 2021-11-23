import React, { useEffect, useState } from 'react'
import { Navbar, Tab, Tabs, Container, Nav, ToggleButton, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import './Products.css'
import { Link } from 'react-router-dom';
import CardItem from '../components/CardItem';
import { getProducts } from '../backend/products';

function Products() {

    const categoryIDs = {
        laptop: 'a8niJ4rt0LWMYKT4jl67',
        mobile: 'vd8GJXwQGEilFVCaMiev',
    }

    const [isLoading, setIsLoading] = useState(true);

    const [laptopList, setLaptopList] = useState([]);
    const [phoneList, setPhoneList] = useState([]);

    const [laptopTab, setLaptopTab] = useState(true);

    const laptopBrands = ['HP', 'ASUS', 'Apple'];
    const [selectedLaptopBrands, setSelectedLaptopBrands] = useState(laptopBrands);

    const phoneBrands = ['Apple', 'Samsung', 'Redmi'];
    const [selectedPhoneBrands, setSelectedPhoneBrands] = useState(phoneBrands);

    useEffect(() => {
        getLaptops();
        getPhones();
    }, [selectedLaptopBrands, selectedPhoneBrands])

    const getLaptops = async () => {
        const tempLaptopList = await getProducts(categoryIDs.laptop, selectedLaptopBrands);
        setLaptopList(tempLaptopList);
    }

    const getPhones = async () => {
        const tempPhoneList = await getProducts(categoryIDs.mobile, selectedPhoneBrands);
        setPhoneList(tempPhoneList);
        setIsLoading(false);
    }


    const renderLaptopTab = () => {
        return <div className='product-div'>
            <div className='filter-div'>
            <h5 style={{margin: '20px'}}>Brands</h5>
                {laptopBrands.map((brand) => {
                    var list = [...selectedLaptopBrands];
                    return <div className='filter' onClick={() => {
                        if (selectedLaptopBrands.includes(brand)) {
                            list = selectedLaptopBrands.filter((item) => item !== brand);
                            setSelectedLaptopBrands(list);
                        } else {
                            list.push(brand);
                            setSelectedLaptopBrands(list);
                        }
                        setSelectedLaptopBrands(list)
                    }}
                    style={{marginTop: '10px', display: 'flex', flexDirection: 'row'}}
                    >
                        <Col><input
                            type='checkbox'
                            value={brand}
                            checked={selectedLaptopBrands.includes(brand)}
                        /></Col>
                        <Col style={{marginLeft: '10px'}}>{brand}</Col>
                    </div>
                })}
            </div>
            <div className='cards-div'>
            {
                laptopList.map((product) => {
                    return <Link style={{textDecoration: 'none'}} to={`/product/${categoryIDs.laptop}/${product.id}`}>
                    <CardItem
                            src={product.photoURL}
                            text={product.name}
                            price={product.price}
                            stock={product.stock}
                            label='Laptop'
                        />
                    </Link>
                })
            }
            </div>
        </div>
    }

    const renderPhoneTab = () => {
        return <div className='product-div'>
            <div className='filter-div'>
                <h5 style={{margin: '20px'}}>Brands</h5>
                {phoneBrands.map((brand) => {
                    var list = [...selectedPhoneBrands];
                    return <div className='filter' onClick={() => {
                        if (selectedPhoneBrands.includes(brand)) {
                            list = selectedPhoneBrands.filter((item) => item !== brand);
                            setSelectedPhoneBrands(list);
                        } else {
                            list.push(brand);
                            setSelectedPhoneBrands(list);
                        }
                        setSelectedPhoneBrands(list)
                    }}
                    style={{marginTop: '10px', display: 'flex', flexDirection: 'row'}}
                    >
                        
                        <Col><input
                            type='checkbox'
                            value={brand}
                            checked={selectedPhoneBrands.includes(brand)}
                        /></Col>
                        <Col style={{marginLeft: '10px'}}>{brand}</Col>
                    </div>
                })}
            </div>
            <div className='cards-div'>
            {
                phoneList.map((product) => {
                    return <Link style={{textDecoration: 'none'}} to={`/product/${categoryIDs.mobile}/${product.id}`}>
                    <CardItem
                            src={product.photoURL}
                            text={product.name}
                            price={product.price}
                            stock={product.stock}
                            label='Smartphone'
                        />
                    </Link>
                })
            }
            </div>
        </div>
    }


    return (
        <div className='main-div'>
            <div className='tabs'>
                <span className={laptopTab ? 'type-selected' : 'type'} onClick={() => setLaptopTab(true)}>Laptops</span>
                <span className={!laptopTab ? 'type-selected' : 'type'} onClick={() => setLaptopTab(false)}>Smartphones</span>
            </div>
            {laptopTab ? !isLoading && renderLaptopTab() : !isLoading && renderPhoneTab()}

        </div>

    )
}

export default Products
