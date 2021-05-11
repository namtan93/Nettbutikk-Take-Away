import React  from 'react';
import { useBasket } from '../contexts/basketContext';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import firebaseInstance from  '../config/firebase';

function FoodList({ food, errors }) {
  const basket = useBasket();

  const handleAddToBasket = (item) => {
    basket.addProductLine(item);
  };


  return (
    <div className={styles.container}>
    <Header/>
    <main className={styles.main}>
    <h1> A TASTE OF THAI TO GO</h1>
    
    <section className={styles.foodMenu}>
      
        <ul className={styles.menu}>
        {food && food.map(item => {
            return (
                <li key={item.id}>
                  <h2>{item.Name}</h2>
                  <img src={item.image} width="300px" height="220px" />
                  <h3>{item.Price} NOK </h3>
                  <p>Ingredients: {item.Ingredients}</p>
                  <button type="submit" onClick={() => {
                    handleAddToBasket(item)}}>Add to cart</button>
                </li>
              )
          })}
        </ul>
    </section>
    </main>
    </div>
  )
};

FoodList.getInitialProps = async () => {
  try {
    const foodMenuCollection = await firebaseInstance.firestore().collection('foodMenu');

    const foodMenuData = await foodMenuCollection.get();
   
    let food = [];
    foodMenuData.forEach(product => {
      food.push({
        id: product.id,
        ...product.data()
      });
    });
    return { food }
  } catch (error) {
    return {
      error: error.message
    };
  }; 
};

export default FoodList;

