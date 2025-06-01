import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus } from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthStore } from "../../store/authStore";

import { renderErrorMessage } from "../../utils/renderError";

interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {error && (
        <div className='p-3 bg-error-50 border border-error-200 text-error-700 rounded-md'>
          {renderErrorMessage(error)}
        </div>
      )}

      <div>
        <Input
          label='Full Name'
          placeholder='Masukkan nama lengkap kamu'
          leftIcon={<User className='h-5 w-5 text-gray-400' />}
          error={errors.name?.message}
          {...register("name", {
            required: "Full name is required",
          })}
        />
      </div>

      <div>
        <Input
          label='Username'
          placeholder='Masukkan username kamu'
          leftIcon={<User className='h-5 w-5 text-gray-400' />}
          error={errors.username?.message}
          {...register("username", {
            required: "Username is required",
          })}
        />
      </div>

      <div>
        <Input
          label='Email'
          placeholder='Masukkan email kamu'
          type='email'
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
      </div>

      <div>
        <Input
          label='Password'
          placeholder='Masukkan password kamu'
          type='password'
          leftIcon={<Lock className='h-5 w-5 text-gray-400' />}
          error={errors.password?.message}
          helperText='Password must be at least 8 characters'
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
      </div>

      <div>
        <Button
          type='submit'
          variant='primary'
          size='lg'
          isLoading={isLoading}
          className='w-full'
          rightIcon={<UserPlus className='h-5 w-5' />}
        >
          Create Account
        </Button>
      </div>

      <div className='text-center text-sm'>
        <span className='text-gray-600'>Already have an account?</span>{" "}
        <Link
          to='/login'
          className='font-medium text-primary-600 hover:text-primary-500'
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
