import React, { useState, useEffect } from 'react';
import firebaseInstance from '../config/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { string, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';

const schema = object().shape({
    email: string().required('Mandatory field'),
    password: string().required('Mandatory field')
});

export default function Signup() {
    const [error, setError] = useState(null);
    const router = useRouter();
    const userCollection = firebaseInstance.firestore().collection('users');

    const {register, handleSubmit, formState:{ errors }} = useForm();

    const onSubmit = async (data) => {
        const {email, password} = data;
        
        try {
            const user = await firebaseInstance.auth().createUserWithEmailAndPassword(data.email, data.password);
            userCollection.doc(user.user.uid).set({
                userId: user.user.uid,
                userEmail: user.user.email,
            })
            router.push('/login')
        } catch(error) {
            setError(error.message)
            console.log('Something went wrong', error);
          }
    };

    useEffect(() => {
        console.log('Errors', errors);
    }, [error]);

    return (
        <main className={styles.container}>
            <Header />
            <div className={styles.signupform}>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
            <label>Email:</label>
            <input 
            type='email' 
            name="email" 
            placeholder="Email" 
            {...register('email')} 
            />
            <label>Password:</label>
            <input 
            type="password" 
            name="password" 
            placeholder="password" 
            {...register('password')}/>

            <button type="submit">Register</button>
            {error && <p>{error}</p>}
            </form>
            <Link href="/login"> 
                <a  className={styles.loginlink}>Have already account? Log in</a>
            </Link>
            </div>
        </main>
    )
};