import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Button from "../ui/Button";
import type { AttendanceRecord } from "../../services/attendanceService";

// Tipe data form disederhanakan
type AttendanceEditFormData = {
  status: "HADIR" | "SAKIT" | "IZIN" | "ALPHA";
  notes?: string;
  clock_in_time?: string; // Format HH:mm
  clock_out_time?: string; // Format HH:mm
  work_code?: "LURING" | "DARING" | string | null;
  latitude?: number | string;
  longitude?: number | string;
  address?: string;
  // Field untuk tambah manual
  student_id?: string;
  date?: string; // YYYY-MM-DD
};

interface AttendanceEditFormProps {
  initialData: Partial<AttendanceRecord>;
  onSubmit: SubmitHandler<AttendanceEditFormData>;
  onCancel: () => void;
  isLoading?: boolean;
  isManualAddMode: boolean;
}

const AttendanceEditForm: React.FC<AttendanceEditFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isManualAddMode,
}) => {
  const { register, handleSubmit, reset } = useForm<AttendanceEditFormData>();

  useEffect(() => {
    const formatTime = (isoString: string | null | undefined) =>
      isoString
        ? new Date(isoString)
            .toLocaleTimeString("en-CA", { hour12: false })
            .slice(0, 5)
        : "";

    reset({
      status: initialData.status || "HADIR",
      notes: initialData.notes || "",
      clock_in_time: formatTime(initialData.clockInTime),
      clock_out_time: formatTime(initialData.clockOutTime),
      work_code: initialData.workCode || "",
      latitude: initialData.clockInLatitude || "",
      longitude: initialData.clockInLongitude || "",
      address: initialData.clockInAddress || "",
      student_id: initialData.studentId || "",
      date: initialData.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
  }, [initialData, reset]);

  const commonInputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {!isManualAddMode && initialData.studentName && (
        <div className='p-2 bg-gray-100 rounded-md'>
          <label className='text-xs text-gray-500'>Siswa</label>
          <p className='font-semibold text-gray-800'>
            {initialData.studentName} ({initialData.studentId})
          </p>
        </div>
      )}
      {isManualAddMode && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='student_id' className={labelClass}>
              ID Siswa <span className='text-red-500'>*</span>
            </label>
            <input
              id='student_id'
              type='text'
              className={commonInputClass}
              {...register("student_id", { required: true })}
            />
          </div>
          <div>
            <label htmlFor='manualDate' className={labelClass}>
              Tanggal <span className='text-red-500'>*</span>
            </label>
            <input
              id='manualDate'
              type='date'
              className={commonInputClass}
              {...register("date", { required: true })}
            />
          </div>
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='status' className={labelClass}>
            Status
          </label>
          <select
            id='status'
            {...register("status")}
            className={commonInputClass}
          >
            <option value='HADIR'>HADIR</option>
            <option value='SAKIT'>SAKIT</option>
            <option value='IZIN'>IZIN</option>
            <option value='ALPHA'>ALPHA</option>
          </select>
        </div>
        <div>
          <label htmlFor='work_code' className={labelClass}>
            Mode
          </label>
          <select
            id='work_code'
            {...register("work_code")}
            className={commonInputClass}
          >
            <option value=''>Pilih Mode</option>
            <option value='LURING'>LURING</option>
            <option value='DARING'>DARING</option>
          </select>
        </div>
        <div>
          <label htmlFor='clock_in_time' className={labelClass}>
            Jam Masuk (HH:MM)
          </label>
          <input
            id='clock_in_time'
            type='time'
            className={commonInputClass}
            {...register("clock_in_time")}
          />
        </div>
        <div>
          <label htmlFor='clock_out_time' className={labelClass}>
            Jam Keluar/Izin (HH:MM)
          </label>
          <input
            id='clock_out_time'
            type='time'
            className={commonInputClass}
            {...register("clock_out_time")}
          />
        </div>
      </div>
      <div>
        <label htmlFor='notes' className={labelClass}>
          Catatan
        </label>
        <textarea
          id='notes'
          rows={2}
          className={`${commonInputClass} min-h-[60px]`}
          {...register("notes")}
        ></textarea>
      </div>
      <fieldset className='border p-2 rounded-md'>
        <legend className='text-sm font-medium px-1'>Lokasi (Opsional)</legend>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2'>
          <div>
            <label htmlFor='latitude' className={labelClass}>
              Latitude
            </label>
            <input
              id='latitude'
              type='text'
              className={commonInputClass}
              {...register("latitude")}
            />
          </div>
          <div>
            <label htmlFor='longitude' className={labelClass}>
              Longitude
            </label>
            <input
              id='longitude'
              type='text'
              className={commonInputClass}
              {...register("longitude")}
            />
          </div>
          <div className='sm:col-span-2'>
            <label htmlFor='address' className={labelClass}>
              Alamat
            </label>
            <input
              id='address'
              type='text'
              className={commonInputClass}
              {...register("address")}
            />
          </div>
        </div>
      </fieldset>
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
          {isManualAddMode ? "Tambah Absensi" : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
};
export default AttendanceEditForm;
