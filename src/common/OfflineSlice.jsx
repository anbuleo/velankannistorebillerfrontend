import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pendingBills: [],
};

export const offlineSlice = createSlice({
    name: "offline",
    initialState,
    reducers: {
        queueBill: (state, action) => {
            const exists = state.pendingBills.some(b => 
                (b.billNumber && b.billNumber === action.payload.billNumber) ||
                (b.idempotencyKey && b.idempotencyKey === action.payload.idempotencyKey)
            );
            if (!exists) {
                state.pendingBills.push({
                    ...action.payload,
                    queuedAt: new Date().toISOString()
                });
            }
        },
        removeQueuedBill: (state, action) => {
            const targetKey = action.payload;
            if (!targetKey) return;
            state.pendingBills = state.pendingBills.filter(b => 
                b.billNumber !== targetKey && b.idempotencyKey !== targetKey
            );
        },
        clearQueue: (state) => {
            state.pendingBills = [];
        }
    }
});

export const { queueBill, removeQueuedBill, clearQueue } = offlineSlice.actions;
export default offlineSlice.reducer;
