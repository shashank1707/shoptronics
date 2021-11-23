import React, { useState, useEffect } from 'react'
import CardItem from './CardItem';
import { getCategories, getProducts, getBestProducts} from '../backend/products';
import { Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function BestProducts({ type, id }) {
    const [bestProductList, setBestProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initState();
    }, [])

    const initState = async () => {
        const productList = await getBestProducts(id);
        setBestProductList(productList);
        setIsLoading(false);
    }

    if (isLoading) {
        return <Spinner animation="border" />
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}} >
            {bestProductList.map((product) => {
                return <Link style={{textDecoration: 'none'}} to={`/product/${id}/${product.id}`}>
                <CardItem
                        src={product.photoURL}
                        text={product.name}
                        price={product.price}
                        stock={product.stock}
                        label={type}
                    />
                </Link>
            })}
        </div>
    )
}

export default BestProducts
