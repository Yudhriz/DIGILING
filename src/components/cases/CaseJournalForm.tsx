import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../ui/Button";
import type { CaseJournalFormData } from "../../services/caseJournalService";

interface CaseJournalFormProps {
  onSubmit: SubmitHandler<CaseJournalFormData>;
  onCancel: () => void;
  initialData?: Partial<CaseJournalFormData>;
  isLoading?: boolean;
}

const CaseJournalForm: React.FC<CaseJournalFormProps> = ({
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
  } = useForm<CaseJournalFormData>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    reset(initialData || { date: new Date().toISOString().split("T")[0] });
  }, [initialData, reset]);

  const commonInputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorTextClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor='studentId' className={labelClass}>
          ID Siswa <span className='text-red-500'>*</span>
        </label>
        <input
          id='studentId'
          type='text'
          className={commonInputClass}
          {...register("studentId", { required: "ID Siswa wajib diisi" })}
          placeholder='Masukkan ID siswa yang terkait...'
        />
        {errors.studentId && (
          <p className={errorTextClass}>{errors.studentId.message}</p>
        )}
      </div>
      <div>
        <label htmlFor='date' className={labelClass}>
          Tanggal Kasus <span className='text-red-500'>*</span>
        </label>
        <input
          id='date'
          type='date'
          className={commonInputClass}
          {...register("date", { required: "Tanggal wajib diisi" })}
        />
        {errors.date && <p className={errorTextClass}>{errors.date.message}</p>}
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
        <label htmlFor='followUp' className={labelClass}>
          Tindak Lanjut <span className='text-red-500'>*</span>
        </label>
        <input
          id='followUp'
          type='text'
          className={commonInputClass}
          {...register("followUp", { required: "Tindak lanjut wajib diisi" })}
          placeholder='Contoh: Melakukan layanan konseling'
        />
        {errors.followUp && (
          <p className={errorTextClass}>{errors.followUp.message}</p>
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
          {initialData?.studentId ? "Simpan Perubahan" : "Buat Jurnal Kasus"}
        </Button>
      </div>
    </form>
  );
};

export default CaseJournalForm;
