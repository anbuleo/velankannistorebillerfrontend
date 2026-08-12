import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeQueuedBill } from '../common/OfflineSlice';
import { updateBillInRedux } from '../common/SaleCart';
import AxiosService from '../common/Axioservice';
import { toast } from 'react-toastify';
import { MdCloudSync, MdSync, MdCheckCircle, MdCloudOff } from 'react-icons/md';

/**
 * Enterprise Background Sync Engine
 * Reconciles local-only offline transactions to the cloud without blocking UI.
 */
function OfflineSyncManager() {
    const dispatch = useDispatch();
    const { pendingBills = [] } = useSelector(state => state.offline || {});
    const [isSyncing, setIsSyncing] = useState(false);
    const syncLockRef = useRef(false);

    const syncPendingBills = useCallback(async () => {
        if (pendingBills.length === 0 || !navigator.onLine || syncLockRef.current) return;

        syncLockRef.current = true;
        setIsSyncing(true);

        let successCount = 0;

        for (const bill of [...pendingBills]) {
            try {
                const res = await AxiosService.post('/saleprint/printbill', bill);
                if (res.status === 201 || res.status === 200 || res.data?.isDuplicatePrevented) {
                    const serverBill = res.data?.bill || res.data;
                    if (serverBill && serverBill._id) {
                        dispatch(updateBillInRedux(serverBill));
                    }
                    dispatch(removeQueuedBill(bill.billNumber));
                    if (bill.idempotencyKey) {
                        dispatch(removeQueuedBill(bill.idempotencyKey));
                    }
                    successCount++;
                }
            } catch (e) {
                console.error(`Sync error for ${bill.billNumber}:`, e.response?.data?.message || e.message);
                if (e.response?.status === 409 || e.response?.status === 400) {
                    // Already processed or invalid format - remove to prevent infinite queueing
                    dispatch(removeQueuedBill(bill.billNumber));
                    if (bill.idempotencyKey) {
                        dispatch(removeQueuedBill(bill.idempotencyKey));
                    }
                }
            }
        }

        if (successCount > 0) {
            toast.success(`Cloud Sync Complete: ${successCount} Offline Bill(s) Synced!`, {
                position: 'bottom-left'
            });
        }

        setIsSyncing(false);
        syncLockRef.current = false;
    }, [pendingBills, dispatch]);

    useEffect(() => {
        const handleOnline = () => {
            syncPendingBills();
        };

        window.addEventListener('online', handleOnline);

        // Auto trigger sync if online and items pending
        if (navigator.onLine && pendingBills.length > 0) {
            syncPendingBills();
        }

        const interval = setInterval(() => {
            if (navigator.onLine && pendingBills.length > 0) {
                syncPendingBills();
            }
        }, 30000); // 30s background sync poll

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', handleOnline);
        };
    }, [pendingBills.length, syncPendingBills]);

    if (pendingBills.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-8 z-[100] group">
            <div className={`relative flex items-center justify-between gap-3 bg-surface-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 transition-all duration-500 ${
                isSyncing ? 'border-primary animate-pulse w-64' : 'border-surface-700 w-56'
            }`}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <MdCloudSync className={`text-2xl ${isSyncing ? 'animate-spin text-primary' : 'text-amber-400'}`} />
                        <span className="absolute -top-2 -right-2 bg-error text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface-900">
                            {pendingBills.length}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                            {isSyncing ? 'Syncing to Cloud...' : 'Offline Buffer'}
                        </span>
                        <span className="text-[8px] font-bold text-surface-400 mt-1 uppercase">
                            {isSyncing ? 'DO NOT CLOSE APP' : `${pendingBills.length} Bills Queued`}
                        </span>
                    </div>
                </div>

                <button
                    disabled={isSyncing || !navigator.onLine}
                    onClick={() => syncPendingBills()}
                    className="p-1.5 rounded-xl bg-primary/20 hover:bg-primary text-white text-xs font-black transition-all border border-primary/30 flex items-center gap-1 active:scale-95 disabled:opacity-50"
                    title="Force Manual Cloud Sync"
                >
                    <MdSync className={`text-base ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
}

export default OfflineSyncManager;
