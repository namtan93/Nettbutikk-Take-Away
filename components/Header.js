import React from 'react';
import { useBasket } from '../contexts/basketContext';
import Link from 'next/link';
import Image from 'next/image';
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../styles/Home.module.css';


export default function Header() {
    const basket = useBasket();

    return (
        <header className={styles.header}>
        <div className={styles.icons}>
          <Link href="/cart">
            <a>
              <FontAwesomeIcon 
              icon={faShoppingCart} 
              fixedWidth 
              size="lg" />
               <span className={styles.total}> {basket.total} NOK</span>
            </a>
          </Link> 
        </div>
        <div className={styles.logo}>
          <Image 
          src='/logo-deli.png' 
          width={200} 
          height={90} />
        </div>
      </header>
    )
};


