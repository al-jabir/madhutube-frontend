import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  PlayIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const steps = [
  { id: 1, title: 'Account Info', description: 'Basic details' },
  { id: 2, title: 'Security', description: 'Set password' },
  { id: 3, title: 'Profile', description: 'Upload photos' },
];

const passwordChecks = [
  { key: 'minLength', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number', test: (p) => /\d/.test(p) },
  { key: 'special', label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null,
  });

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, [type]: file });
    const preview = URL.createObjectURL(file);
    if (type === 'avatar') setAvatarPreview(preview);
    else setCoverPreview(preview);
  };

  const canProceedStep1 = formData.fullName.trim() && formData.username.trim() && formData.email.trim();
  const passwordValid = passwordChecks.every((c) => c.test(formData.password));
  const canProceedStep2 = passwordValid;
  const canSubmit = canProceedStep1 && canProceedStep2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    clearError();
    const result = await register(formData);
    if (result.success) navigate('/');
    setIsLoading(false);
  };

  const nextStep = () => {
    if (step === 1 && canProceedStep1) setStep(2);
    else if (step === 2 && canProceedStep2) setStep(3);
  };
  const prevStep = () => setStep((s) => s - 1);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              step > s.id
                ? 'bg-youtube-red text-white'
                : step === s.id
                  ? 'bg-youtube-red text-white ring-4 ring-red-100 dark:ring-red-900/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {step > s.id ? <CheckIcon className="h-5 w-5" /> : s.id}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${
              step >= s.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            }`}>
              {s.title}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 mt-[-18px] rounded transition-all duration-300 ${
              step > s.id ? 'bg-youtube-red' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-youtube-dark">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-youtube-red via-red-600 to-red-700">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white opacity-5 rounded-full" />
          <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-white opacity-5 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <PlayIcon className="h-8 w-8 text-youtube-red fill-youtube-red" />
            </div>
            <span className="text-4xl font-bold text-white tracking-tight">MadhuTube</span>
          </div>

          <h1 className="text-3xl font-bold text-white text-center leading-tight mb-4">
            Join the Community
          </h1>
          <p className="text-lg text-red-100 text-center max-w-md leading-relaxed">
            Create your account and start exploring millions of videos from creators around the globe.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-sm">
            {[
              { value: '10M+', label: 'Videos' },
              { value: '50M+', label: 'Users' },
              { value: '100K+', label: 'Creators' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-red-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-youtube-red rounded-xl flex items-center justify-center">
              <PlayIcon className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">MadhuTube</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create account</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Step {step} of 3 — {steps[step - 1].description}
            </p>
          </div>

          {renderStepIndicator()}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Account Info */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="fullName"
                      type="text"
                      required
                      className="auth-input"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                    <input
                      name="username"
                      type="text"
                      required
                      className="auth-input pl-10"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="auth-input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="auth-input pr-12"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {passwordChecks.map((c, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            c.test(formData.password)
                              ? i < 2 ? 'bg-red-500' : i < 4 ? 'bg-yellow-500' : 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      {passwordChecks.map((c) => (
                        <div key={c.key} className="flex items-center space-x-2 text-xs">
                          {c.test(formData.password) ? (
                            <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                          )}
                          <span className={
                            c.test(formData.password)
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }>
                            {c.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Profile */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Profile Picture</label>
                  <div className="flex items-center space-x-5">
                    <div
                      onClick={() => avatarInputRef.current?.click()}
                      className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-3 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-youtube-red transition-all group"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <CameraIcon className="h-6 w-6 text-gray-400 group-hover:text-youtube-red transition-colors" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'avatar')}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-sm font-medium text-youtube-red hover:text-red-700 transition-colors"
                      >
                        Upload photo
                      </button>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG. Max 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cover Photo</label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-youtube-red transition-all group"
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <CameraIcon className="h-8 w-8 text-gray-400 group-hover:text-youtube-red transition-colors" />
                        <p className="text-sm text-gray-400 mt-2">Click to upload cover photo</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'coverImage')}
                  />
                  <p className="text-xs text-gray-400 mt-2">Optional. Recommended: 1200×300</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2)
                  }
                  className="auth-btn-primary flex-1 group flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !canSubmit}
                  className="auth-btn-primary flex-1 group flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="auth-spinner" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <CheckIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign in link */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-youtube-red hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
