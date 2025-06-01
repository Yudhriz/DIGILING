import React from "react";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className='max-w-md mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Reset Password</h1>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
