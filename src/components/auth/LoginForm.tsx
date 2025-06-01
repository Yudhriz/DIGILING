import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn } from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthStore } from "../../store/authStore";

import { renderErrorMessage } from "../../utils/renderError";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
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
          label='Username'
          type='text'
          placeholder='Masukkan username kamu'
          leftIcon={<User className='h-5 w-5 text-gray-400' />}
          error={errors.username?.message}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          })}
        />
      </div>

      <div>
        <Input
          label='Password'
          type='password'
          placeholder='Masukkan password kamu'
          leftIcon={<Lock className='h-5 w-5 text-gray-400' />}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            name='remember-me'
            type='checkbox'
            className='h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
          />
          <label
            htmlFor='remember-me'
            className='ml-2 block text-sm text-gray-700'
          >
            Remember me
          </label>
        </div>

        <div className='text-sm'>
          <a
            href='/forgot-password'
            className='font-medium text-primary-600 hover:text-primary-500'
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <Button
          type='submit'
          variant='primary'
          size='lg'
          isLoading={isLoading}
          className='w-full'
          rightIcon={<LogIn className='h-5 w-5' />}
        >
          Sign in
        </Button>
      </div>

      <div className='text-center text-sm'>
        <span className='text-gray-600'>Don't have an account?</span>{" "}
        <Link
          to='/register'
          className='font-medium text-primary-600 hover:text-primary-500'
        >
          Register
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
