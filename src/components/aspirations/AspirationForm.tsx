import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../ui/Button";
import type { AspirationFormData } from "../../services/aspirationService";

interface AspirationFormProps {
  onSubmit: SubmitHandler<AspirationFormData>;
  isLoading?: boolean;
}

const AspirationForm: React.FC<AspirationFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AspirationFormData>({
    defaultValues: { is_anonymous: false },
  });

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorTextClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor='content' className={labelClass}>
          Tuliskan Aspirasi atau Masukan Anda
        </label>
        <textarea
          id='content'
          rows={5}
          className='w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500'
          placeholder='Tuliskan aspirasi, kritik, atau saran Anda di sini...'
          {...register("content", { required: "Aspirasi tidak boleh kosong." })}
        />
        {errors.content && (
          <p className={errorTextClass}>{errors.content.message}</p>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <input
          id='is_anonymous'
          type='checkbox'
          className='h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
          {...register("is_anonymous")}
        />
        <label htmlFor='is_anonymous' className='text-sm text-gray-700'>
          Kirim sebagai Anonim (identitas Anda akan disembunyikan)
        </label>
      </div>
      <div className='flex justify-end'>
        <Button type='submit' isLoading={isLoading}>
          Kirim Aspirasi
        </Button>
      </div>
    </form>
  );
};

export default AspirationForm;
