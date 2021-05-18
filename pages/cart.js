  
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';
import { useBasket } from '../contexts/basketContext'
import React from 'react';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import Link from 'next/link';
import firebaseInstance from '../config/firebase';

export default function Cart() {
    const {loading, isAuthenticated} = useAuth();
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
            ordernumber: Math.floor(Math.random() * 1000)
        })
        .then((doc) => {
            router.push('/receipt');
        })
        .then((doc) => {
            basket.clearStorage();
        })
        .catch((error) => {
            console.log('Error i handleOrders', error);
        })
    };

    const removeProduct = (id) => {
        basket.removeItem(id);
    }

    return (
        <div className={styles.container}>
            <Header />
            <Link  href="/"> 
                <a className={styles.backLink}>Back to Menu</a>
            </Link>
            <button className={styles.signoutButton} onClick={handleSignOut}>Sign out</button>
            <h1>Cart</h1>
            <div className={styles.cart}>
                {basket.productLines.length > 0 && basket.productLines.map((item, index) =>    {
                    return  (  
                        <div className={styles.cartListItem} key={item.id + index}>
                            <img src={item.image} alt={item.alt}/>
                            <h2>{item.Name}</h2>
                            <p>{item.total} NOK</p>
                            <div className={styles.adjustButtons}>
                               <button className={styles.minus} 
                               onClick={() => {basket.minusButton(item)}}> - </button>
                                <span> {item.Quantity} </span>
                                
                                <button className={styles.plus}
                                onClick={() => {basket.plusButton(item)}} > + </button>
                                
                                <button onClick={() => {removeProduct(item.id)}} className={styles.remove}>Delete</button>  
                            </div>
                           
                        </div>
                    )
                })}
                <h3>Total: {basket.total} NOK</h3>
                <button onClick={handleOrders} className={styles.checkout}>Check out</button>
            </div>
        </div>
    )
};