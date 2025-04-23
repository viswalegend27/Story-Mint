import '../styles/globals.css'
import Nav from '../components/Nav';
import {ToastContainer} from 'react-toastify';

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Nav />
      <main>
        <ToastContainer limit={1}/>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
