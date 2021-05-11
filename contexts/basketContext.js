import React, { createContext, useContext, useEffect, useState} from 'react';

const BasketContext = createContext({
    productLines: [],
    addProductLine: () => {},
    total: 0
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
        const productInCart = productLines.filter((item) => item.id === product.id).length;

        if(productInCart) {
            const productIndex = productLines.findIndex((item) => item.id === product.id);

            const newProductsLines = productLines;
            newProductsLines[productIndex] = {
                ...newProductsLines[productIndex], 
                Quantity: newProductsLines[productIndex].Quantity += 1,
                total: newProductsLines[productIndex].Quantity * newProductsLines[productIndex].Price,
            };

            setProductLines([...productLines]);
        } else {
            let newProduct = {
                total: product.Price,
                ...product
            }
            setProductLines([...productLines, newProduct]);
        };
    };

    const removeItem = (id) => {
        let filterProductLines = productLines.filter((item) => item.id !== id);
        setProductLines(filterProductLines);
    };

    //Add + button
    const plusButton = (product) => {
        //let inCart =  [...product];
        let inCart = product.id
        console.log(product, inCart)
        console.log('all the products:', productLines)
        let selectedItem = productLines.find(el => el.id === product.id)
        console.log('we picked this item:', selectedItem.Name, selectedItem.Quantity, selectedItem.id)
      
        //let updatedProduct = inCart.find(item => item.id === product.id).length;
        
        // if(updatedProduct) {

        // }
       
    };

    //Reduce - button
    const minusButton = (product) => {

    };


    //Totalprice
    useEffect(() => {
        const totalPrice = productLines.reduce((prev, current) => {
            return prev + current.total;
        }, 0);
        setTotal(totalPrice);
    }, [productLines]);

    return (
        <BasketContext.Provider value={{ productLines, addProductLine, total, removeItem, plusButton }}>
            {children}
        </BasketContext.Provider>
    );

};

export const BasketConsumer = BasketContext.Consumer;
export const useBasket = () => {
    return useContext(BasketContext);
};