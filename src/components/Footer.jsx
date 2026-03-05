import React from 'react'
import { MdChat, MdSupportAgent, MdFavorite } from 'react-icons/md'

function Footer() {
  return (
    <footer className="mt-16 py-12 bg-white/50 border-t border-surface-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <span className="text-lg font-bold">V</span>
              </div>
              <span className="text-lg font-display font-bold tracking-tight">
                Velankanni <span className="text-primary">Biller</span>
              </span>
            </div>
            <p className="text-surface-500 text-sm max-w-xs mb-6">
              Empowering local enterprise with modern digital billing solutions. Premium, fast and reliable inventory management.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-surface-900 mb-6 uppercase text-[10px] tracking-widest">Connect</h4>
            <div className="space-y-4">
              <button className="flex items-center gap-2 text-surface-500 hover:text-primary transition-colors text-sm font-medium">
                <MdChat className="text-lg" /> Technical Support
              </button>
              <button className="flex items-center gap-2 text-surface-500 hover:text-primary transition-colors text-sm font-medium">
                <MdSupportAgent className="text-lg" /> Contact Admin
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-surface-900 mb-6 uppercase text-[10px] tracking-widest">About</h4>
            <p className="text-surface-400 text-sm italic font-medium flex items-center gap-2">
              Crafted with <MdFavorite className="text-error" /> for local businesses in Tamil Nadu.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-surface-400 tracking-widest uppercase">
            © 2024 Velankanni Store Biller. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-surface-400 tracking-widest uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Licensing</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer