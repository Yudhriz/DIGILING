import React, { useState } from "react";
import Button from "../ui/Button";
import { Search, Download, PlusCircle } from "lucide-react";

export type ReportFilterParams = {
  type: "daily" | "monthly";
  date: string;
  year: number;
  month: number;
  searchTerm?: string;
};

interface AttendanceReportFormProps {
  // Perbaikan typo ada di baris ini
  onFetchReport: (params: ReportFilterParams) => void;
  onExportExcel: () => void;
  onManualAdd: () => void;
  isLoading?: boolean;
  isDataLoaded: boolean;
}

const AttendanceReportForm: React.FC<AttendanceReportFormProps> = ({
  onFetchReport,
  onExportExcel,
  onManualAdd,
  isLoading,
  isDataLoaded,
}) => {
  const [reportType, setReportType] = useState<"daily" | "monthly">("daily");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState("");

  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const monthOptions = [
    { v: 1, l: "Januari" },
    { v: 2, l: "Februari" },
    { v: 3, l: "Maret" },
    { v: 4, l: "April" },
    { v: 5, l: "Mei" },
    { v: 6, l: "Juni" },
    { v: 7, l: "Juli" },
    { v: 8, l: "Agustus" },
    { v: 9, l: "September" },
    { v: 10, l: "Oktober" },
    { v: 11, l: "November" },
    { v: 12, l: "Desember" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetchReport({ type: reportType, date, year, month, searchTerm });
  };

  return (
    <form onSubmit={handleSubmit} className='p-4 bg-gray-50 rounded-lg border'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Jenis Laporan
          </label>
          <div className='flex rounded-md shadow-sm'>
            <button
              type='button'
              onClick={() => setReportType("daily")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md focus:z-10 focus:ring-2 focus:ring-primary-500 border border-gray-300 ${
                reportType === "daily"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Harian
            </button>
            <button
              type='button'
              onClick={() => setReportType("monthly")}
              className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500 border border-gray-300 ${
                reportType === "monthly"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        {reportType === "daily" ? (
          <div>
            <label
              htmlFor='report-date'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Tanggal
            </label>
            <input
              type='date'
              id='report-date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md shadow-sm'
            />
          </div>
        ) : (
          <>
            <div>
              <label
                htmlFor='reportYear'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Tahun
              </label>
              <select
                id='reportYear'
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className='w-full p-2 border border-gray-300 rounded-md shadow-sm'
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor='reportMonth'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Bulan
              </label>
              <select
                id='reportMonth'
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className='w-full p-2 border border-gray-300 rounded-md shadow-sm'
              >
                {monthOptions.map((m) => (
                  <option key={m.v} value={m.v}>
                    {m.l}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label
            htmlFor='searchInput'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Cari Siswa
          </label>
          <input
            type='text'
            id='searchInput'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md shadow-sm'
            placeholder='Nama atau ID...'
          />
        </div>

        <div className='flex gap-2'>
          <Button
            type='submit'
            isLoading={isLoading}
            className='w-full'
            leftIcon={<Search className='h-4 w-4' />}
          >
            Tampilkan
          </Button>
        </div>
      </div>
      <div className='flex justify-end gap-2 mt-4'>
        <Button
          type='button'
          onClick={onExportExcel}
          variant='outline'
          className='w-full sm:w-auto'
          leftIcon={<Download className='h-4 w-4' />}
          disabled={!isDataLoaded || isLoading}
        >
          Ekspor Excel
        </Button>
        <Button
          type='button'
          onClick={onManualAdd}
          variant='outline'
          className='w-full sm:w-auto'
          leftIcon={<PlusCircle className='h-4 w-4' />}
          disabled={isLoading}
        >
          Tambah Manual
        </Button>
      </div>
    </form>
  );
};

export default AttendanceReportForm;
