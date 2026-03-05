import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch, useSelector } from 'react-redux'
import { addAllCustomer } from '../common/CustomerSlice'
import { resetCart } from '../common/CartSlice'
import { queueBill } from '../common/OfflineSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function genrateBill() {
    let [billLoading, setBillLoading] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    const { bills } = useSelector(state => state.sale || { bills: [] });
    const { pendingBills } = useSelector(state => state.offline || { pendingBills: [] });

    // Enterprise Invoice Series Generator
    const getNextBillNumber = () => {
        const now = new Date();
        const yy = now.getFullYear().toString().slice(-2);
        const mm = (now.getMonth() + 1).toString().padStart(2, '0');

        // Combined count of server bills + local pending bills to prevent collisions
        const totalRelevantBills = [
            ...(bills || []),
            ...(pendingBills || [])
        ].filter(b => {
            const billDate = new Date(b.createdAt || b.queuedAt);
            return billDate.getMonth() === now.getMonth() &&
                billDate.getFullYear() === now.getFullYear();
        });

        const serial = (totalRelevantBills.length + 1).toString().padStart(3, '0');
        return `INV-${yy}-${mm}-${serial}`;
    };

    const createBill = async (paymentType, cart, totalPriceInCart, customeronecart, paymentStatus = 'paid') => {
        const billNumber = getNextBillNumber();
        const storedData = localStorage.getItem('data');
        const userData = storedData ? JSON.parse(storedData) : {};
        const creatorId = userData?._id || '';

        let paidAmount = paymentStatus === 'paid' ? totalPriceInCart : 0;
        let dueAmount = paymentStatus === 'paid' ? 0 : totalPriceInCart;

        let val = {
            billNumber: billNumber,
            customerName: customeronecart?.name || 'customer',
            customerId: customeronecart?._id || null,
            customerMobile: customeronecart?.mobile || null,
            totalAmount: totalPriceInCart,
            paidAmount: paidAmount,
            dueAmount: dueAmount,
            createBy: creatorId,
            paymentType: paymentType,
            products: cart
        }

        // Logic: Try Online, Fallback to Offline Queue
        if (navigator.onLine) {
            try {
                let res = await AxiosService.post('/saleprint/printbill', val)
                if (res.status == 201) {
                    return { ...res.data, billNumber };
                }
            } catch (error) {
                console.warn("Online sync failed, falling back to local queue", error);
            }
        }

        // Offline Mode / Failed Sync
        dispatch(queueBill(val));
        toast.info("Saved Locally (Offline Mode)");
        return { message: "Queued Locally", billNumber };
    }

    const getCustomer = async () => {
        if (!navigator.onLine) return; // Silent skip if offline
        try {
            let res = await AxiosService.get('/customer/getallcustomer')
            if (res.status == 200) {
                dispatch(addAllCustomer(res.data?.customer))
            }
        } catch (error) {
            toast.error('Sync Error')
        }
    }

    return { billLoading, getCustomer, createBill }
}

export default genrateBill