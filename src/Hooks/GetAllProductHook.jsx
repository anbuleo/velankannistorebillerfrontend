import React, { useState, useCallback, useRef } from 'react'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import { addAllProduct } from '../common/ProductSlice'
import { addAllBills } from '../common/SaleCart'
import { useDispatch } from 'react-redux'
import { addAllCustomer } from '../common/CustomerSlice'
import { addAllBalanceSheet } from '../common/balanceSheet'

/**
 * GetAllProductHook: Senior-level Data Sync Engine
 * Optimizes API usage with targeted fetching and memoized callbacks.
 */
function GetAllProductHook() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const lastFetch = useRef(0)

    const getUSer = useCallback(async (target = 'all') => {
        // Prevent rapid-fire fetching (30s throttle)
        const now = Date.now()
        if (now - lastFetch.current < 30000 && target === 'all') {
            console.log('Skipping redundant sync - data is fresh')
            return
        }

        setLoading(true)
        try {
            const fetchers = []

            if (target === 'all' || target === 'products') fetchers.push(AxiosService.get('/product/getallproducts'))
            if (target === 'all' || target === 'bills') fetchers.push(AxiosService.get('/saleprint/getallbill'))
            if (target === 'all' || target === 'customers') fetchers.push(AxiosService.get('/customer/getallcustomer'))
            if (target === 'all' || target === 'balancesheet') fetchers.push(AxiosService.get('/saleprint/getallbalancesheet'))

            const results = await Promise.all(fetchers)

            results.forEach(res => {
                if (res.status === 200) {
                    const url = res.config.url
                    if (url.includes('products')) dispatch(addAllProduct(res.data.product))
                    if (url.includes('getallbill')) dispatch(addAllBills(res.data.bill))
                    if (url.includes('customer')) dispatch(addAllCustomer(res.data.customer || []))
                    if (url.includes('balancesheet')) dispatch(addAllBalanceSheet(res.data.balanceSheet))
                }
            })

            if (target === 'all') lastFetch.current = now

        } catch (error) {
            console.error('API Error:', error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }, [dispatch])

    return { getUSer, loading }
}

export default GetAllProductHook