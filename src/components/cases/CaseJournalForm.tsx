import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../ui/Button";
import type { StudentCaseFormData } from "../../services/studentCaseService";
import type { User } from "../../services/userService"; // Impor tipe User

interface CaseJournalFormProps {
  onSubmit: SubmitHandler<StudentCaseFormData>;
  onCancel: () => void;
  initialData?: Partial<StudentCaseFormData>;
  isLoading?: boolean;
  isEditMode: boolean;
  studentList: User[]; // <-- TAMBAHKAN PROP INI
}

const CaseJournalForm: React.FC<CaseJournalFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  isEditMode,
  studentList,
}) => {
  // ... sisa kode form ini tidak perlu diubah ...
  // Ia akan menggunakan prop 'studentList' untuk membuat dropdown.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentCaseFormData>({
    /* ... */
  });

  useEffect(() => {
    reset(initialData || { case_date: new Date().toISOString().split("T")[0] });
  }, [initialData, reset]);

  const commonInputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorTextClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor='student_user_id' className={labelClass}>
          Siswa <span className='text-red-500'>*</span>
        </label>
        <select
          id='student_user_id'
          className={commonInputClass}
          {...register("student_user_id", { required: "Siswa wajib dipilih" })}
          disabled={isEditMode || isLoading} // Nonaktifkan jika mode edit
        >
          <option value=''>Pilih Siswa...</option>
          {studentList.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.username})
            </option>
          ))}
        </select>
        {errors.student_user_id && (
          <p className={errorTextClass}>{errors.student_user_id.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor='case_date' className={labelClass}>
          Tanggal Kasus <span className='text-red-500'>*</span>
        </label>
        <input
          id='case_date'
          type='date'
          className={commonInputClass}
          {...register("case_date", { required: "Tanggal wajib diisi" })}
        />
        {errors.case_date && (
          <p className={errorTextClass}>{errors.case_date.message}</p>
        )}
      </div>
      <div>
        <label htmlFor='topic' className={labelClass}>
          Topik/Masalah <span className='text-red-500'>*</span>
        </label>
        <input
          id='topic'
          type='text'
          className={commonInputClass}
          {...register("topic", { required: "Topik wajib diisi" })}
          placeholder='Contoh: Mencontek saat ujian'
        />
        {errors.topic && (
          <p className={errorTextClass}>{errors.topic.message}</p>
        )}
      </div>
      <div>
        <label htmlFor='follow_up' className={labelClass}>
          Tindak Lanjut <span className='text-red-500'>*</span>
        </label>
        <input
          id='follow_up'
          type='text'
          className={commonInputClass}
          {...register("follow_up", { required: "Tindak lanjut wajib diisi" })}
          placeholder='Contoh: Melakukan layanan konseling'
        />
        {errors.follow_up && (
          <p className={errorTextClass}>{errors.follow_up.message}</p>
        )}
      </div>
      <div>
        <label htmlFor='notes' className={labelClass}>
          Catatan Tambahan
        </label>
        <textarea
          id='notes'
          rows={4}
          className={`${commonInputClass} min-h-[100px]`}
          {...register("notes")}
        ></textarea>
      </div>

      <div className='flex justify-end space-x-3 pt-4 border-t'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type='submit' variant='primary' isLoading={isLoading}>
          {isEditMode ? "Simpan Perubahan" : "Buat Jurnal Kasus"}
        </Button>
      </div>
    </form>
  );
};

export default CaseJournalForm;
