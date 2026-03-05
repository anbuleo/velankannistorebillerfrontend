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
        const syncData = async () => {
            if (pendingBills.length === 0 || !navigator.onLine || isSyncing) return;

            setIsSyncing(true);
            toast.info(`Syncing ${pendingBills.length} pending transactions...`, { icon: <MdCloudSync className="animate-spin" /> });

            for (const bill of pendingBills) {
                try {
                    const res = await AxiosService.post('/saleprint/printbill', bill);
                    if (res.status === 201 || res.status === 200) {
                        dispatch(removeQueuedBill(bill.billNumber));
                    }
                } catch (e) {
                    console.error("Delayed sync failed for bill:", bill.billNumber, e);
                    // Keep in queue for next attempt
                }
            }
            setIsSyncing(false);
        };

        // Attempt sync every 30 seconds if online
        const interval = setInterval(syncData, 30000);
        // Also attempt immediately on status change
        window.addEventListener('online', syncData);

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', syncData);
        };
    }, [pendingBills, dispatch]);

    if (pendingBills.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-bounce">
            <div className="bg-surface-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-primary/30">
                <MdCloudSync className={`${isSyncing ? 'animate-spin text-primary' : 'text-primary'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                    {pendingBills.length} Pending Sync
                </span>
            </div>
        </div>
    );
}

export default OfflineSyncManager;
