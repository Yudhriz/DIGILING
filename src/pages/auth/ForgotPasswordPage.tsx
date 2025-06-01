import React from "react";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Forgot Password</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Masukkan email yang terdaftar dan kami akan mengirimkan OTP ke gmail kamu untuk
            mereset password kamu.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
