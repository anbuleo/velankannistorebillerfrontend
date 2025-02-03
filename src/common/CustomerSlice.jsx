import {createSlice} from '@reduxjs/toolkit';



const initialVal = {
    customer:[]
}

export const customerSlice = createSlice({
    name:'customer',
    initialState :initialVal,
    reducers:{
        addAllCustomer : (state,action)=>{
            state.customer = action.payload
        }
    }
})



export const {addAllCustomer}  = customerSlice.actions

export default customerSlice.reducer