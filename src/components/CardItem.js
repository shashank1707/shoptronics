import React from 'react';
import { Link } from 'react-router-dom';
import './Cards.css';

function CardItem(props) {
  return (
    <>
      <div className='cards__item'>
        <div className='cards__item__link'>
          <figure className='cards__item__pic-wrap' data-category={props.label}>
            <img
              className='cards__item__img'
              alt='Image'
              src={props.src}
            />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.text}</h5>
            {props.stock > 0 && props.price && <h5 className='cards__item__price'>{`Rs. ${props.price}`}</h5>}
            {props.stock <= 0 ? <h5 className='cards__item__text' style={{color: 'red'}}>Out of stock</h5> : <h6></h6>}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardItem;
