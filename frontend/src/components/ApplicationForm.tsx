import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { ArrowLeft } from 'lucide-react'

interface ApplicationData {
    title: string
    type: string
    status: string
    deadline: string
    notes: string
}

export default function ApplicationForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState<ApplicationData>({
        title: '',
        type: '',
        status: 'Not Started',
        deadline: '',
        notes: ''
    })

    useEffect(() => {
        if (id) {
            fetchApplication()
        }
    }, [id])

    const fetchApplication = async () => {
        try {
            const response = await api.get(`/applications/${id}`)
            const app = response.data
            setFormData({
                title: app.title || '',
                type: app.type || '',
                status: app.status || 'Not Started',
                deadline: app.deadline ? new Date(app.deadline).toISOString().split('T')[0] : '',
                notes: app.notes || ''
            })
        } catch (error) {
            console.error('Failed to fetch application:', error)
            setError('Failed to load application')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = {
                ...formData,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
            }

            if (id) {
                await api.put(`/applications/${id}`, data)
            } else {
                await api.post('/applications', data)
            }

            navigate('/applications')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save application')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/applications')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Applications
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {id ? 'Edit Application' : 'Add New Application'}
                </h1>
                <p className="mt-2 text-gray-600">
                    {id ? 'Update your application details' : 'Track your job application progress'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Company/Type
                            </label>
                            <input
                                type="text"
                                name="type"
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g. Google, Startup, Government"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                                Deadline
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                id="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                id="notes"
                                rows={4}
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Add any additional notes about this application..."
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="text-sm text-red-600">{error}</div>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/applications')}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (id ? 'Update Application' : 'Create Application')}
                    </button>
                </div>
            </form>
        </div>
    )
}
