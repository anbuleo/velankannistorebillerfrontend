// import React from 'react'
import {createSlice}  from '@reduxjs/toolkit'







const initialState = {product:[]}


 
export const productSlice = createSlice({
  name:"product",
  initialState,
  reducers :{
    addProduct :(state,action)=>{
      // state.push(action.payload)
      state.product.push(action.payload)
    },
    addAllProduct : (state,action)=>{
      // console.log(action.payload)
      state.product = action.payload;  
        
            
        // state.push(...action.payload)

      
      // console.log(state,action.payload)
    },
    editProductRedux :(state,action)=>{
      const todos = state.product;
      const todoIdx = todos.findIndex(t => t._id === action.payload._id);
      let newData = action.payload;
      todos[todoIdx] = newData

        
          
    },
    deleteProductRedux : (state,action) =>{
      let findProduct = state.product.findIndex(t=>t._id === action.payload)
      if(findProduct){
        state.product.splice(Number(findProduct),1)
      }
      
    },
    
  }
})


export const {addProduct,addAllProduct,editProductRedux,deleteProductRedux} = productSlice.actions
export default productSlice.reducer