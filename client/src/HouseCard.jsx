import React from 'react';
import { Button } from 'react-bootstrap';
import './styles.css';
import './HouseParser.css';

const HouseCard = ({ house, addFunction, deleteFunction }) => {
    return (
        <div className="row d-flex justify-content-center align-items-center m-3">
            <div className="col-6 border border-left-0 border-secondary border-width-2 p-4">
                <h1 className='fs-1'>{house.title}</h1>
                <h3>{house.price}</h3>
                <p>{house.description}</p>
                <a href={house.href}>{house.href}</a>
            </div>
            <div className="col-2 card-buttons-container">
                <Button variant='success' className="m-2" onClick={()=>addFunction(house)}>Si</Button>
                <Button variant='danger' className="m-2" onClick={()=>deleteFunction(house)}>No</Button>
            </div>
        </div>
    );
}

export default HouseCard;