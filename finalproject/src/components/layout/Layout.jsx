import Navbar from '../navbar/navbar';
import { Container } from '@mui/material';
import ProductList from '../ProductList/ProductList';
// this is the general layout where all the compomenets are renderd 
export default function Layout({ toggleTheme, isDark }) {
  return (
    <>
      <Navbar toggleTheme={toggleTheme} isDark={isDark} /> 
    <Container sx={{ mt: 4 }}>
      <ProductList />
    </Container>
    </>
  );
}