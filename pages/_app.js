import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import React from 'react';
import Nav from '../components/Nav';

const MemoizedNav = React.memo(Nav);

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <MemoizedNav />
      <main>
        <Component {...pageProps} />
      </main>
      <ToastContainer limit={1} />
    </>
  );
}
