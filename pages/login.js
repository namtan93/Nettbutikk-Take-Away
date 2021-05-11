import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import firebaseInstance from '../config/firebase';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { string, object} from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';

const schema = object().shape({
    email: string().required('Mandatory field'),
    password: string().required('Mandatory field')
});

export default function Login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    const {register, handleSubmit, errors} = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        const {email, password} = data;
        try {
            await firebaseInstance.auth().signInWithEmailAndPassword(data.email, data.password)
            router.push("/cart")
            console.log('Du har blitt logget inn');
        } catch(error) {
            setError(error.message);
            console.log('Noe gikk galt', error);
        }
    };

    useEffect(() => {
        console.log('Errors', errors);
    }, [errors]);


    return (
        <main className={styles.container}>
        <Header />
        
        <div className={styles.loginform}>
            <h1>Log in</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email:</label>
                <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                {...register('email')}
                />

                <label>Password:</label>
                <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                {...register('password')}
                />

            <button type="submit">Logg inn</button>
            {error && <p>{error}</p>}
            </form>
             <Link href="/signup">
                <a className={styles.signuplink}>New account? Register here </a>
            </Link>
        </div>
        </main>
    )
};