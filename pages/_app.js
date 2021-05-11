import '../styles/globals.css';
import { AuthProvider } from '../contexts/auth';
import { Basket } from '../contexts/basketContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Basket>
        <Component {...pageProps} /> 
      </Basket>
    </AuthProvider>
    
  )
  
  
}

export default MyApp;
