import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchUserById, updateUserStatus } from '../store/slices/userSlice'
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  
} from "react-icons/fi";
import { Building } from 'lucide-react'

const ProfileDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  
  const { user: currentUser } = useSelector((state) => state.auth)
  const { singleUser, loading } = useSelector((state) => state.user)
  
  const isAdmin = currentUser?.role === 'admin'
  const isOwnProfile = currentUser?._id === id

  useEffect(() => {
    dispatch(fetchUserById(id))
  }, [id, dispatch])

  const handleStatusChange = (isActive) => {
    if (window.confirm(`Are you sure you want to ${isActive ? 'activate' : 'deactivate'} this user?`)) {
      dispatch(updateUserStatus({ userId: id, isActive }))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!singleUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            User not found
          </h3>
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Details</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-6">
                  <FiUser className="text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{singleUser.name}</h2>
                  <p className="text-blue-100 dark:text-blue-200">{singleUser.jobTitle || 'No title specified'}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isAdmin && !isOwnProfile && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(!singleUser.isActive)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        singleUser.isActive 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {singleUser.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg font-medium flex items-center">
                      <FiTrash2 className="mr-2" /> Remove
                    </button>
                  </>
                )}
                {(isOwnProfile || isAdmin) && (
                  <button 
                    onClick={() => navigate(`/profile/${id}/edit`)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium flex items-center backdrop-blur-sm"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Activity
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === 'admin'
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white">{singleUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiBriefcase className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                        <p className="text-gray-900 dark:text-white capitalize">{singleUser.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Building className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Job Title</p>
                        <p className="text-gray-900 dark:text-white">{singleUser.jobTitle || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${singleUser.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                        {singleUser.isActive ? <FiCheckCircle /> : <FiXCircle />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <p className={`font-medium ${singleUser.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {singleUser.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-gray-900 dark:text-white">{formatDate(singleUser.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                        <p className="text-gray-900 dark:text-white">
                          {singleUser.lastLogin ? formatDate(singleUser.lastLogin) : 'Never logged in'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 text-center">
                  <FiClock className="mx-auto text-2xl text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No recent activity to display</p>
                </div>
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Administrative Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left">
                    <FiTrash2 className="inline-block mr-2 text-lg" />
                    Terminate Employment
                  </button>
                  <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors text-left">
                    <FiShield className="inline-block mr-2 text-lg" />
                    Change Permissions
                  </button>
                  <button className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left">
                    <FiBriefcase className="inline-block mr-2 text-lg" />
                    Change Role
                  </button>
                  <button className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left">
                    <FiMail className="inline-block mr-2 text-lg" />
                    Send Notification
                  </button>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Danger Zone</h4>
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300 mb-3">Once you delete a user's account, there is no going back. Please be certain.</p>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">
                      Delete User Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDetail