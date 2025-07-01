import './index.css';
import './theme/colors.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layoutt from './pages/layout/layoutt';
import ProductList from './components/ProductList/ProductList';
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout/>
          }
        />
        <Route
          path="/contactus"
          element={
            <Layoutt />
          }
        />
      </Routes>
  <ToastContainer position="top-right" autoClose={1000}  /> 
    </>
  )
}
export default App
