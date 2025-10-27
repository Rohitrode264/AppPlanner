import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, LogOut, User } from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Calendar className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">AppPlanner</span>
                        </Link>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/applications"
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Applications
                            </Link>
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-600 p-1"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
