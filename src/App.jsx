import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Nav from './components/Nav'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import ProtectedRoute from './common/ProtectedRoute'
import Home from './Pages/Home'
import AuthContext from './Context/AuthContext'
import Footer from './components/Footer'
import Product from './Pages/Product'
import CreateProduct from './Pages/CreateProduct'
import AddBarCode from './Pages/AddBarCode'
import EditProduct from './Pages/EditProduct'
import BarCodeContext from './Context/BarCodeContext'
import CreateCoustomer from './Pages/CreateCoustomer'
import InstaBiller from './Pages/InstaBiller'
import Sale from './Pages/Sale'
import Customer from './Pages/Customer'
import BalanceCreate from './Pages/BalanceCreate'
import BarCodePrinter from './Pages/BarCodePrinter'
import AdminControl from './common/AdminControl'
import User from './Pages/User'
import EditUser from './Pages/EditUser'


function App() {
 

  return (
    <>
      <BrowserRouter>
      
      
      <Routes>
      <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<SignIn />} />
        <Route  path='*' element={<Navigate to='/' />}/>
        <Route path='/home' element={<ProtectedRoute><AuthContext><Nav/><Home/> <Footer /></AuthContext></ProtectedRoute>}/>
        <Route path='/barcodeprint' element={<ProtectedRoute><AuthContext><Nav/><BarCodePrinter/> <Footer /></AuthContext></ProtectedRoute>}/>
        <Route path='/customer' element={<ProtectedRoute><AuthContext><Nav/><Customer/> <Footer /></AuthContext></ProtectedRoute>}/>
        <Route path='/createbalancesheet' element={<ProtectedRoute><AdminControl><AuthContext><Nav/><BalanceCreate/> <Footer /></AuthContext></AdminControl></ProtectedRoute>}/>
        <Route path='/sale' element={<ProtectedRoute><AuthContext><Nav/><Sale/> <Footer /></AuthContext></ProtectedRoute>}/>
        <Route path='/user' element={<ProtectedRoute><AuthContext><AdminControl><Nav/><User/> <Footer /></AdminControl></AuthContext></ProtectedRoute>}/>
        <Route path='/edituser/:id' element={<ProtectedRoute><AuthContext><AdminControl><Nav/><EditUser/> <Footer /></AdminControl></AuthContext></ProtectedRoute>}/>
        <Route path='/product' element={<ProtectedRoute><AuthContext><Nav/><Product /></AuthContext></ProtectedRoute>}/>
        <Route path='/createproduct' element={<ProtectedRoute><AdminControl><AuthContext><Nav/><CreateProduct/> <Footer /></AuthContext></AdminControl></ProtectedRoute>} />
        {/* <Route path='/addbarcode' element={<AddBarCode />}/> */}
        <Route path='/editproduct/:id' element={<ProtectedRoute><AdminControl><AuthContext><Nav/><EditProduct/> <Footer /></AuthContext></AdminControl></ProtectedRoute>}/>
        <Route path='/createcustomer' element={<ProtectedRoute><AuthContext><Nav/><CreateCoustomer/> <Footer /></AuthContext></ProtectedRoute>} />
        <Route path='/instabiller'  element={<ProtectedRoute><AuthContext><Nav/><InstaBiller /></AuthContext></ProtectedRoute>}/>
      </Routes>
     
      </BrowserRouter>
    </>
  )
}

export default App
