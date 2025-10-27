import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import LoadingSpinner from './LoadingSpinner'
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react'

interface Application {
    _id: string
    title: string
    type: string
    status: string
    deadline: string
    notes: string
    createdAt: string
}

export default function ApplicationList() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

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

    const deleteApplication = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.delete(`/applications/${id}`)
                setApplications(applications.filter(app => app._id !== id))
            } catch (error) {
                console.error('Failed to delete application:', error)
            }
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

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true
        return app.status.toLowerCase() === filter.toLowerCase()
    })

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                        <p className="mt-2 text-gray-600">Manage all your job applications</p>
                    </div>
                    <Link
                        to="/applications/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center space-x-1"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Application</span>
                    </Link>
                </div>

                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        All ({applications.length})
                    </button>
                    <button
                        onClick={() => setFilter('not started')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'not started'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Not Started ({applications.filter(app => app.status.toLowerCase() === 'not started').length})
                    </button>
                    <button
                        onClick={() => setFilter('in progress')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'in progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        In Progress ({applications.filter(app => app.status.toLowerCase() === 'in progress').length})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Completed ({applications.filter(app => app.status.toLowerCase() === 'completed').length})
                    </button>
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filter === 'all'
                            ? 'Get started by creating your first application.'
                            : `No applications with status "${filter}".`
                        }
                    </p>
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
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredApplications.map((app) => (
                            <li key={app._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-blue-600 truncate">
                                                    {app.title}
                                                </p>
                                                <div className="ml-2 shrink-0 flex">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="truncate">{app.type}</span>
                                                    {app.deadline && (
                                                        <>
                                                            <span className="mx-2">•</span>
                                                            <div className="flex items-center">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                <span className={getUrgencyColor(app.deadline)}>
                                                                    Due {formatDate(app.deadline)}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {app.notes && (
                                                    <p className="mt-1 text-sm text-gray-600 truncate">{app.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 shrink-0 flex space-x-2">
                                            <Link
                                                to={`/applications/${app._id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => deleteApplication(app._id)}
                                                className="text-red-600 hover:text-red-900 p-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
