import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../ui/Button"; // Sesuaikan path jika perlu

// Contoh tipe data untuk form ini
type GuruBKStudentFormData = {
  // Nama tipe data juga disesuaikan
  note: string;
  studentId: string;
};

interface GuruBKStudentFormProps {
  // Nama interface disesuaikan
  studentName: string;
  studentId: string;
  onSubmit: SubmitHandler<GuruBKStudentFormData>; // Menggunakan tipe data baru
  onCancel: () => void;
  isLoading?: boolean;
}

const GuruBKStudentForm: React.FC<GuruBKStudentFormProps> = ({
  // Nama komponen disesuaikan
  studentName,
  studentId,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuruBKStudentFormData>({
    // Menggunakan tipe data baru
    defaultValues: { studentId: studentId, note: "" },
  });

  const commonTextareaClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[80px]";
  const errorTextClass = "text-red-500 text-xs mt-1";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 bg-white p-6 rounded-lg shadow'
    >
      <h3 className='text-lg font-medium'>Catatan untuk {studentName}</h3>
      <div>
        <label htmlFor='note' className={labelClass}>
          Catatan Tambahan
        </label>
        <textarea
          id='note'
          className={`${commonTextareaClass} ${
            errors.note ? "border-red-500" : ""
          }`}
          {...register("note", { required: "Catatan tidak boleh kosong" })}
        />
        {errors.note && <p className={errorTextClass}>{errors.note.message}</p>}
      </div>
      <input type='hidden' {...register("studentId")} />

      <div className='flex justify-end space-x-3 pt-4'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type='submit'
          variant='primary'
          isLoading={isLoading}
          disabled={isLoading}
        >
          Simpan Catatan
        </Button>
      </div>
    </form>
  );
};

export default GuruBKStudentForm; // Export dengan nama baru
