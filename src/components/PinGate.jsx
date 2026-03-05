import React, { useState, useRef, useEffect } from 'react'
import { MdLock, MdLockOpen, MdBackspace, MdVisibility, MdVisibilityOff } from 'react-icons/md'

const DEFAULT_PIN = '9095'

function PinGate({ children, label = 'Financial Data' }) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [pin, setPin] = useState('')
    const [error, setError] = useState(false)
    const [shake, setShake] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [autoLockTimer, setAutoLockTimer] = useState(null)

    // Auto-lock after 2 minutes of inactivity
    const resetAutoLock = () => {
        if (autoLockTimer) clearTimeout(autoLockTimer)
        const timer = setTimeout(() => {
            setIsUnlocked(false)
            setShowModal(false)
        }, 2 * 60 * 1000)
        setAutoLockTimer(timer)
    }

    useEffect(() => {
        return () => { if (autoLockTimer) clearTimeout(autoLockTimer) }
    }, [autoLockTimer])

    const handleDigit = (digit) => {
        if (pin.length >= 4) return
        const newPin = pin + digit
        setPin(newPin)
        setError(false)

        if (newPin.length === 4) {
            setTimeout(() => {
                if (newPin === DEFAULT_PIN) {
                    setIsUnlocked(true)
                    setShowModal(false)
                    setPin('')
                    resetAutoLock()
                } else {
                    setShake(true)
                    setError(true)
                    setTimeout(() => { setPin(''); setShake(false) }, 600)
                }
            }, 150)
        }
    }

    const handleBackspace = () => {
        setPin(p => p.slice(0, -1))
        setError(false)
    }

    const handleLock = () => {
        setIsUnlocked(false)
        setShowModal(false)
        setPin('')
        if (autoLockTimer) clearTimeout(autoLockTimer)
    }

    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']

    if (isUnlocked) {
        return (
            <div className="relative group">
                {children}
                <button
                    onClick={handleLock}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-surface-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Lock profit data"
                >
                    <MdLock className="text-sm" />
                </button>
            </div>
        )
    }

    return (
        <>
            {/* Blurred / locked overlay */}
            <div
                className="relative cursor-pointer group"
                onClick={() => setShowModal(true)}
            >
                <div className="blur-[6px] pointer-events-none select-none">
                    {children}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-surface-300 z-10 transition-all group-hover:border-primary/40">
                    <div className="w-12 h-12 bg-surface-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-2 shadow-xl group-hover:scale-110 transition-transform">
                        <MdLock />
                    </div>
                    <p className="text-[10px] font-black text-surface-600 uppercase tracking-widest">{label}</p>
                    <p className="text-[9px] text-surface-400 font-bold mt-1">Click to unlock</p>
                </div>
            </div>

            {/* PIN Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-surface-900/70 backdrop-blur-md">
                    <div
                        className={`glass-card w-80 p-8 shadow-2xl border-none text-center relative overflow-hidden ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
                        style={shake ? { animation: 'shake 0.4s ease-in-out' } : {}}
                    >
                        {/* Close */}
                        <button
                            onClick={() => { setShowModal(false); setPin('') }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-100 text-surface-400 hover:bg-surface-200 flex items-center justify-center text-sm font-bold"
                        >✕</button>

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-surface-900 text-white flex items-center justify-center text-3xl mx-auto mb-5 shadow-xl">
                            <MdLock />
                        </div>

                        <h3 className="text-xl font-display font-bold text-surface-900 mb-1">Enter PIN</h3>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-6">
                            {label} • Protected
                        </p>

                        {/* PIN dots */}
                        <div className={`flex justify-center gap-4 mb-6 ${error ? 'text-error' : ''}`}>
                            {[0, 1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${pin.length > i
                                            ? error ? 'bg-error border-error scale-110' : 'bg-surface-900 border-surface-900 scale-110'
                                            : 'bg-transparent border-surface-300'
                                        }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-[10px] text-error font-black uppercase tracking-widest mb-4 animate-pulse">
                                Incorrect PIN
                            </p>
                        )}

                        {/* Keypad */}
                        <div className="grid grid-cols-3 gap-3">
                            {digits.map((d, i) => {
                                if (d === null) return <div key={i} />
                                if (d === 'del') return (
                                    <button
                                        key={i}
                                        onClick={handleBackspace}
                                        className="h-14 rounded-2xl bg-surface-100 text-surface-500 flex items-center justify-center text-xl hover:bg-surface-200 active:scale-95 transition-all"
                                    >
                                        <MdBackspace />
                                    </button>
                                )
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDigit(String(d))}
                                        className="h-14 rounded-2xl bg-surface-50 text-surface-900 font-bold text-xl hover:bg-primary hover:text-white active:scale-95 transition-all shadow-sm border border-surface-100"
                                    >
                                        {d}
                                    </button>
                                )
                            })}
                        </div>

                        <p className="text-[9px] text-surface-300 font-bold uppercase tracking-widest mt-6">
                            Auto-locks after 2 minutes
                        </p>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
        </>
    )
}

export default PinGate
