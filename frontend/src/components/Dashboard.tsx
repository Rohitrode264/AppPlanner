import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import LoadingSpinner from './LoadingSpinner'
import { Plus, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Application {
    _id: string
    title: string
    type: string
    status: string
    deadline: string
    notes: string
    createdAt: string
}

export default function Dashboard() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications')
            setApplications(response.data)
        } catch (error) {
            console.error('Failed to fetch applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'in progress':
                return 'bg-blue-100 text-blue-800'
            case 'not started':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    const getUrgencyColor = (deadline: string) => {
        const now = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return 'text-red-600'
        if (diffDays <= 3) return 'text-orange-600'
        if (diffDays <= 7) return 'text-yellow-600'
        return 'text-gray-600'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const upcomingApplications = applications
        .filter(app => app.deadline && new Date(app.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" text="Loading applications..." />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Track your application progress and deadlines</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
                            <Link
                                to="/applications/new"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center space-x-1"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Application</span>
                            </Link>
                        </div>

                        {upcomingApplications.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating your first application.</p>
                                <div className="mt-6">
                                    <Link
                                        to="/applications/new"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Application
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingApplications.map((app) => (
                                    <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900">{app.title}</h3>
                                                <p className="text-sm text-gray-600">{app.type}</p>
                                                <div className="flex items-center mt-2 space-x-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                    <div className="flex items-center text-sm">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        <span className={getUrgencyColor(app.deadline)}>
                                                            {formatDate(app.deadline)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/applications/${app._id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-600">Completed</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {applications.filter(app => app.status.toLowerCase() === 'completed').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                                    <span className="text-sm text-gray-600">In Progress</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {applications.filter(app => app.status.toLowerCase() === 'in progress').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                                    <span className="text-sm text-gray-600">Not Started</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {applications.filter(app => app.status.toLowerCase() === 'not started').length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link
                                to="/applications/new"
                                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                                Add New Application
                            </Link>
                            <Link
                                to="/applications"
                                className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                            >
                                View All Applications
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
