import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

/**
 * Senior Developer Note: 
 * We use a factory function to ensure consistent object structure across rehydration 
 * or when adding new tabs.
 */
const createDefaultBill = (id, name) => ({
    id,
    name: name || `Counter ${id}`,
    cart: [],
    totalPriceInCart: 0,
    customeronecart: { name: 'Retail Customer' },
});

const initialState = {
    activeBillId: 1,
    bills: [createDefaultBill(1)],
}

/**
 * Defensive utility to ensure state integrity.
 * If redux-persist rehydrates invalid data (like a string), 
 * we gracefully fallback to initialState.
 */
const validateState = (state) => {
    if (!state || typeof state !== 'object' || !Array.isArray(state.bills)) {
        return initialState;
    }
    return null;
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        ensureActiveBill: (state) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            if (state.bills.length === 0) {
                state.bills = [createDefaultBill(1)];
                state.activeBillId = 1;
            }
        },
        setActiveBill: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;
            state.activeBillId = action.payload;
        },
        addBillTab: (state) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const nextId = state.bills.length > 0 ? Math.max(...state.bills.map(b => b.id)) + 1 : 1;
            const newBill = createDefaultBill(nextId);
            state.bills.push(newBill);
            state.activeBillId = nextId;
            toast.success(`New Billing Workspace: ${newBill.name}`);
        },
        removeBillTab: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            if (state.bills.length <= 1) {
                toast.warning("Management rule: Cannot close the primary billing node.");
                return;
            }
            const idToRemove = action.payload;
            state.bills = state.bills.filter(b => b.id !== idToRemove);
            if (state.activeBillId === idToRemove) {
                state.activeBillId = state.bills[0].id;
            }
            toast.info("Tab context cleared.");
        },
        addProductToCart: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId) || state.bills[0];
            if (!bill) return;

            let findProduct = bill.cart.findIndex(t => t.productId === action.payload.productId)
            if (findProduct !== -1) {
                bill.cart[findProduct].productQuantity += 1
                bill.cart[findProduct].productTotal = Number(bill.cart[findProduct].productQuantity) * Number(bill.cart[findProduct].productPrice)
            } else {
                const newItem = {
                    ...action.payload,
                    productQuantity: 1,
                    productTotal: Number(action.payload.productPrice)
                }
                bill.cart.push(newItem)
            }
            bill.totalPriceInCart = Math.ceil(bill.cart.reduce((acc, cur) => acc + Number(cur.productTotal), 0))
        },
        removeProductFromCart: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId);
            if (!bill) return;

            bill.cart = bill.cart.filter((a) => a.productId != action.payload)
            bill.totalPriceInCart = Math.ceil(bill.cart.reduce((acc, cur) => acc + Number(cur.productTotal), 0))
        },
        lessoneproduct: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId);
            if (!bill) return;

            let idx = bill.cart.findIndex(t => t.productId === action.payload)
            if (idx !== -1 && bill.cart[idx].productQuantity > 1) {
                bill.cart[idx].productQuantity -= 1
                bill.cart[idx].productTotal = bill.cart[idx].productQuantity * bill.cart[idx].productPrice
                bill.totalPriceInCart = Math.ceil(bill.cart.reduce((acc, cur) => acc + Number(cur.productTotal), 0))
            }
        },
        addProductOne: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId);
            if (!bill) return;

            let idx = bill.cart.findIndex(t => t.productId === action.payload)
            if (idx !== -1) {
                bill.cart[idx].productQuantity += 1
                bill.cart[idx].productTotal = bill.cart[idx].productQuantity * bill.cart[idx].productPrice
                bill.totalPriceInCart = Math.ceil(bill.cart.reduce((acc, cur) => acc + Number(cur.productTotal), 0))
            }
        },
        customizeProductPrice: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId);
            if (!bill) return;

            let idx = bill.cart.findIndex(t => t.productId === action.payload.productId)
            if (idx != -1) {
                bill.cart[idx].productPrice = Number(action.payload.customPrice)
                bill.cart[idx].productTotal = bill.cart[idx].productQuantity * bill.cart[idx].productPrice
                bill.totalPriceInCart = Math.ceil(bill.cart.reduce((acc, cur) => acc + Number(cur.productTotal), 0))
            }
        },
        addCustomerBillOne: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId) || state.bills[0];
            if (bill) bill.customeronecart = action.payload;
        },
        handleChangeInKGQty: (state, action) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId) || state.bills[0];
            if (!bill) return;

            let idx = bill.cart.findIndex(t => t.productId === action.payload.productId)
            if (idx === -1) return;

            let qty = parseFloat(action.payload.qty)
            if (isNaN(qty) || qty < 0) qty = 0;

            bill.cart[idx].productQuantity = qty
            bill.cart[idx].productTotal = Math.ceil(qty * Number(bill.cart[idx].productPrice))
            bill.totalPriceInCart = Math.ceil(bill.cart.reduce((acc, cur) => acc + Number(cur.productTotal), 0))
        },
        resetCart: (state) => {
            const corrupted = validateState(state);
            if (corrupted) return corrupted;

            const bill = state.bills.find(b => b.id === state.activeBillId) || state.bills[0];
            if (bill) {
                bill.cart = []
                bill.totalPriceInCart = 0
                bill.customeronecart = { name: 'Retail Customer' }
            }
        }
    }
})

export const {
    resetCart,
    handleChangeInKGQty,
    addProductToCart,
    removeProductFromCart,
    lessoneproduct,
    addProductOne,
    customizeProductPrice,
    addCustomerBillOne,
    deleCustomerBillOne,
    setActiveBill,
    addBillTab,
    removeBillTab,
    ensureActiveBill
} = cartSlice.actions

export default cartSlice.reducer
