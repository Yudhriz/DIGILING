import React, { useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray, Path } from "react-hook-form";
import Button from "../ui/Button";
import type {
  StudentProfileFormData,
  SaudaraKandung,
  RiwayatSakitKeras,
  Prestasi,
} from "../../services/studentService"; // Menggunakan tipe dari studentService

interface DetailStudentFormProps {
  onSubmit: SubmitHandler<StudentProfileFormData>;
  onCancel: () => void;
  initialData?: StudentProfileFormData;
  isLoading?: boolean;
  isEditMode?: boolean;
}

// Opsi-opsi
const jenisKelaminOptions = ["Laki-laki", "Perempuan"];
const termasukDaerahOptions = [
  "Dalam kota",
  "Pinggir kota",
  "Luar kota",
  "Pinggir sungai",
  "Daerah pegunungan",
];
const alatSaranaOptions = [
  "Jalan kaki",
  "Naik sepeda",
  "Naik sepeda motor",
  "Diantar orang tua",
  "Naik taksi/ojek",
  "Naik mobil pribadi",
  "Lainnya (teks)",
];
const tempatTinggalOptions = [
  "Rumah sendiri",
  "Rumah dinas",
  "Rumah kontrakan",
  "Rumah nenek/kakek",
  "Kamar kost",
  "Lainnya (teks)",
];
const tinggalBersamaOptions = [
  "Ayah dan ibu kandung",
  "Ayah kandung dan ibu tiri",
  "Ayah tiri dan ibu kandung",
  "Ayah kandung saja",
  "Ibu kandung saja",
  "Nenek/Kakek",
  "Saudara kandung",
  "Sendiri",
  "Wali (teks)",
  "Lainnya (teks)",
];
const rumahTerbuatOptions = [
  "Tembok beton",
  "Setengah kayu",
  "Kayu",
  "Bambu",
  "Lainnya (teks)",
];
const alatFasilitasOptions = [
  "Kamar sendiri",
  "Ruang belajar sendiri",
  "Perpustakaan keluarga",
  "Radio/TV/parabola",
  "Ruang tamu",
  "Almari pribadi",
  "Gitar/piano alat musik",
  "Komputer/laptop/LCD",
  "Kompor/kompor gas",
  "Ruang makan sendiri",
  "Almari es",
  "Sepeda",
  "Sepeda motor",
  "Mobil",
  "Berlangganan surat kabar/majalah (teks)",
];
const golonganDarahOptions = ["A", "B", "AB", "O"];
const rambutOptions = ["Lurus", "Keriting", "Bergelombang"];
const yaTidakOptions = ["Ya", "Tidak"];
const kemampuanBahasaIndonesiaOptions = [
  "Menguasai",
  "Cukup Menguasai",
  "Kurang Menguasai",
  "Tidak Menguasai",
];
const bahasaDaerahOptions = [
  "Bahasa Banjar",
  "Bahasa Dayak",
  "Bahasa Jawa",
  "Bahasa Ambon",
  "Lainnya",
];
const bahasaAsingOptions = [
  "Bahasa Inggris",
  "Bahasa Arab",
  "Bahasa Mandarin",
  "Bahasa Jerman",
  "Lainnya",
];
const kegiatanBelajarOptions = ["Rutin", "Tidak"];
const waktuBelajarOptions = ["Sore", "Malam", "Pagi"];

const DetailStudentForm: React.FC<DetailStudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  isEditMode = true,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<StudentProfileFormData>({
    defaultValues: initialData || {},
  });

  const watchTinggalBersama = watch("tinggal_bersama");

  const {
    fields: saudaraFields,
    append: appendSaudara,
    remove: removeSaudara,
  } = useFieldArray({ control, name: "saudara_kandung" });
  const {
    fields: sakitKerasFields,
    append: appendSakitKeras,
    remove: removeSakitKeras,
  } = useFieldArray({ control, name: "sakit_keras" });
  const {
    fields: prestasiSdFields,
    append: appendPrestasiSd,
    remove: removePrestasiSd,
  } = useFieldArray({ control, name: "prestasi_sd" });
  const {
    fields: prestasiSmpFields,
    append: appendPrestasiSmp,
    remove: removePrestasiSmp,
  } = useFieldArray({ control, name: "prestasi_smp" });

  useEffect(() => {
    const defaultFieldArrayValues = {
      saudara_kandung: initialData?.saudara_kandung?.length
        ? initialData.saudara_kandung
        : [],
      sakit_keras: initialData?.sakit_keras?.length
        ? initialData.sakit_keras
        : [],
      prestasi_sd: initialData?.prestasi_sd?.length
        ? initialData.prestasi_sd
        : [],
      prestasi_smp: initialData?.prestasi_smp?.length
        ? initialData.prestasi_smp
        : [],
    };
    reset({ ...initialData, ...defaultFieldArrayValues });
  }, [initialData, reset]);

  const commonInputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm read-only:bg-gray-100 read-only:cursor-not-allowed";
  const commonTextareaClass = `${commonInputClass} min-h-[80px]`;
  const commonSelectClass = `${commonInputClass}`;
  const errorTextClass = "text-red-500 text-xs mt-1";
  const fieldsetLegendClass =
    "text-lg font-semibold text-primary-700 mb-3 px-1";
  const fieldsetClass = "mb-6 p-4 border border-gray-300 rounded-md";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const renderCheckboxGroup = (
    fieldName: Path<StudentProfileFormData>,
    options: readonly string[],
    lainnyaTextFieldName?: Path<StudentProfileFormData>,
    lainnyaLabel?: string,
    lainnyaOptionValue: string = "Lainnya (teks)"
  ) => {
    const currentValues = (watch(fieldName) as string[] | undefined) || [];
    const isLainnyaChecked = currentValues.includes(lainnyaOptionValue);

    return (
      <div>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1'>
          {options.map((option) => (
            <label
              key={`${String(fieldName)}-${option}`}
              className='flex items-center space-x-2'
            >
              <input
                type='checkbox'
                value={option}
                className='h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
                {...register(fieldName)}
                disabled={!isEditMode}
              />
              <span className='text-sm'>{option}</span>
            </label>
          ))}
        </div>
        {lainnyaTextFieldName && isLainnyaChecked && (
          <div className='mt-2'>
            <input
              type='text'
              placeholder={lainnyaLabel || `Sebutkan lainnya`}
              className={`${commonInputClass} mt-1`}
              {...register(lainnyaTextFieldName)}
              readOnly={!isEditMode}
            />
          </div>
        )}
        {errors[fieldName as keyof StudentProfileFormData] && (
          <p className={errorTextClass}>
            {(errors[fieldName as keyof StudentProfileFormData] as any)
              ?.message || "Pilihan tidak valid"}
          </p>
        )}
      </div>
    );
  };

  const renderRadioGroup = (
    fieldName: Path<StudentProfileFormData>,
    options: readonly string[],
    lainnyaTextFieldName?: Path<StudentProfileFormData>,
    lainnyaLabel?: string,
    lainnyaOptionValue: string = "Lainnya (teks)"
  ) => {
    const watchedValue = watch(fieldName);
    const isLainnyaSelected =
      lainnyaTextFieldName && watchedValue === lainnyaOptionValue;

    return (
      <div>
        <div className='flex flex-wrap gap-x-4 gap-y-1 mt-1'>
          {options.map((option) => (
            <label
              key={`${String(fieldName)}-${option}`}
              className='flex items-center space-x-2'
            >
              <input
                type='radio'
                value={option}
                className='h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500'
                {...register(fieldName)}
                disabled={!isEditMode}
              />
              <span className='text-sm'>{option}</span>
            </label>
          ))}
        </div>
        {lainnyaTextFieldName && isLainnyaSelected && (
          <div className='mt-2'>
            <input
              type='text'
              placeholder={lainnyaLabel || `Sebutkan lainnya`}
              className={`${commonInputClass} mt-1`}
              {...register(lainnyaTextFieldName)}
              readOnly={!isEditMode}
            />
          </div>
        )}
        {errors[fieldName as keyof StudentProfileFormData] && (
          <p className={errorTextClass}>
            {(errors[fieldName as keyof StudentProfileFormData] as any)
              ?.message || "Pilihan tidak valid"}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* A. Identitas Pribadi */}
      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>A. Identitas Pribadi</legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4'>
          <div>
            <label htmlFor='name' className={labelClass}>
              Nama Lengkap (sesuai ijazah)
            </label>
            <input
              id='name'
              type='text'
              className={commonInputClass}
              {...register("name", { required: "Nama lengkap wajib diisi" })}
              readOnly={!isEditMode}
            />
            {errors.name && (
              <p className={errorTextClass}>{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='username' className={labelClass}>
              Nama Panggilan/Username
            </label>
            <input
              id='username'
              type='text'
              className={commonInputClass}
              {...register("username", { required: "Username wajib diisi" })}
              readOnly={!isEditMode}
            />
            {errors.username && (
              <p className={errorTextClass}>{errors.username.message}</p>
            )}
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          <div>
            <label className={labelClass}>Jenis Kelamin</label>
            {renderRadioGroup("jenis_kelamin", jenisKelaminOptions)}
            {errors.jenis_kelamin && (
              <p className={errorTextClass}>{errors.jenis_kelamin.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='tempat_lahir' className={labelClass}>
              Tempat Lahir
            </label>
            <input
              id='tempat_lahir'
              type='text'
              className={commonInputClass}
              {...register("tempat_lahir")}
              readOnly={!isEditMode}
            />
            {errors.tempat_lahir && (
              <p className={errorTextClass}>{errors.tempat_lahir.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='tanggal_lahir' className={labelClass}>
              Tanggal Lahir
            </label>
            <input
              id='tanggal_lahir'
              type='date'
              className={commonInputClass}
              {...register("tanggal_lahir")}
              readOnly={!isEditMode}
            />
            {errors.tanggal_lahir && (
              <p className={errorTextClass}>{errors.tanggal_lahir.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='agama' className={labelClass}>
              Agama
            </label>
            <input
              id='agama'
              type='text'
              className={commonInputClass}
              {...register("agama")}
              readOnly={!isEditMode}
            />
            {errors.agama && (
              <p className={errorTextClass}>{errors.agama.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='suku_bangsa' className={labelClass}>
              Suku Bangsa
            </label>
            <input
              id='suku_bangsa'
              type='text'
              className={commonInputClass}
              {...register("suku_bangsa")}
              readOnly={!isEditMode}
            />
            {errors.suku_bangsa && (
              <p className={errorTextClass}>{errors.suku_bangsa.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='anak_ke' className={labelClass}>
              Anak ke-
            </label>
            <input
              id='anak_ke'
              type='number'
              className={commonInputClass}
              {...register("anak_ke")}
              readOnly={!isEditMode}
            />
            {errors.anak_ke && (
              <p className={errorTextClass}>{errors.anak_ke.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='tanggal_masuk' className={labelClass}>
              Tanggal Masuk Sekolah Ini
            </label>
            <input
              id='tanggal_masuk'
              type='date'
              className={commonInputClass}
              {...register("tanggal_masuk")}
              readOnly={!isEditMode}
            />
            {errors.tanggal_masuk && (
              <p className={errorTextClass}>{errors.tanggal_masuk.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='asal_sekolah' className={labelClass}>
              Asal Sekolah (SD/SMP)
            </label>
            <input
              id='asal_sekolah'
              type='text'
              className={commonInputClass}
              {...register("asal_sekolah")}
              readOnly={!isEditMode}
            />
            {errors.asal_sekolah && (
              <p className={errorTextClass}>{errors.asal_sekolah.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>
          B. Keterangan Tempat Tinggal
        </legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          <div>
            <label htmlFor='alamat_asal' className={labelClass}>
              Alamat Asal (Sesuai KK)
            </label>
            <textarea
              id='alamat_asal'
              className={commonTextareaClass}
              {...register("alamat_asal")}
              readOnly={!isEditMode}
            ></textarea>
            {errors.alamat_asal && (
              <p className={errorTextClass}>{errors.alamat_asal.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='nomor_telp_hp' className={labelClass}>
              No. Telp/HP (Rumah Asal)
            </label>
            <input
              id='nomor_telp_hp'
              type='text'
              className={commonInputClass}
              {...register("nomor_telp_hp")}
              readOnly={!isEditMode}
            />
            {errors.nomor_telp_hp && (
              <p className={errorTextClass}>{errors.nomor_telp_hp.message}</p>
            )}
          </div>
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Termasuk Daerah Asal</label>
          {renderCheckboxGroup("termasuk_daerah_asal", termasukDaerahOptions)}
        </div>
        <hr className='my-4' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          <div>
            <label htmlFor='alamat_sekarang' className={labelClass}>
              Alamat Sekarang (Jika Berbeda)
            </label>
            <textarea
              id='alamat_sekarang'
              className={commonTextareaClass}
              {...register("alamat_sekarang")}
              readOnly={!isEditMode}
            ></textarea>
            {errors.alamat_sekarang && (
              <p className={errorTextClass}>{errors.alamat_sekarang.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='nomor_telp_hp_sekarang' className={labelClass}>
              No. Telp/HP (Sekarang)
            </label>
            <input
              id='nomor_telp_hp_sekarang'
              type='text'
              className={commonInputClass}
              {...register("nomor_telp_hp_sekarang")}
              readOnly={!isEditMode}
            />
            {errors.nomor_telp_hp_sekarang && (
              <p className={errorTextClass}>
                {errors.nomor_telp_hp_sekarang.message}
              </p>
            )}
          </div>
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Termasuk Daerah Sekarang</label>
          {renderCheckboxGroup(
            "termasuk_daerah_sekarang",
            termasukDaerahOptions
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='jarak_rumah_sekolah' className={labelClass}>
            Jarak Rumah ke Sekolah (meter)
          </label>
          <input
            id='jarak_rumah_sekolah'
            type='number'
            className={commonInputClass}
            {...register("jarak_rumah_sekolah")}
            readOnly={!isEditMode}
          />
          {errors.jarak_rumah_sekolah && (
            <p className={errorTextClass}>
              {errors.jarak_rumah_sekolah.message}
            </p>
          )}
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Alat/Sarana ke Sekolah</label>
          {renderCheckboxGroup(
            "alat_sarana_ke_sekolah",
            alatSaranaOptions,
            "alat_sarana_ke_sekolah_lainnya_text"
          )}
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Tempat Tinggal</label>
          {renderRadioGroup(
            "tempat_tinggal",
            tempatTinggalOptions,
            "tempat_tinggal_lainnya_text"
          )}
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Tinggal Bersama</label>
          {renderCheckboxGroup("tinggal_bersama", tinggalBersamaOptions)}
          {Array.isArray(watchTinggalBersama) &&
            watchTinggalBersama.includes("Wali (teks)") && (
              <div className='mt-2'>
                <label
                  htmlFor='tinggal_bersama_wali_text'
                  className={labelClass}
                >
                  Nama Wali
                </label>
                <input
                  id='tinggal_bersama_wali_text'
                  type='text'
                  placeholder='Sebutkan Wali'
                  className={commonInputClass}
                  {...register("tinggal_bersama_wali_text")}
                  readOnly={!isEditMode}
                />
              </div>
            )}
          {Array.isArray(watchTinggalBersama) &&
            watchTinggalBersama.includes("Lainnya (teks)") && (
              <div className='mt-2'>
                <label
                  htmlFor='tinggal_bersama_lainnya_text'
                  className={labelClass}
                >
                  Tinggal Bersama Lainnya
                </label>
                <input
                  id='tinggal_bersama_lainnya_text'
                  type='text'
                  placeholder='Sebutkan Lainnya'
                  className={commonInputClass}
                  {...register("tinggal_bersama_lainnya_text")}
                  readOnly={!isEditMode}
                />
              </div>
            )}
          {errors.tinggal_bersama && (
            <p className={errorTextClass}>{errors.tinggal_bersama.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className={labelClass}>Rumah Terbuat Dari</label>
          {renderRadioGroup(
            "rumah_terbuat_dari",
            rumahTerbuatOptions,
            "rumah_terbuat_dari_lainnya_text"
          )}
        </div>
        <div>
          <label className={labelClass}>Alat Fasilitas yang Dimiliki</label>
          {renderCheckboxGroup(
            "alat_fasilitas_dimiliki",
            alatFasilitasOptions,
            "alat_fasilitas_dimiliki_surat_kabar_text",
            "Sebutkan surat kabar/majalah",
            "Berlangganan surat kabar/majalah (teks)"
          )}
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>C. Data Keluarga</legend>
        {(["ayah", "ibu", "wali"] as const).map((type) => (
          <div key={type} className='mb-4 p-3 border border-gray-200 rounded'>
            <h4 className='text-md font-semibold capitalize mb-2 text-gray-800'>
              {type}
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {(
                [
                  "nama",
                  "tanggal_lahir",
                  "agama",
                  "pendidikan",
                  "pekerjaan",
                  "suku_bangsa",
                  "alamat",
                ] as const
              ).map((field) => (
                <div key={field}>
                  <label
                    htmlFor={`data_keluarga.${type}.${field}`}
                    className={labelClass}
                  >
                    {field
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  {field === "alamat" ? (
                    <textarea
                      id={`data_keluarga.${type}.${field}`}
                      className={commonTextareaClass}
                      {...register(
                        `data_keluarga.${type}.${field}` as Path<StudentProfileFormData>
                      )}
                      readOnly={!isEditMode}
                    ></textarea>
                  ) : (
                    <input
                      id={`data_keluarga.${type}.${field}`}
                      type={field === "tanggal_lahir" ? "date" : "text"}
                      className={commonInputClass}
                      {...register(
                        `data_keluarga.${type}.${field}` as Path<StudentProfileFormData>
                      )}
                      readOnly={!isEditMode}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div>
          <h4 className='text-md font-semibold mb-2 text-gray-800 mt-4'>
            Saudara Kandung
          </h4>
          {saudaraFields.map((item, index) => (
            <div key={item.id} className='border p-3 mb-3 rounded space-y-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
                <div>
                  <label className={labelClass}>Nama</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`saudara_kandung.${index}.nama`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tgl Lahir</label>
                  <input
                    type='date'
                    className={commonInputClass}
                    {...register(`saudara_kandung.${index}.tanggal_lahir`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Jenis Kelamin</label>
                  <select
                    className={commonSelectClass}
                    {...register(`saudara_kandung.${index}.jenis_kelamin`)}
                    disabled={!isEditMode}
                  >
                    <option value=''>Pilih</option>
                    <option value='Laki-laki'>Laki-laki</option>
                    <option value='Perempuan'>Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status Hub.</label>
                  <select
                    className={commonSelectClass}
                    {...register(`saudara_kandung.${index}.status_hubungan`)}
                    disabled={!isEditMode}
                  >
                    <option value=''>Pilih</option>
                    <option value='Kandung'>Kandung</option>
                    <option value='Siri'>Siri</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Pekerjaan/Sekolah</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`saudara_kandung.${index}.pekerjaan_sekolah`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tingkat</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`saudara_kandung.${index}.tingkat`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status Kawin</label>
                  <select
                    className={commonSelectClass}
                    {...register(`saudara_kandung.${index}.status_perkawinan`)}
                    disabled={!isEditMode}
                  >
                    <option value=''>Pilih</option>
                    <option value='Kawin'>Kawin</option>
                    <option value='Belum'>Belum</option>
                  </select>
                </div>
              </div>
              {isEditMode && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeSaudara(index)}
                >
                  Hapus Saudara
                </Button>
              )}
            </div>
          ))}
          {isEditMode && (
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={() => appendSaudara({} as SaudaraKandung)}
            >
              Tambah Saudara
            </Button>
          )}
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>D. Keadaan Jasmani</legend>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <label className={labelClass}>Tinggi Badan (cm)</label>
            <input
              type='number'
              className={commonInputClass}
              {...register("tinggi_badan")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Berat Badan (kg)</label>
            <input
              type='number'
              step='0.1'
              className={commonInputClass}
              {...register("berat_badan")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Gol. Darah</label>
            <select
              className={commonSelectClass}
              {...register("golongan_darah")}
              disabled={!isEditMode}
            >
              <option value=''>Pilih</option>
              {golonganDarahOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Rambut</label>
            <select
              className={commonSelectClass}
              {...register("rambut")}
              disabled={!isEditMode}
            >
              <option value=''>Pilih</option>
              {rambutOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Bentuk Mata</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("bentuk_mata")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Bentuk Muka</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("bentuk_muka")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Warna Kulit</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("warna_kulit")}
              readOnly={!isEditMode}
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div>
            <label className={labelClass}>Memiliki Cacat Tubuh?</label>
            {renderRadioGroup("memiliki_cacat_tubuh", yaTidakOptions)}
            {/* Menggunakan watch() langsung di JSX untuk kondisi */}
            {watch("memiliki_cacat_tubuh") === "Ya" && (
              <div className='mt-2'>
                <label htmlFor='cacat_tubuh_penjelasan' className={labelClass}>
                  Jelaskan Cacat Tubuh
                </label>
                <textarea
                  id='cacat_tubuh_penjelasan'
                  className={commonTextareaClass}
                  {...register("cacat_tubuh_penjelasan")}
                  readOnly={!isEditMode}
                ></textarea>
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Memakai Kacamata?</label>
            {renderRadioGroup("memakai_kacamata", yaTidakOptions)}
            {/* Menggunakan watch() langsung di JSX untuk kondisi */}
            {watch("memakai_kacamata") === "Ya" && (
              <div className='mt-2'>
                <label htmlFor='kacamata_kelainan' className={labelClass}>
                  Kelainan Kacamata
                </label>
                <input
                  id='kacamata_kelainan'
                  type='text'
                  placeholder='Minus/Plus/Silinder'
                  className={commonInputClass}
                  {...register("kacamata_kelainan")}
                  readOnly={!isEditMode}
                />
              </div>
            )}
          </div>
        </div>
        <div className='mt-4'>
          <label htmlFor='sakit_sering_diderita' className={labelClass}>
            Sakit yang Sering Diderita
          </label>
          <input
            id='sakit_sering_diderita'
            type='text'
            className={commonInputClass}
            {...register("sakit_sering_diderita")}
            readOnly={!isEditMode}
          />
        </div>
        <div className='mt-4'>
          <h4 className='text-md font-semibold mb-2 text-gray-800'>
            Riwayat Sakit Keras
          </h4>
          {sakitKerasFields.map((item, index) => (
            <div key={item.id} className='border p-3 mb-3 rounded space-y-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div>
                  <label className={labelClass}>Jenis Penyakit</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`sakit_keras.${index}.jenis_penyakit`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Usia Saat Sakit</label>
                  <input
                    type='number'
                    className={commonInputClass}
                    {...register(`sakit_keras.${index}.usia_saat_sakit`)}
                    readOnly={!isEditMode}
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 items-end'>
                <div>
                  <label className={labelClass}>Opname?</label>
                  <select
                    className={commonSelectClass}
                    {...register(`sakit_keras.${index}.opname`)}
                    disabled={!isEditMode}
                  >
                    <option value=''>Pilih</option>
                    <option value='Ya'>Ya</option>
                    <option value='Tidak'>Tidak</option>
                  </select>
                </div>
                {watch(`sakit_keras.${index}.opname`) === "Ya" && (
                  <div>
                    <label className={labelClass}>Opname di RS</label>
                    <input
                      type='text'
                      className={commonInputClass}
                      {...register(`sakit_keras.${index}.opname_di_rs`)}
                      readOnly={!isEditMode}
                    />
                  </div>
                )}
              </div>
              {isEditMode && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeSakitKeras(index)}
                >
                  Hapus Riwayat Sakit
                </Button>
              )}
            </div>
          ))}
          {isEditMode && (
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={() => appendSakitKeras({} as RiwayatSakitKeras)}
            >
              Tambah Riwayat Sakit
            </Button>
          )}
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>E. Penguasaan Bahasa</legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Kemampuan Bahasa Indonesia</label>
            <select
              className={commonSelectClass}
              {...register("kemampuan_bahasa_indonesia")}
              disabled={!isEditMode}
            >
              <option value=''>Pilih</option>
              {kemampuanBahasaIndonesiaOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Bahasa Sehari-hari di Rumah</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("bahasa_sehari_hari_dirumah")}
              readOnly={!isEditMode}
            />
          </div>
        </div>
        <div className='mt-4'>
          <label className={labelClass}>Bahasa Daerah yang Dikuasai</label>
          {renderCheckboxGroup(
            "bahasa_daerah_dikuasai",
            bahasaDaerahOptions,
            "bahasa_daerah_lainnya_text"
          )}
        </div>
        <div className='mt-4'>
          <label className={labelClass}>Bahasa Asing yang Dikuasai</label>
          {renderCheckboxGroup(
            "bahasa_asing_dikuasai",
            bahasaAsingOptions,
            "bahasa_asing_lainnya_text"
          )}
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>
          F. Hobby, Kegemaran, dan Cita-Cita
        </legend>
        <div>
          <label htmlFor='hobby' className={labelClass}>
            Hobby/Kegemaran
          </label>
          <textarea
            id='hobby'
            className={commonTextareaClass}
            {...register("hobby")}
            readOnly={!isEditMode}
          ></textarea>
        </div>
        <div className='mt-4'>
          <label htmlFor='cita_cita' className={labelClass}>
            Cita-cita
          </label>
          <textarea
            id='cita_cita'
            className={commonTextareaClass}
            {...register("cita_cita")}
            readOnly={!isEditMode}
          ></textarea>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={fieldsetLegendClass}>G. Keadaan Pendidikan</legend>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className={labelClass}>Pelajaran Disukai (SD)</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("pelajaran_disukai_sd")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Alasan Disukai (SD)</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("alasan_pelajaran_disukai_sd")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Pelajaran Tidak Disukai (SD)</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("pelajaran_tidak_disukai_sd")}
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Alasan Tidak Disukai (SD)</label>
            <input
              type='text'
              className={commonInputClass}
              {...register("alasan_pelajaran_tidak_disukai_sd")}
              readOnly={!isEditMode}
            />
          </div>
        </div>
        <div className='mt-4'>
          <h4 className='text-md font-semibold mb-2 text-gray-800'>
            Prestasi SD
          </h4>
          {prestasiSdFields.map((item, index) => (
            <div key={item.id} className='border p-3 mb-3 rounded space-y-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
                <div>
                  <label className={labelClass}>Nama Kejuaraan</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_sd.${index}.nama_kejuaraan`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tingkat</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_sd.${index}.tingkat`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Raihan</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_sd.${index}.raihan_prestasi`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tahun/Kelas</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_sd.${index}.tahun_kelas`)}
                    readOnly={!isEditMode}
                  />
                </div>
              </div>
              {isEditMode && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removePrestasiSd(index)}
                >
                  Hapus Prestasi SD
                </Button>
              )}
            </div>
          ))}
          {isEditMode && (
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={() => appendPrestasiSd({} as Prestasi)}
            >
              Tambah Prestasi SD
            </Button>
          )}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div>
            <label className={labelClass}>Kegiatan Belajar di Rumah</label>
            {renderRadioGroup(
              "kegiatan_belajar_dirumah",
              kegiatanBelajarOptions
            )}
          </div>
          <div>
            <label className={labelClass}>Dilaksanakan Setiap Belajar</label>
            {renderCheckboxGroup(
              "dilaksanakan_setiap_belajar",
              waktuBelajarOptions
            )}
          </div>
        </div>
        <div className='mt-4'>
          <label className={labelClass}>Kesulitan Belajar</label>
          <textarea
            className={commonTextareaClass}
            {...register("kesulitan_belajar")}
            readOnly={!isEditMode}
          ></textarea>
        </div>
        <div className='mt-4'>
          <label className={labelClass}>Hambatan Belajar</label>
          <textarea
            className={commonTextareaClass}
            {...register("hambatan_belajar")}
            readOnly={!isEditMode}
          ></textarea>
        </div>
        <div className='mt-4'>
          <h4 className='text-md font-semibold mb-2 text-gray-800'>
            Prestasi SMP
          </h4>
          {prestasiSmpFields.map((item, index) => (
            <div key={item.id} className='border p-3 mb-3 rounded space-y-2'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
                <div>
                  <label className={labelClass}>Nama Kejuaraan</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_smp.${index}.nama_kejuaraan`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tingkat</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_smp.${index}.tingkat`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Raihan</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_smp.${index}.raihan_prestasi`)}
                    readOnly={!isEditMode}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tahun/Kelas</label>
                  <input
                    type='text'
                    className={commonInputClass}
                    {...register(`prestasi_smp.${index}.tahun_kelas`)}
                    readOnly={!isEditMode}
                  />
                </div>
              </div>
              {isEditMode && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removePrestasiSmp(index)}
                >
                  Hapus Prestasi SMP
                </Button>
              )}
            </div>
          ))}
          {isEditMode && (
            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={() => appendPrestasiSmp({} as Prestasi)}
            >
              Tambah Prestasi SMP
            </Button>
          )}
        </div>
      </fieldset>

      {isEditMode && (
        <div className='flex justify-end space-x-4 pt-6 border-t mt-6'>
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
            Simpan Perubahan Detail
          </Button>
        </div>
      )}
    </form>
  );
};

export default DetailStudentForm;
