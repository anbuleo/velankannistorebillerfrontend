import {createSlice} from '@reduxjs/toolkit' ; 
import { toast } from 'react-toastify';



const initialState = {
    cart: [],
    totalPriceInCart:0 ,
    customeronecart:{},
    
}

export const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers :{
        addProductToCart : (state,action) => {
            // console.log(action.payload)
            let findProduct = state.cart.findIndex(t=>t.productId === action.payload.productId)
            if(findProduct !== -1) {
                state.cart[findProduct].productQuantity += 1
                state.cart[findProduct].productTotal =state.cart[findProduct].productQuantity * state.cart[findProduct].productPrice
                let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
                // console.log(sum)
                state.totalPriceInCart = sum
            }else{

                state.cart.push(action.payload)
                let sum = state.cart.reduce((acc,cur)=> Number(acc)+ Number(cur.productTotal) , 0)
                state.totalPriceInCart = sum
            }
        },
        totalPrice :(state,action)=>{
            let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
            state.totalPriceInCart = sum
        },
        removeProductFromCart : (state,action) => {
            let id = action.payload

            let newCart = state.cart.filter((a,b)=>a.productId != id)

            state.cart = newCart
            let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
            state.totalPriceInCart = sum
           
    },
    lessoneproduct :(state,action)=>{
            let isProduct = state.cart.findIndex(t=>t.productId === action.payload)

            if(isProduct !== -1 && state.cart[isProduct].productQuantity >1){
                state.cart[isProduct].productQuantity -=1
                state.cart[isProduct].productTotal =state.cart[isProduct].productQuantity * state.cart[isProduct].productPrice
                let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
                state.totalPriceInCart = sum

            }else {
                toast.warning('Min one Qty')
            }
        }
    ,
    addProductOne :(state,action)=>{
            let isProduct = state.cart.findIndex(t=>t.productId === action.payload)

            if(isProduct !== -1 ){
                state.cart[isProduct].productQuantity +=1
                state.cart[isProduct].productTotal =state.cart[isProduct].productQuantity * state.cart[isProduct].productPrice
                let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
                state.totalPriceInCart = sum

            }else {
                toast.warning('Product Not found')
            }
        }
        ,
        customizeProductPrice : (state,action)=>{
            let isProduct = state.cart.findIndex(t=>t.productId === action.payload.productId)

            if(isProduct != -1){
                state.cart[isProduct].productPrice = Number(action.payload.customPrice)
                state.cart[isProduct].productTotal =state.cart[isProduct].productQuantity * state.cart[isProduct].productPrice
                let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
                state.totalPriceInCart = sum
            }
        },
        addCustomerBillOne : (state,action)=>{
            // console.log(action.payload)
            // state.customeronecart = []
            state.customeronecart = action.payload
        },
        deleCustomerBillOne : (state,action)=>{
            // console.log('a')
            state.customeronecart ={}
        },
        handleChangeInKGQty :(state,action)=>{
            console.log(action.payload)
            let isProduct = state.cart.findIndex(t=>t.productId === action.payload.productId)

            let qty = parseFloat(action.payload.qty)
            if(qty <= 0 || isNaN(qty)){
                return toast.warning('Qty must greater than 0.005 kg')
            } else {
                state.cart[isProduct].productQuantity = qty
                const qtysd = Number(state.cart[isProduct].productQuantity) 
                const price = Number(state.cart[isProduct].productPrice) 
                const total = (qtysd * price)
               
                state.cart[isProduct].productTotal = Math.ceil(Number(total)) 
                let sum = state.cart.reduce((acc,cur)=>acc+ Number(cur.productTotal) , 0)
                state.totalPriceInCart = sum
            }
        },
        resetCart :(state)=>{
            return initialState
        }
}
})


export const {resetCart,handleChangeInKGQty,addProductToCart,removeProductFromCart,totalPrice,lessoneproduct,addProductOne,customizeProductPrice,addCustomerBillOne,deleCustomerBillOne} = cartSlice.actions


export default cartSlice.reducer

