import '../styles/globals.css'
import Layout from '../components/Layout'
import { Provider } from "react-redux";
import { store, persistor } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
      <ToastContainer/>
    </Provider>
  ); 
}
