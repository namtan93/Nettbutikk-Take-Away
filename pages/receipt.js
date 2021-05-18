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
            <h1>Order confirmation</h1>
            {orders && orders.map((item, index) => {
                return (
                    <div key={item.id + index} className={styles.orderConfirm}>
                        {item.products && item.products.map((product, index) => {
                            return (
                                <div key={product.id + index}>
                                    <h2>{product.Name} x {product.Quantity}</h2>
                                </div>
                                )
                            })}  
                        <h3>Order number: {item.ordernumber}</h3>     
                    </div>
                    )
                })}
            
            <section className={styles.orderStatus}>
                <h4>Order status:</h4>
                <div className={styles.status}>
                    <div className={styles.underMaking}>
                        <p>Under making:</p>
                        {orders && orders.filter((item) => !item.complete).map((item, index) => {
                            return (
                                <div key={item.id + index}>
                                    <p>{item.ordernumber}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.ready}>
                        <p>Ready to collect:</p>
                        {orders && orders.filter((item) => item.complete).map((item, index) => {
                            return (
                                <div key={item.id + index}>
                                    <p>{item.ordernumber}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>    
        </div>
    )
}

export default Receipt;
