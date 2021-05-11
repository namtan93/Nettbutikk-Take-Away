import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import firebaseInstance from '../config/firebase';

function Receipt() {
    const [orders, setOrders] = useState(null);

    //Pusher bestilling som er bestilt
    useEffect(() => {
        try {
            const orderCollection = firebaseInstance.firestore().collection('orders').onSnapshot((querySnapshot) => {
                let food = [];
                querySnapshot.forEach((doc) => {
                    food.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setOrders(food);
            });
            return orderCollection;
        } catch(error) {
            console.log('Error receipt.js', error);
        }
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <Link  href="/"> 
                <a className={styles.backLink}>Back to Menu</a>
            </Link>
            <h1>Invoice confirmation</h1>
            <h2>Your orders have successfully sent! The restaurant is now preparing your food!</h2>
                {orders &&  orders.map((item, index) => {
                    return (
                        <div key={item.id + index}>
                            {item.products && item.products.map((product, index) => {
                                return (
                                    <div key={product.id + index}>
                                        <h3>{product.Name} x {product.Quantity}</h3>
                                        <h4>Order number: {item.ordernumber}</h4>
                                    </div>
                                )
                            })}
                            
                        </div>
                    )
                })}
            </div>
    )
}

export default Receipt;
