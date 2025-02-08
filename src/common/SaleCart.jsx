import {createSlice} from '@reduxjs/toolkit' ; 


let initialState ={
    bills:[],
    totalBllAmount: null,
    totalCreditAmount:null,
    TotalProfit:null,
    totalAmountByCustomer:0
   

}

export const saleCart = createSlice({
    name:'sale',
    initialState,
    reducers:{
        addAllBills:(state,action)=>{
            console.log(action.payload)
            state.bills=  action.payload
            state.totalBllAmount = state.bills?.reduce((acc,cur)=>acc + Number(cur.totalAmount),0)
            state.totalCreditAmount = state.bills?.reduce((acc,cur)=>acc + Number(cur.dueAmount),0)
            // state.TotalProfit = state.bills?.reduce((acc,cur)=>acc + Number(cur.))

        },
        deleteBillbyid : (state,action)=>{
            let id =action.payload

            let newBills = state.bills.filter((a,b)=>a._id != id)
            state.bills = newBills
            state.totalBllAmount = state.bills?.reduce((acc,cur)=>acc + Number(cur.totalAmount),0)
            state.totalCreditAmount = state.bills?.reduce((acc,cur)=>acc + Number(cur.dueAmount),0)

        },
        totalByCustomer : (state,action) => {
            let id = action.payload

            if(id === null){
                let billsc = state.bills.filter((a,b)=>a.customerId == null)
                state.totalAmountByCustomer = billsc?.reduce((acc,cur)=>acc + Number(current.totalAmount),0)
            }else if (id === 'all'){
                state.totalAmountByCustomer = state.bills?.reduce((acc,cur)=>acc + Number(cur.totalAmount),0)
            }else {
                let billsc = state.bills.filter((a,b)=>a.customerId == id)
                state.totalAmountByCustomer = billsc?.reduce((acc,cur)=>acc + Number(cur.totalAmount),0)
                if(billsc.length <=0){
                    state.totalAmountByCustomer = 0
                }
            }

           


        }
    }

})

export const {addAllBills,deleteBillbyid,totalByCustomer} = saleCart.actions

export default saleCart.reducer