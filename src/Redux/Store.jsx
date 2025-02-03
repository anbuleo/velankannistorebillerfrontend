import {configureStore} from '@reduxjs/toolkit'
import productReducer  from '../common/ProductSlice'
import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'
import {combineReducers} from '@reduxjs/toolkit'
import cartReducer from '../common/CartSlice'
import customerReducer from '../common/CustomerSlice'


const persistConfig = {
  key : 'root',
  version :1,
  storage
}


const reducer = combineReducers({
  product: productReducer,
  cart : cartReducer,
  customer : customerReducer
})

const persistedReducer = persistReducer(persistConfig,reducer)


export default configureStore({
  reducer : persistedReducer
})