import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch, useSelector } from 'react-redux'
import { addAllCustomer } from '../common/CustomerSlice'
import { resetCart } from '../common/CartSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function genrateBill() {


    let [billLoading, setBillLoading] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()


    const { bills } = useSelector(state => state.sale || { bills: [] });

    // Enterprise Invoice Series Generator
    const getNextBillNumber = () => {
        const now = new Date();
        const yy = now.getFullYear().toString().slice(-2);
        const mm = (now.getMonth() + 1).toString().padStart(2, '0');

        // Count bills from the CURRENT month to reset serials monthly
        const currentMonthBills = (bills || []).filter(b => {
            const billDate = new Date(b.createdAt);
            return billDate.getMonth() === now.getMonth() &&
                billDate.getFullYear() === now.getFullYear();
        });

        const serial = (currentMonthBills.length + 1).toString().padStart(3, '0');
        return `INV-${yy}-${mm}-${serial}`;
    };

    const createBill = async (paymentType, cart, totalPriceInCart, customeronecart, paymentStatus = 'paid') => {
        try {
            const storedData = localStorage.getItem('data');
            const userData = storedData ? JSON.parse(storedData) : {};
            const creatorId = userData?._id || '';
            const billNumber = getNextBillNumber();

            // Calculate amounts based on selected payment status
            let paidAmount = 0;
            let dueAmount = 0;

            if (paymentStatus === 'paid') {
                paidAmount = totalPriceInCart;
                dueAmount = 0;
            } else if (paymentStatus === 'pending') {
                paidAmount = 0;
                dueAmount = totalPriceInCart;
            } else {
                paidAmount = 0;
                dueAmount = totalPriceInCart;
            }

            let val = {
                billNumber: billNumber, // Sequential Global Series
                customerName: customeronecart?.name || 'customer',
                customerId: customeronecart?._id || null,
                customerMobile: customeronecart?.mobile || null,
                totalAmount: totalPriceInCart,
                paidAmount: paidAmount,
                dueAmount: dueAmount,
                createBy: creatorId,
                paymentType: paymentType, // 'cash' or 'online'
                products: cart
            }

            let res = await AxiosService.post('/saleprint/printbill', val)
            if (res.status == 201) {
                return { ...res.data, billNumber }; // Return assigned series for printing
            }
        } catch (error) {
            console.error("Bill generation failed:", error);
            throw error;
        }
    }
    const getCustomer = async () => {
        try {
            let res = await AxiosService.get('/customer/getallcustomer')
            // console.log(res.data)

            if (res.status == 200) {
                dispatch(addAllCustomer(res.data?.customer))
            }
        } catch (error) {
            toast.error('error occurs c')

        }
    }


    return { billLoading, getCustomer, createBill }
}

export default genrateBill