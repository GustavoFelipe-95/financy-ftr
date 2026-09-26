import React, { useState, useCallback, useContext } from 'react'
import type { AuthContextType, UserType } from '@/types'
import { getToken, getUser, saveToken, saveUser, clearToken, clearUser } from '@/storage/auth'

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => getToken())
    const [user, setUser] = useState<UserType | null>(() => getUser())

    const loginSystem = useCallback((newToken: string, newUser: UserType) => {
        setToken(newToken)
        saveToken(newToken)
        setUser(newUser)
        saveUser(newUser)
    }, [])

    const logoutSystem = useCallback(() => {
        setToken(null)
        clearToken()
        setUser(null)
        clearUser()
    }, [])

    const updateUserSystem = useCallback((updateUser: Pick<UserType, 'name'>) => {
        setUser((prevUser) => {
            if (!prevUser) return prevUser
            const updatedUser = { ...prevUser, ...updateUser }
            saveUser(updatedUser)
            return updatedUser
        })
    }, [])

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token,
        login: loginSystem,
        logout: logoutSystem,
        updateUser: updateUserSystem,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthenticated() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthenticated must be used within an AuthProvider')
    }
    return context;
}