import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../ui/Button"; // Sesuaikan path jika Button adalah komponen kustom Anda

// Definisikan tipe untuk data pengguna dan data form
type UserFormData = {
  name: string;
  username: string;
  email: string;
  role: "admin" | "guru_bk" | "siswa";
  password?: string;
};

interface UserManagementFormProps {
  onSubmit: SubmitHandler<UserFormData>;
  onCancel: () => void;
  initialData?: Partial<UserFormData>;
  isLoading?: boolean;
}

const UserManagementForm: React.FC<UserManagementFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: initialData || { role: "siswa" },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const commonInputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const errorTextClass = "text-red-500 text-xs mt-1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 bg-white p-6 rounded-lg shadow'
    >
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Nama Lengkap
        </label>
        <input
          id='name'
          type='text'
          className={`${commonInputClass} ${
            errors.name ? "border-red-500" : ""
          }`}
          {...register("name", { required: "Nama lengkap wajib diisi" })}
        />
        {errors.name && <p className={errorTextClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label
          htmlFor='username'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Username
        </label>
        <input
          id='username'
          type='text'
          className={`${commonInputClass} ${
            errors.username ? "border-red-500" : ""
          }`}
          {...register("username", {
            required: "Username wajib diisi",
            minLength: { value: 3, message: "Username minimal 3 karakter" },
          })}
        />
        {errors.username && (
          <p className={errorTextClass}>{errors.username.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Email
        </label>
        <input
          id='email'
          type='email'
          className={`${commonInputClass} ${
            errors.email ? "border-red-500" : ""
          }`}
          {...register("email", {
            required: "Email wajib diisi",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Format email tidak valid",
            },
          })}
        />
        {errors.email && (
          <p className={errorTextClass}>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='role'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Peran Pengguna
        </label>
        <select
          id='role'
          className={`${commonInputClass} ${
            errors.role ? "border-red-500" : ""
          }`}
          {...register("role", { required: "Peran wajib dipilih" })}
        >
          <option value='siswa'>Siswa</option>
          <option value='guru_bk'>Guru BK</option>
          <option value='admin'>Admin</option>
        </select>
        {errors.role && <p className={errorTextClass}>{errors.role.message}</p>}
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          {initialData ? "Password Baru (Opsional)" : "Password"}
        </label>
        <input
          id='password'
          type='password'
          className={`${commonInputClass} ${
            errors.password ? "border-red-500" : ""
          }`}
          placeholder={initialData ? "Kosongkan jika tidak ingin mengubah" : ""}
          {...register("password", {
            required: initialData ? false : "Password wajib diisi",
            minLength: initialData
              ? undefined
              : { value: 8, message: "Password minimal 8 karakter" },
          })}
        />
        {errors.password && (
          <p className={errorTextClass}>{errors.password.message}</p>
        )}
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Batal
        </Button>
        <Button type='submit' variant='primary' isLoading={isLoading}>
          {initialData ? "Simpan Perubahan" : "Tambah Pengguna"}
        </Button>
      </div>
    </form>
  );
};

export default UserManagementForm;
