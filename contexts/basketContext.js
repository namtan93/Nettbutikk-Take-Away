import React, { createContext, useContext, useEffect, useState } from 'react';

const BasketContext = createContext({
    productLines: [],
    addProductLine: () => {},
    total: 0,
});

export const Basket = ({ children }) => {
    const [productLines, setProductLines] = useState([]);
    const [total, setTotal] = useState(0);


//LocalStorage 
    useEffect(() => {
        let data = localStorage.getItem('product');
        let returned = JSON.parse(data);
        if(data) {
            setProductLines(returned);
        }
    }, []);

    useEffect(() => {
        let cartString = JSON.stringify(productLines);
        localStorage.setItem('product', cartString);
    }, [productLines]);



//Add products with total count
    const addProductLine = (product) => {
        const productInCart = productLines.find((item) => item.id === product.id);

        if(productInCart) {
            const productIndex = productLines.findIndex((item) => item.id === product.id);

            const newProductsLines = productLines;
            newProductsLines[productIndex] = {
                ...newProductsLines[productIndex], 
                Quantity: newProductsLines[productIndex].Quantity += 1,
                total: newProductsLines[productIndex].Quantity * newProductsLines[productIndex].Price,
            };

            setProductLines([...newProductsLines]);
        } else {
            let newProduct = {
                total: product.Price,
                ...product
            }
            setProductLines([...productLines, newProduct]);
        };
    };

//Remove item from cart
    const removeItem = (id) => {
        let filterProductLines = productLines.filter((item) => item.id !== id);
        setProductLines(filterProductLines);
    };



//Totalprice
   useEffect(() => {
        const totalPrice = productLines.reduce((prev, current) => {
            return prev + current.total;
        }, 0);
        setTotal(totalPrice);
    }, [productLines]);


//Clear storage in shoppingcart
    const clearStorage = () => {
        setProductLines([]);
    };

    
//Add +button
    const plusButton = (product) => {
        const productIndex = productLines.findIndex((item) => item.id === product.id);

        const newProductsLines = productLines;
        newProductsLines[productIndex] = {
            ...newProductsLines[productIndex], 
            Quantity: newProductsLines[productIndex].Quantity += 1,
            total: newProductsLines[productIndex].Quantity * newProductsLines[productIndex].Price,
        }; 
        setProductLines([...newProductsLines]);
    };



//Reduce -button
    const minusButton = (product) => {
        if(product.Quantity === 1) {
            removeItem(product.id)
        } else {
            const productIndex = productLines.findIndex((item) => item.id === product.id);

            const newProductsLines = productLines;
            newProductsLines[productIndex] = {
            ...newProductsLines[productIndex], 
            Quantity: newProductsLines[productIndex].Quantity -= 1,
            total: newProductsLines[productIndex].Quantity * newProductsLines[productIndex].Price
        }; 
        setProductLines([...newProductsLines])
        }
    };


    return (
        <BasketContext.Provider value={{ productLines, addProductLine, total, removeItem, plusButton, minusButton, clearStorage }}>
            {children}
        </BasketContext.Provider>
    );

};

export const BasketConsumer = BasketContext.Consumer;
export const useBasket = () => {
    return useContext(BasketContext);
};