import {createSlice} from '@reduxjs/toolkit'

let initialState = {
    balanceSheet:[],
    TotalBalance:0
}

export const balanceSheetSlice = createSlice({
    name:'balancesheet',
    initialState,
    reducers:{
        addAllBalanceSheet:(state,action)=>{
            state.balanceSheet = action.payload
            state.TotalBalance = state.balanceSheet.reduce((acc,cur)=>acc + Number(cur.remainingBalance),0)
        }
    }
})



export const {addAllBalanceSheet} = balanceSheetSlice.actions

export default balanceSheetSlice.reducer