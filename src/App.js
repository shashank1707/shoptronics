import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/auth/signin';
import Signup from './pages/auth/signup';
import Product from './pages/Product';
import Products from './pages/Products';
import Cart from './pages/Cart';
import WishList from './pages/wishlist';
import Account from './pages/Account';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Confirm from './pages/Confirm';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';


function App() {

  window.addEventListener('storage', (e) => {
    const uid = localStorage.getItem('uid');
    if (!uid) {
      window.location.replace('/signin');
    }
  })
  return (
    <>
      <Router>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '100vh', width: '100%', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/signin' component={Signin} />
              <Route path='/signup' component={Signup} />
              <Route path='/product/:categoryID/:productID' component={Product} />
              <Route path='/products' component={Products} />
              <PrivateRoute path='/cart' component={Cart} />
              <PrivateRoute path='/wishlist' component={WishList} />
              <PrivateRoute path='/account' component={Account} />
              <PrivateRoute path='/orders' component={Orders} />
              <PrivateRoute path='/checkout' component={Checkout} />
              <PrivateRoute path='/confirm' component={Confirm} />
            </Switch>
          </div>
            <Footer />
        </div>
      </Router>

    </>


  );
}

export default App;
