import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeQueuedBill } from '../common/OfflineSlice';
import AxiosService from '../common/Axioservice';
import { toast } from 'react-toastify';
import { MdCloudSync } from 'react-icons/md';

/**
 * OfflineSyncManager: Background Sync Engine
 * Automatically reconciles local-only transactions once connection is stable.
 */
function OfflineSyncManager() {
    const dispatch = useDispatch();
    const { pendingBills = [] } = useSelector(state => state.offline || {});
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        let isProcessing = false;

        const syncData = async () => {
            if (pendingBills.length === 0 || !navigator.onLine || isSyncing || isProcessing) return;

            isProcessing = true;
            setIsSyncing(true);

            // Sequential processing to preserve order and avoid server stress
            for (const bill of [...pendingBills]) {
                try {
                    const res = await AxiosService.post('/saleprint/printbill', bill);
                    if (res.status === 201 || res.status === 200) {
                        dispatch(removeQueuedBill(bill.billNumber));
                    }
                } catch (e) {
                    console.error(`Sync failed for ${bill.billNumber}:`, e.response?.data?.message || e.message);
                    // Critical items like bills shouldn't stop others unless it's a server-wide error
                }
            }

            setIsSyncing(false);
            isProcessing = false;
        };

        // Aggressive sync on reconnect, relaxed polling
        const interval = setInterval(syncData, 60000);
        window.addEventListener('online', syncData);

        // Initial attempt
        syncData();

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', syncData);
        };
    }, [pendingBills.length, isSyncing]); // Depend on length to trigger on new bill

    if (pendingBills.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-8 z-[100] group">
            <div className={`relative flex items-center gap-4 bg-surface-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 transition-all duration-500 ${isSyncing ? 'border-primary animate-pulse w-56' : 'border-surface-700 w-48'}`}>
                <div className="relative">
                    <MdCloudSync className={`text-2xl ${isSyncing ? 'animate-spin text-primary' : 'text-surface-400'}`} />
                    {pendingBills.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-error text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface-900">
                            {pendingBills.length}
                        </span>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                        {isSyncing ? 'Syncing Sales...' : 'Offline Buffer'}
                    </span>
                    <span className="text-[8px] font-bold text-surface-400 mt-1 uppercase">
                        {isSyncing ? 'DO NOT CLOSE APP' : 'Waiting for connection'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default OfflineSyncManager;
