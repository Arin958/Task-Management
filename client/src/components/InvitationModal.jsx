import React, { useState } from "react";
import {
  FiCopy,
  FiShare2,
  FiX,
  FiClock,
  FiShield,
  FiMessageSquare,
  FiMail
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { generateInvitationLink } from "../store/slices/invitation";

const InvitationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const { loading, error, success, invitation } = useSelector((state) => state.invitation);
  const [formData, setFormData] = useState({
    role: "employee",
    expiresIn: 7
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = () => {
    // Assuming companyId is available in your state
    const companyId = user.companyId; // You'll need to get this from your state
    dispatch(generateInvitationLink({ ...formData, companyId }));
  };

  const copyToClipboard = () => {
    if (invitation?.invitationLink) {
      navigator.clipboard.writeText(invitation.invitationLink);
      // You might want to add a toast notification here
    }
  };

  const shareViaWhatsApp = () => {
    if (invitation?.invitationLink) {
      const message = `You've been invited to join our team! Use this link: ${invitation.invitationLink}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const shareViaEmail = () => {
    if (invitation?.invitationLink) {
      const subject = "Invitation to join our team";
      const body = `You've been invited to join our team! Use this link: ${invitation.invitationLink}`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const shareViaSMS = () => {
    if (invitation?.invitationLink) {
      const message = `You've been invited to join our team! Use this link: ${invitation.invitationLink}`;
      window.open(`sms:?body=${encodeURIComponent(message)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Generate Invitation Link
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {!success ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expires in (days)
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="expiresIn"
                      value={formData.expiresIn}
                      onChange={handleChange}
                      min="1"
                      max="30"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                  {error.message || "Failed to generate invitation"}
                </div>
              )}
            </>
          ) : (
            /* Success State */
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Invitation link generated successfully!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invitation Link
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={invitation.invitationLink}
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-l-lg truncate"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-r-lg"
                  >
                    <FiCopy className="text-lg" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FiClock className="text-gray-400" />
                  Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <FiShield className="text-gray-400" />
                  Role: {invitation.role}
                </p>
              </div>

              <div className="pt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Share via:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={shareViaWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white py-2.5 px-4 rounded-lg"
                  >
                    <FiMessageSquare className="text-lg" />
                    WhatsApp
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2.5 px-4 rounded-lg"
                  >
                    <FiMail className="text-lg" />
                    Email
                  </button>
                  <button
                    onClick={shareViaSMS}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white py-2.5 px-4 rounded-lg"
                  >
                    <FiShare2 className="text-lg" />
                    SMS
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {!success ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Link"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;