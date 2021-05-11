import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';
import { useBasket } from '../contexts/basketContext'
import React, { createContext, useState } from 'react';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Link from 'next/link';
import firebaseInstance from '../config/firebase';

export default function Cart() {
    const {user, loading, isAuthenticated} = useAuth();
    const router = useRouter();
    const basket = useBasket();

    if(loading) {
        return (
            <div>
                <h1>Log in to order</h1>
            </div>
        )
    };

    if(!isAuthenticated) {
        router.push("/login");
    };



    const handleSignOut = async () => {
        await firebaseInstance.auth().signOut();
        router.push("/");
    };

    const handleOrders = () => {
        const orderCollection = firebaseInstance.firestore().collection('orders');

        orderCollection.doc().set({
            products: [...basket.productLines],
            receipt: basket.total,
            complete: false,
            ordernumber: Math.floor(Math.random() * 10000)
        })
        .then((doc) => {
            router.push('/receipt');
        })
        .catch((error) => {
            console.log('Error i handleOrders', error);
        })
    };

    const removeProduct = (id) => {
        basket.removeItem(id);
    }

    // const handlePlusButton = (id) => {
    //     basket.plusButton(id);
    // };

    return (
        <div className={styles.container}>
            <Header />
            <Link  href="/"> 
                <a className={styles.backLink}>Back to Menu</a>
            </Link>
             <button className={styles.signoutButton} onClick={handleSignOut}>Sign out</button>
             <h1>Cart</h1>
            <div className={styles.cart}>
                {basket.productLines.map((item, index) => {
                    //console.log(basket.productLines)
                    return  (
                        <div className={styles.cartListItem} key={item.id + index}>
                            <img src={item.image}></img>
                            <h2>{item.Name}</h2>
                            <p>{item.total} NOK</p>
                            <div className={styles.adjustButtons}>
                               <button className={styles.minus}> - </button>
                                <span> {item.Quantity} </span>
                                <button className={styles.plus} onClick={() => {basket.plusButton(item)}} > + </button>
                            </div>
                            <button onClick={() => {removeProduct(item.id)}}>Remove</button> 
                        </div>
                    )
                })}
                <h3>Total: {basket.total} NOK</h3>
                <button onClick={handleOrders}>Check out</button>
            </div>
            
        </div>
    )
};