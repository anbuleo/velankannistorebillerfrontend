import React from 'react'
import { MdAccessTime, MdSecurity, MdHeadsetMic } from 'react-icons/md'

function Pending({ data }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-card max-w-lg w-full p-8 text-center fade-in">
        <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MdAccessTime className="text-4xl text-warning animate-pulse" />
        </div>

        <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
          Registration Pending
        </h1>
        <p className="text-surface-600 mb-8 leading-relaxed">
          Welcome <span className="text-primary font-bold uppercase">{data?.userName}</span>!
          Your request for <span className="font-semibold text-surface-900">{data?.role}</span> access is being reviewed by our administration team.
        </p>

        <div className="space-y-4 mb-10">
          <div className="flex items-start gap-4 p-4 bg-surface-50 rounded-xl text-left">
            <MdSecurity className="text-2xl text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-surface-900">Security Check</h3>
              <p className="text-sm text-surface-500">We verify all new staff accounts to ensure store safety.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-surface-50 rounded-xl text-left">
            <MdHeadsetMic className="text-2xl text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-surface-900">Need Help?</h3>
              <p className="text-sm text-surface-500">Contact the store manager if this is taking longer than usual.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="premium-button w-full"
        >
          Check Status
        </button>
      </div>
    </div>
  )
}

export default Pending