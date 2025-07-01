import Navbar from '../../components/navbar/navbar';
import MessagesTable from '../messagelist/messagelist';


function Layoutt({ toggleTheme, isDark }) {

  return (
    <>
          <Navbar toggleTheme={toggleTheme} isDark={isDark} /> 
      <main><MessagesTable/></main>
    </>
  );
}

export default Layoutt;

