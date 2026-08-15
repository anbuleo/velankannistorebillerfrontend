import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch, useSelector } from 'react-redux'
import { addAllCustomer } from '../common/CustomerSlice'
import { resetCart } from '../common/CartSlice'
import { queueBill } from '../common/OfflineSlice'
import { addAllBills, updateBillInRedux } from '../common/SaleCart'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function genrateBill() {
    let [billLoading, setBillLoading] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()

    const { bills } = useSelector(state => state.sale || { bills: [] });
    const { pendingBills } = useSelector(state => state.offline || { pendingBills: [] });

    // Enterprise Invoice Series Generator (010001 format)
    const getNextBillNumber = () => {
        const totalCount = (bills?.length || 0) + (pendingBills?.length || 0);
        const serial = (totalCount + 1).toString().padStart(4, '0');
        return `01${serial}`;
    };

    const createBill = async (paymentType, cart, totalPriceInCart, customeronecart, paymentStatus = 'paid') => {
        const billNumber = getNextBillNumber();
        const idempotencyKey = `IK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const storedData = localStorage.getItem('data');
        const userData = storedData ? JSON.parse(storedData) : {};
        const creatorId = userData?._id || '';

        let paidAmount = paymentStatus === 'paid' ? totalPriceInCart : 0;
        let dueAmount = paymentStatus === 'paid' ? 0 : totalPriceInCart;

        const mappedProducts = Array.isArray(cart) ? cart.map(item => ({
            productId: item.productId || item._id,
            productName: item.productName,
            productQuantity: Number(item.productQuantity || item.quantity || 1),
            productPrice: Number(item.productPrice || item.price || 0),
            productCost: Number(item.productCost || item.cost || 0),
            productUnit: item.productUnit || item.unitValue || '',
            qantityType: item.qantityType || ''
        })) : [];

        let val = {
            billNumber: billNumber,
            idempotencyKey: idempotencyKey,
            customerName: customeronecart?.name || 'customer',
            customerId: customeronecart?._id || null,
            customerMobile: customeronecart?.mobile || null,
            totalAmount: totalPriceInCart,
            paidAmount: paidAmount,
            dueAmount: dueAmount,
            createBy: creatorId,
            paymentType: paymentType,
            products: mappedProducts
        }

        // Logic: Try Online, Fallback to Offline Queue
        if (navigator.onLine) {
            try {
                let res = await AxiosService.post('/saleprint/printbill', val)
                if (res.status === 201 || res.status === 200) {
                    const serverBill = res.data?.bill || res.data;
                    if (serverBill) {
                        dispatch(updateBillInRedux(serverBill));
                    }
                    return { ...res.data, billNumber: serverBill?.billNumber || billNumber };
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

    return { billLoading, getCustomer, createBill, getNextBillNumber }
}

export default genrateBill