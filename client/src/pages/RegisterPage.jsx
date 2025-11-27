import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AnimatedTaskChecklist from "../components/Animation/AnimatedTaskChecklist";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { registerUser, companyRegister } from "../store/slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState("employee"); // "employee" or "company"
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");

  useEffect(() => {
    user && navigate("/");
  }, [user, navigate]);

  // Reset form when registration type changes
  useEffect(() => {
    reset();
  }, [registrationType, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (registrationType === "company") {
        // Format data for company registration
        const companyData = {
          companyName: data.companyName,
          industry: data.industry,
          address: data.address,
          adminName: data.name,
          adminEmail: data.email,
          adminPassword: data.password,
          adminJobTitle: data.jobTitle
        };
        await dispatch(companyRegister(companyData)).unwrap();
        toast.success("Company registered successfully!");
        navigate("/login");
      } else {
        // Format data for employee registration
        const userData = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          companyId: data.companyId,
          jobTitle: data.jobTitle
        };
        await dispatch(registerUser(userData)).unwrap();
        toast.success("Registration successful!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Animation Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AnimatedTaskChecklist />
          <h2 className="text-4xl font-bold text-white mt-8 mb-4">
            Join TaskFlow Pro
          </h2>
          <p className="text-indigo-100 text-lg">
            Start your journey to better task management and team collaboration
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join us and streamline your workflow
            </p>
          </div>

          {/* Registration Type Toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                registrationType === "employee"
                  ? "bg-white dark:bg-gray-600 shadow text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              }`}
              onClick={() => setRegistrationType("employee")}
            >
              Join Existing Company
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                registrationType === "company"
                  ? "bg-white dark:bg-gray-600 shadow text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              }`}
              onClick={() => setRegistrationType("company")}
            >
              Register New Company
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Fields (shown only when registering a new company) */}
            {registrationType === "company" && (
              <>
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      {...register("companyName", {
                        required: registrationType === "company" ? "Company name is required" : false,
                      })}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder="Your Company Inc."
                      disabled={isLoading}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Industry
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="industry"
                      type="text"
                      {...register("industry", {
                        required: registrationType === "company" ? "Industry is required" : false,
                      })}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.industry
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder="e.g., Technology, Healthcare"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Company Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="address"
                      type="text"
                      {...register("address", {
                        required: registrationType === "company" ? "Address is required" : false,
                      })}
                      className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                        errors.address
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                      placeholder="123 Main St, City, Country"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Company ID Field (shown only when joining existing company) */}
            {registrationType === "employee" && (
              <div>
                <label
                  htmlFor="companyId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Company ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyId"
                    type="text"
                    {...register("companyId", {
                      required: registrationType === "employee" ? "Company ID is required" : false,
                    })}
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                      errors.companyId
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Your company's unique ID"
                    disabled={isLoading}
                  />
                </div>
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.companyId.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Ask your administrator for the company ID
                </p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Title Field */}
            <div>
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Job Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="jobTitle"
                  type="text"
                  {...register("jobTitle", {
                    required: "Job title is required",
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.jobTitle
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="e.g., Software Developer"
                  disabled={isLoading}
                />
              </div>
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Role Field (hidden for company registration as they become admin) */}
            {registrationType === "employee" && (
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  {...register("role", {
                    required: registrationType === "employee" ? "Role is required" : false,
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.role
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  disabled={isLoading}
                >
                  <option value="">Select your role</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.role.message}
                  </p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {registrationType === "company" ? "Creating company..." : "Creating account..."}
                </span>
              ) : (
                registrationType === "company" ? "Register Company" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;