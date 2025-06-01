import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { renderErrorMessage } from "../../utils/renderError";
import { useAuthStore } from "../../store/authStore";

interface ResetFormData {
  email: string;
  otp: string;
  new_password: string;
  new_password_confirmation: string;
}

const ResetPasswordForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error } = useAuthStore();
  const defaultEmail = location.state?.email ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetFormData>({
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      await resetPassword(data); // Harus sesuai key: email, otp, new_password, new_password_confirmation
      navigate("/login");
    } catch (err) {
      console.error("Reset error:", err);
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
        {...register("email", { required: "Email wajib diisi" })}
      />

      <Input
        label='Kode OTP'
        type='text'
        placeholder='Masukkan kode OTP'
        leftIcon={<ShieldCheck className='h-5 w-5 text-gray-400' />}
        error={errors.otp?.message}
        {...register("otp", { required: "OTP wajib diisi" })}
      />

      <Input
        label='Password Baru'
        type='password'
        placeholder='Password baru'
        leftIcon={<KeyRound className='h-5 w-5 text-gray-400' />}
        error={errors.new_password?.message}
        {...register("new_password", {
          required: "Password wajib diisi",
          minLength: {
            value: 8,
            message: "Minimal 8 karakter",
          },
        })}
      />

      <Input
        label='Konfirmasi Password'
        type='password'
        placeholder='Ulangi password baru'
        leftIcon={<KeyRound className='h-5 w-5 text-gray-400' />}
        error={errors.new_password_confirmation?.message}
        {...register("new_password_confirmation", {
          required: "Konfirmasi password wajib diisi",
          validate: (value) =>
            value === watch("new_password") || "Password tidak cocok",
        })}
      />

      <Button
        type='submit'
        variant='primary'
        size='lg'
        isLoading={isLoading}
        className='w-full'
      >
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
