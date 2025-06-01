import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { renderErrorMessage } from "../../utils/renderError";
import { useAuthStore } from "../../store/authStore";

interface ForgotFormData {
  email: string;
}

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, error, forgotPassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>();

  const onSubmit = async (data: ForgotFormData) => {
    try {
      await forgotPassword(data.email); // Kirim request ke backend
      navigate("/reset-password", {
        state: { email: data.email }, // Teruskan email ke halaman reset
      });
    } catch (err) {
      console.error("OTP sending failed:", err);
      // Error ditangani lewat `useAuthStore().error`
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {error && (
        <div className='p-3 bg-error-50 border border-error-200 text-error-700 rounded-md'>
          {renderErrorMessage(error)}
        </div>
      )}

      <Input
        label='Email'
        type='email'
        placeholder='Masukkan email kamu'
        leftIcon={<Mail className='h-5 w-5 text-gray-400' />}
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
      />

      <Button
        type='submit'
        variant='primary'
        size='lg'
        isLoading={isLoading}
        className='w-full'
      >
        Kirim OTP
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
