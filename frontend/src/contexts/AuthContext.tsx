import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../services/api'
import { useNotification } from './NotificationContext'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const { addNotification } = useNotification()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            api.defaults.headers.common['Authorization'] = token
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/me')
            setUser(response.data)
        } catch (error) {
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        const response = await api.post('/users/login', { email, password })
        const { token, user } = response.data

        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = token
        setUser(user)
        addNotification({ type: 'success', message: 'Successfully logged in!' })
    }

    const register = async (name: string, email: string, password: string) => {
        await api.post('/users/register', { name, email, password })
        addNotification({ type: 'success', message: 'Account created successfully! Please log in.' })
    }

    const logout = () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
        addNotification({ type: 'info', message: 'Successfully logged out!' })
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
