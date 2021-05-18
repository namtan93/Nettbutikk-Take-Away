import React, { useState, useEffect } from 'react';
import firebaseInstance  from   '../config/firebase';
import styles from '../styles/Home.module.css';


function Kitchen() {
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        try {
            const orderCollection = firebaseInstance.firestore().collection('orders').onSnapshot((querySnapshot) => {
                let foodOrders = [];
                querySnapshot.forEach((doc) => {
                    foodOrders.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setOrders(foodOrders);
            });
            return orderCollection;
        } catch (error) {
            console.log("Error under Kitchen Firebase", error);
        }
    }, []);


    //Completed orders
    const completeOrders = (item) => {
        const orderCollection = firebaseInstance.firestore().collection('orders').doc(item.id).update({
            complete: true,
        })
        .then(() => {
            console.log('Oppdated');
        })
        .catch((error) => {
            console.log(error);
        })
    };

    //Orders have been picked up
    const handlePickUp = (item) => {
        firebaseInstance.firestore().collection('orders').doc(item.id).delete();
        firebaseInstance.firestore().collection('delivered').doc(item.id).set({...item});
    };    
  

    return (
        <div className={styles.container}>
            <h1>Incomming orders</h1>
            {orders && orders.map((item, index) => {
                return(
                    <section key={orders.id + index} className={styles.kitchen}>
                        {item.products && item.products.map((product, index) => {
                            return(
                                <div key={product.id + index}>
                                    <h2>{product.Name} x {product.Quantity}</h2>
                                </div>
                            )
                        })}
                    <h3>Ordernumber: {item.ordernumber}</h3> 
                    {!item.complete && <button onClick={() => {
                        completeOrders(item)}} className={styles.completed}> Completed </button>}
                    <button onClick={() => {
                        handlePickUp(item)}} className={styles.picked}> Picked up</button>
                    </section>
                )
            })}
        </div>
    )
}

export default Kitchen;
