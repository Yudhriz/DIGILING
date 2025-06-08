import React, { useState, useMemo, useCallback,useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate mungkin diperlukan nanti
import {
  Loader,
  UserCheck,
  UserX,
  HelpCircle,
  ShieldAlert,
  Activity,
  Edit,
  MapPin,
  Users,
  Wifi,
} from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumb, { BreadcrumbItem } from "../../components/ui/Breadcrumb";
import AttendanceReportForm, {
  ReportFilterParams,
} from "../../components/reports/AttendanceReportForm";
import * as attendanceService from "../../services/attendanceService";
import type { AttendanceRecord } from "../../services/attendanceService";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AttendanceEditForm from "../../components/reports/AttendanceEditForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import * as XLSX from "xlsx";

// --- TIPE DATA & KOMPONEN SUB-TABEL DIDEFINISIKAN DI SINI ---

interface MonthlyStudentReport {
  studentId: string;
  studentName: string;
  days: { [day: number]: "HADIR" | "SAKIT" | "IZIN" | "ALPHA" };
}
interface MonthlyReportData {
  report: MonthlyStudentReport[];
  daysInMonth: number;
  month: number;
  year: number;
}

const DailyReportTable: React.FC<{
  reportData: AttendanceRecord[];
  onEdit: (item: AttendanceRecord) => void;
}> = ({ reportData, onEdit }) => {
  const statusDisplay: Record<
    string,
    { icon: React.ReactNode; color: string }
  > = {
    HADIR: { icon: <UserCheck className='h-5 w-5' />, color: "text-green-600" },
    SAKIT: { icon: <Activity className='h-5 w-5' />, color: "text-orange-600" },
    IZIN: { icon: <ShieldAlert className='h-5 w-5' />, color: "text-blue-600" },
    ALPHA: { icon: <UserX className='h-5 w-5' />, color: "text-red-600" },
    default: {
      icon: <HelpCircle className='h-5 w-5' />,
      color: "text-gray-500",
    },
  };
  const modeDisplay: Record<string, { icon: React.ReactNode; color: string }> =
    {
      LURING: { icon: <Users className='h-5 w-5' />, color: "text-gray-700" },
      DARING: { icon: <Wifi className='h-5 w-5' />, color: "text-gray-700" },
    };
  const openGoogleMaps = (lat: number, lng: number) =>
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");

  return (
    <div className='overflow-x-auto border border-gray-200 rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Nama Siswa
            </th>
            <th className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
              Status
            </th>
            <th className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
              Mode
            </th>
            <th className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
              Jam Masuk
            </th>
            <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
              Lokasi
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Catatan
            </th>
            <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {reportData.map((item) => (
            <tr key={item.id}>
              <td className='px-4 py-4 whitespace-nowrap'>
                <div className='text-sm font-medium text-gray-900'>
                  {item.studentName}
                </div>
                <div className='text-xs text-gray-500'>
                  ID: {item.studentId}
                </div>
              </td>
              <td className='px-2 py-4 whitespace-nowrap text-sm text-center'>
                <div
                  className={`inline-flex items-center gap-2 ${
                    statusDisplay[item.status]?.color ||
                    statusDisplay.default.color
                  }`}
                >
                  {statusDisplay[item.status]?.icon ||
                    statusDisplay.default.icon}
                  <span>{item.status}</span>
                </div>
              </td>
              <td className='px-2 py-4 whitespace-nowrap text-sm text-center'>
                {item.workCode && modeDisplay[item.workCode] ? (
                  <div
                    className={`inline-flex items-center gap-2 ${
                      modeDisplay[item.workCode].color
                    }`}
                  >
                    {modeDisplay[item.workCode].icon}
                    <span className='hidden sm:inline'>{item.workCode}</span>
                  </div>
                ) : (
                  item.workCode || "-"
                )}
              </td>
              <td className='px-2 py-4 text-center whitespace-nowrap text-sm text-gray-500'>
                {item.clockInTime
                  ? new Date(item.clockInTime).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td className='px-4 py-4 whitespace-nowrap text-sm text-center'>
                {item.clockInLatitude && item.clockInLongitude ? (
                  <Button
                    variant='link'
                    size='sm'
                    className='p-0 h-auto text-primary-600'
                    onClick={() =>
                      openGoogleMaps(
                        item.clockInLatitude!,
                        item.clockInLongitude!
                      )
                    }
                  >
                    <MapPin className='h-4 w-4' />
                  </Button>
                ) : (
                  "-"
                )}
              </td>
              <td
                className='px-4 py-4 text-sm text-gray-500 max-w-xs truncate'
                title={item.notes || ""}
              >
                {item.notes || "-"}
              </td>
              <td className='px-4 py-4 text-center whitespace-nowrap text-sm font-medium'>
                <Button
                  variant='icon'
                  size='sm'
                  onClick={() => onEdit(item)}
                  className='text-blue-600 hover:text-blue-800'
                  title='Edit Absensi'
                >
                  <Edit className='h-4 w-4' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MonthlyReportTable: React.FC<{ reportData: MonthlyReportData }> = ({
  reportData,
}) => {
  const { report, daysInMonth, year, month } = reportData;
  const headers = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const isWeekend = (day: number) => {
    const date = new Date(year, month - 1, day);
    const d = date.getDay();
    return d === 0 || d === 6;
  };
  const statusDisplay: Record<
    string,
    { symbol: string; className: string; tooltip: string }
  > = {
    HADIR: { symbol: "✓", className: "text-green-600", tooltip: "Hadir" },
    SAKIT: { symbol: "S", className: "text-orange-600", tooltip: "Sakit" },
    IZIN: { symbol: "I", className: "text-blue-600", tooltip: "Izin" },
    ALPHA: { symbol: "A", className: "text-red-600", tooltip: "Alpha" },
  };
  const calculateTotals = (days: { [day: number]: string }) =>
    Object.values(days).reduce(
      (acc, status) => {
        if (status in acc) acc[status as keyof typeof acc]++;
        return acc;
      },
      { HADIR: 0, SAKIT: 0, IZIN: 0, ALPHA: 0 }
    );

  return (
    <div className='overflow-x-auto border border-gray-200 rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-100 z-10 border-r'>
              Nama Siswa
            </th>
            {headers.map((day) => (
              <th
                key={day}
                className={`w-12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase ${
                  isWeekend(day) ? "bg-red-50 text-red-700" : ""
                }`}
              >
                {day}
              </th>
            ))}
            <th
              className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-100 border-l'
              title='Hadir'
            >
              H
            </th>
            <th
              className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-100'
              title='Sakit'
            >
              S
            </th>
            <th
              className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-100'
              title='Izin'
            >
              I
            </th>
            <th
              className='px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-100'
              title='Alpha'
            >
              A
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {report.map((student: MonthlyStudentReport) => {
            const totals = calculateTotals(student.days);
            return (
              <tr key={student.studentId}>
                <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r'>
                  {student.studentName}
                </td>
                {headers.map((day) => {
                  const status = student.days[day];
                  const display = status ? statusDisplay[status] : null;
                  return (
                    <td
                      key={`${student.studentId}-${day}`}
                      className={`w-12 px-2 py-4 text-center text-sm ${
                        isWeekend(day) ? "bg-red-50" : ""
                      }`}
                    >
                      {display ? (
                        <span
                          className={`font-bold ${display.className}`}
                          title={display.tooltip}
                        >
                          {display.symbol}
                        </span>
                      ) : (
                        <span className='text-gray-300'>-</span>
                      )}
                    </td>
                  );
                })}
                <td className='px-2 py-4 text-center text-sm font-semibold bg-gray-50 border-l text-green-600'>
                  {totals.HADIR}
                </td>
                <td className='px-2 py-4 text-center text-sm font-semibold bg-gray-50 text-orange-600'>
                  {totals.SAKIT}
                </td>
                <td className='px-2 py-4 text-center text-sm font-semibold bg-gray-50 text-blue-600'>
                  {totals.IZIN}
                </td>
                <td className='px-2 py-4 text-center text-sm font-semibold bg-gray-50 text-red-600'>
                  {totals.ALPHA}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// --- KOMPONEN HALAMAN UTAMA ---
const AttendanceReportPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [filterParams, setFilterParams] = useState<ReportFilterParams | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<Partial<AttendanceRecord> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Laporan Absensi" },
  ];

  const handleFetchReport = useCallback(async (params: ReportFilterParams) => {
    setFilterParams(params);
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      let data;
      if (params.type === "daily") {
        data = await attendanceService.getDailyReport(params.date);
      } else {
        data = await attendanceService.getMonthlyReport(
          params.year,
          params.month
        );
      }
      setReportData(data);
      const resultCount =
        params.type === "daily" ? data.length : data.report?.length;
      if (resultCount === 0) {
        toast.success("Tidak ada data absensi untuk periode yang dipilih.", {
          icon: "ℹ️",
        });
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengambil laporan.");
      toast.error(err.message || "Gagal mengambil laporan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenModal = (record: Partial<AttendanceRecord> | null = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingRecord && editingRecord.id) {
        await attendanceService.updateAttendance(editingRecord.id, data);
        toast.success("Absensi berhasil diperbarui.");
      } else {
        await attendanceService.manualAddAttendance(data);
        toast.success("Absensi manual berhasil ditambahkan.");
      }
      handleCancelModal();
      if (filterParams) await handleFetchReport(filterParams);
    } catch (err: any) {
      console.error("Gagal submit form:", err);
      toast.error(`Gagal: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportExcel = () => {
    const dataToExport =
      filterParams?.type === "daily" ? filteredDailyData : reportData?.report;
    if (!dataToExport || dataToExport.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }
    let worksheet;
    let fileName = `Laporan_Absensi.xlsx`;
    if (filterParams?.type === "daily") {
      const excelData = dataToExport.map(
        (item: AttendanceRecord, index: number) => ({
          "No.": index + 1,
          "Nama Siswa": item.studentName,
          "ID Siswa": item.studentId,
          Status: item.status,
          Mode: item.workCode || "-",
          "Jam Masuk": item.clockInTime
            ? new Date(item.clockInTime).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
          "Jam Keluar": item.clockOutTime
            ? new Date(item.clockOutTime).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
          Lokasi:
            item.clockInLatitude && item.clockInLongitude
              ? `${item.clockInLatitude}, ${item.clockInLongitude}`
              : "-",
          Catatan: item.notes || "",
        })
      );
      worksheet = XLSX.utils.json_to_sheet(excelData);
      fileName = `Laporan_Harian_${filterParams.date}.xlsx`;
    } else if (filterParams?.type === "monthly" && reportData) {
      const { report, daysInMonth, month, year } = reportData;
      const monthName = new Date(year, month - 1).toLocaleString("id-ID", {
        month: "long",
      });
      const excelData = report.map(
        (student: MonthlyStudentReport, index: number) => {
          const totals = Object.values(student.days).reduce(
            (acc: any, status: any) => {
              if (status in acc) acc[status]++;
              return acc;
            },
            { HADIR: 0, SAKIT: 0, IZIN: 0, ALPHA: 0 }
          );
          const row: any = {
            "No.": index + 1,
            "Nama Siswa": student.studentName,
          };
          for (let day = 1; day <= daysInMonth; day++) {
            row[String(day)] = (student.days[day] || "-").charAt(0);
          }
          row["H"] = totals.HADIR;
          row["S"] = totals.SAKIT;
          row["I"] = totals.IZIN;
          row["A"] = totals.ALPHA;
          return row;
        }
      );
      worksheet = XLSX.utils.json_to_sheet(excelData);
      fileName = `Laporan_Bulanan_${monthName}_${year}.xlsx`;
    }
    if (worksheet) {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Absensi");
      XLSX.writeFile(workbook, fileName);
    }
  };

  const filteredDailyData = useMemo(() => {
    if (filterParams?.type !== "daily" || !Array.isArray(reportData)) return [];
    if (!filterParams?.searchTerm) return reportData;
    return reportData.filter(
      (item: AttendanceRecord) =>
        (item.studentName || "")
          .toLowerCase()
          .includes(filterParams.searchTerm!.toLowerCase()) ||
        (item.studentId || "")
          .toLowerCase()
          .includes(filterParams.searchTerm!.toLowerCase())
    );
  }, [reportData, filterParams]);

  const reportTitle = useMemo(() => {
    if (!filterParams) return "Laporan Absensi";
    if (filterParams.type === "daily") {
      const dateObj = new Date(`${filterParams.date}T00:00:00`);
      return `Laporan Harian: ${dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`;
    } else {
      const dateObj = new Date(filterParams.year, filterParams.month - 1);
      return `Laporan Bulanan: ${dateObj.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })}`;
    }
  }, [filterParams]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    handleFetchReport({
      type: "daily",
      date: today,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });
  }, [handleFetchReport]);

  return (
    <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <Breadcrumb items={breadcrumbItems} />
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='mb-0'>Filter Laporan Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceReportForm
            onFetchReport={handleFetchReport}
            onExportExcel={handleExportExcel}
            onManualAdd={() => handleOpenModal(null)}
            isLoading={isLoading}
            isDataLoaded={
              reportData &&
              ((filterParams?.type === "daily" && reportData.length > 0) ||
                (filterParams?.type === "monthly" &&
                  reportData.report?.length > 0))
            }
          />
        </CardContent>
      </Card>

      <div className='mt-6'>
        {isLoading && (
          <div className='p-10 flex justify-center'>
            <Loader className='h-8 w-8 animate-spin' />
          </div>
        )}
        {!isLoading && error && (
          <div className='p-4 mt-6 bg-red-50 text-red-700 rounded-md'>
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        {!isLoading && !error && filterParams && reportData && (
          <div>
            <h2 className='text-xl font-semibold mb-4'>{reportTitle}</h2>
            {filterParams.type === "daily" && (
              <DailyReportTable
                reportData={filteredDailyData}
                onEdit={handleOpenModal}
              />
            )}
            {filterParams.type === "monthly" && (
              <MonthlyReportTable reportData={reportData} />
            )}

            {filterParams.type === "daily" &&
              filteredDailyData.length === 0 && (
                <p className='text-center text-gray-500 p-8'>Tidak ada data.</p>
              )}
            {filterParams.type === "monthly" &&
              (!reportData.report || reportData.report.length === 0) && (
                <p className='text-center text-gray-500 p-8'>Tidak ada data.</p>
              )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelModal}
        title={
          editingRecord
            ? `Edit Absensi - ${editingRecord.studentName}`
            : "Tambah Absensi Manual"
        }
      >
        <AttendanceEditForm
          initialData={
            editingRecord || {
              date:
                filterParams?.date || new Date().toISOString().split("T")[0],
            }
          }
          onSubmit={handleFormSubmit}
          onCancel={handleCancelModal}
          isLoading={isSubmitting}
          isManualAddMode={!editingRecord}
        />
      </Modal>
    </div>
  );
};

export default AttendanceReportPage;
