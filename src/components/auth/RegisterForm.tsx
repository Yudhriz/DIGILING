import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuthStore } from '../../store/authStore';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'siswa' | 'guru_bk' | 'admin';
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'siswa'
    }
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });
      
      // Registration successful, redirect to login
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' } 
      });
    } catch (err) {
      // Error is already handled in the store
      console.error('Registration failed:', err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <Input
          label="Full Name"
          leftIcon={<User className="h-5 w-5 text-gray-400" />}
          error={errors.name?.message}
          {...register('name', { 
            required: 'Full name is required' 
          })}
        />
      </div>
      
      <div>
        <Input
          label="Email"
          type="email"
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
      </div>
      
      <div>
        <Input
          label="Password"
          type="password"
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.password?.message}
          helperText="Password must be at least 8 characters"
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />
      </div>
      
      <div>
        <Input
          label="Confirm Password"
          type="password"
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => 
              value === password || 'Passwords do not match'
          })}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Register as
        </label>
        <div className="mt-1 flex flex-col sm:flex-row gap-3">
          <label className="relative flex cursor-pointer items-center rounded-full p-3 border border-gray-200">
            <input
              type="radio"
              value="siswa"
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('role')}
            />
            <span className="ml-2 text-sm">Student</span>
          </label>
          
          <label className="relative flex cursor-pointer items-center rounded-full p-3 border border-gray-200">
            <input
              type="radio" 
              value="guru_bk"
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('role')}
            />
            <span className="ml-2 text-sm">Counselor</span>
          </label>
          
          <label className="relative flex cursor-pointer items-center rounded-full p-3 border border-gray-200">
            <input
              type="radio" 
              value="admin"
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('role')}
            />
            <span className="ml-2 text-sm">Administrator</span>
          </label>
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
          rightIcon={<UserPlus className="h-5 w-5" />}
        >
          Create Account
        </Button>
      </div>
      
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account?</span>{' '}
        <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;