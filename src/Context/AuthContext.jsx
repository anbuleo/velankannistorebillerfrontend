import React, { useEffect, useState } from 'react'
import OfflineSyncManager from '../components/OfflineSyncManager'
import { UserDataContext } from './UserDataContext'

function AuthContext({ children }) {
  const [data, setData] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Initial Load
    const user = localStorage.getItem('data')
    if (user) setData(JSON.parse(user))

    // Connectivity Listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <UserDataContext.Provider value={{ data, setData, isOnline }}>
      <OfflineSyncManager />
      {children}
    </UserDataContext.Provider>
  )
}

export default AuthContext