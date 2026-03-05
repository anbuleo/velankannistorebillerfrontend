import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pendingBills: [],
};

export const offlineSlice = createSlice({
    name: "offline",
    initialState,
    reducers: {
        queueBill: (state, action) => {
            state.pendingBills.push({
                ...action.payload,
                queuedAt: new Date().toISOString()
            });
        },
        removeQueuedBill: (state, action) => {
            state.pendingBills = state.pendingBills.filter(b => b.billNumber !== action.payload);
        },
        clearQueue: (state) => {
            state.pendingBills = [];
        }
    }
});

export const { queueBill, removeQueuedBill, clearQueue } = offlineSlice.actions;
export default offlineSlice.reducer;
