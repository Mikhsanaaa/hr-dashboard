import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari API
  const fetchEmployees = () => {
    setLoading(true);
    // Mengirim parameter search dan department ke backend
    // KODE BARU
        axios.get(`${import.meta.env.VITE_API_URL}/employees`, {
        params: {
            search: search,
            department: department
        }
        })
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  // Panggil API setiap kali search atau department berubah
  useEffect(() => {
    // Debounce sederhana (tunggu 500ms setelah user berhenti mengetik)
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, department]);

    const exportToCSV = () => {
    if (employees.length === 0) return alert('Tidak ada data untuk diexport');

    // 1. Tentukan Header Kolom
    const headers = ['Employee Number', 'Job Role', 'Department', 'Age', 'Gender', 'Monthly Income', 'Attrition'];
    
    // 2. Format data menjadi baris CSV
    const csvRows = employees.map(emp => [
      emp.employeeNumber,
      `"${emp.jobRole}"`, // Pakai kutip untuk teks agar aman jika ada koma
      `"${emp.department}"`,
      emp.age,
      emp.gender,
      emp.monthlyIncome,
      emp.attrition
    ]);

    // 3. Gabungkan header dan data
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    // 4. Buat file Blob dan trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Data_Karyawan_HR.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
            <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Karyawan</h1>
        <button 
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
        >
          📥 Export ke CSV
        </button>
      </div>
      
      {/* Area Filter & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Cari jabatan (contoh: Sales Executive)..." 
          className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="border border-gray-300 rounded-lg p-2 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Semua Departemen</option>
          <option value="Sales">Sales</option>
          <option value="Research & Development">Research & Development</option>
          <option value="Human Resources">Human Resources</option>
        </select>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-semibold">No</th>
              <th className="p-4 font-semibold">Jabatan</th>
              <th className="p-4 font-semibold">Departemen</th>
              <th className="p-4 font-semibold">Usia</th>
              <th className="p-4 font-semibold">Gender</th>
              <th className="p-4 font-semibold">Gaji (Bulanan)</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center p-6 text-gray-500">Memuat data...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-6 text-gray-500">Data tidak ditemukan.</td></tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">{emp.jobRole}</td>
                  <td className="p-4 text-gray-600">{emp.department}</td>
                  <td className="p-4 text-gray-600">{emp.age}</td>
                  <td className="p-4 text-gray-600">{emp.gender}</td>
                  <td className="p-4 text-gray-600">${emp.monthlyIncome.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emp.attrition === 'Yes' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {emp.attrition === 'Yes' ? 'Resign' : 'Aktif'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-4">*Menampilkan maksimal 100 data teratas untuk performa.</p>
    </div>
  );
}