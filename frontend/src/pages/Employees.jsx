import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Download, Eye, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Employees() {
  const { t, lang } = useLanguage();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk UI
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null); // Untuk Modal Detail

  // State untuk Filter
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    gender: '',
    overTime: '',
    ageMin: '',
    ageMax: '',
    incomeMin: '',
    incomeMax: '',
    jobRole: '',    // Tambahan
    attrition: '',  // Tambahan
  });

  // Fungsi Fetch Data
  const fetchEmployees = () => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/employees`, {
      params: {
        search: filters.search,
        department: filters.department,
        gender: filters.gender,
        overTime: filters.overTime,
        ageMin: filters.ageMin,
        ageMax: filters.ageMax,
        incomeMin: filters.incomeMin,
        incomeMax: filters.incomeMax,
        jobRole: filters.jobRole,   // Tambahan
        attrition: filters.attrition, // Tambahan
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

  // Debounce untuk search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEmployees();
    }, 500);
    return () => clearTimeout(delay);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Export ke CSV
  const exportToCSV = () => {
    if (employees.length === 0) return alert('Tidak ada data untuk diexport');
    const headers = ['EmpNumber', 'JobRole', 'Department', 'Age', 'Gender', 'MonthlyIncome', 'YearsAtCompany', 'Attrition'];
    const csvRows = employees.map(emp => [
      emp.employeeNumber, `"${emp.jobRole}"`, `"${emp.department}"`, emp.age, emp.gender, emp.monthlyIncome, emp.yearsAtCompany, emp.attrition
    ]);
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
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
    <div className="relative">
      {/* Header & Tombol Aksi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-gray-700">{t('employees')}</h1>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="neumorphic-btn flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold"
          >
            <SlidersHorizontal size={18} /> {t('filter')}
          </button>
          
          <button 
            onClick={exportToCSV}
            className="neumorphic-btn flex items-center gap-2 px-4 py-2 text-green-600 font-semibold"
          >
            <Download size={18} /> {t('export')}
          </button>
        </div>
      </div>

      {/* Kotak Pencarian Utama */}
      <div className="neumorphic-inset flex items-center px-4 py-2 mb-6">
        <Search className="text-gray-400 mr-3" size={20} />
        <input 
          type="number" // Ubah ke type number karena ID berupa angka
          name="search"
          placeholder="Cari ID Karyawan (contoh: 1, 2, 3)..." 
          className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400"
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      {/* Tabel Data (8 Kolom Utama) */}
      <div className="neumorphic overflow-hidden p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-300/50">
              <th className="p-4 font-semibold">No</th>
              <th className="p-4 font-semibold">Job Role</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Age</th>
              <th className="p-4 font-semibold">Gender</th>
              <th className="p-4 font-semibold">Income</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center p-8 text-gray-500">Memuat data...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="8" className="text-center p-8 text-gray-500">Data tidak ditemukan.</td></tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={emp.id} className="border-b border-white/50 hover:bg-white/20 transition">
                  <td className="p-4 text-gray-500">{index + 1}</td>
                  <td className="p-4 font-bold text-gray-700">{emp.jobRole}</td>
                  <td className="p-4 text-gray-600">{emp.department}</td>
                  <td className="p-4 text-gray-600">{emp.age}</td>
                  <td className="p-4 text-gray-600">{emp.gender}</td>
                  <td className="p-4 font-semibold text-blue-600">${emp.monthlyIncome.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      emp.attrition === 'Yes' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {emp.attrition === 'Yes' ? 'Resign' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedEmp(emp)}
                      className="neumorphic-btn p-2 text-gray-600 hover:text-blue-600 inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye size={14} /> Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL DETAIL (REPORT CARD) ================= */}
      {selectedEmp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Kartu Laporan */}
          <div id="printable-card" className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative my-8">
            
            {/* Tombol Close & Print */}
            <div className="absolute top-6 right-6 flex gap-3 no-print">
              <button 
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2"
              >
                Cetak PDF
              </button>
              <button 
                onClick={() => setSelectedEmp(null)}
                className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg font-semibold shadow"
              >
                <X size={20} />
              </button>
            </div>

            {/* Header Profil */}
            <div className="border-b-2 border-gray-200 pb-6 mb-6 flex items-center gap-6">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black">
                {selectedEmp.gender === 'Male' ? 'M' : 'F'}
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-800">Karyawan ID: {selectedEmp.employeeNumber}</h1>
                <p className="text-lg text-blue-600 font-bold">{selectedEmp.jobRole}</p>
                <p className="text-gray-500 font-medium">{selectedEmp.department} Department</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedEmp.attrition === 'Yes' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  Status: {selectedEmp.attrition === 'Yes' ? 'Resigned (Keluar)' : 'Active (Aktif)'}
                </span>
              </div>
            </div>

            {/* Grid Detail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Kolom 1: Personal */}
              <div>
                <h3 className="font-bold text-lg border-b pb-2 mb-3">Data Pribadi</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Usia:</strong> {selectedEmp.age} Tahun</li>
                  <li><strong>Gender:</strong> {selectedEmp.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}</li>
                  <li><strong>Status Pernikahan:</strong> {selectedEmp.maritalStatus}</li>
                  <li><strong>Pendidikan:</strong> Level {selectedEmp.education} ({selectedEmp.educationField})</li>
                  <li><strong>Jarak ke Kantor:</strong> {selectedEmp.distanceFromHome} km</li>
                </ul>
              </div>

              {/* Kolom 2: Pekerjaan */}
              <div>
                <h3 className="font-bold text-lg border-b pb-2 mb-3">Data Pekerjaan</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Job Level:</strong> {selectedEmp.jobLevel}</li>
                  <li><strong>Total Pengalaman:</strong> {selectedEmp.totalWorkingYears} Tahun</li>
                  <li><strong>Masa Kerja di Sini:</strong> {selectedEmp.yearsAtCompany} Tahun</li>
                  <li><strong>Perusahaan Sebelumnya:</strong> {selectedEmp.numCompaniesWorked} Perusahaan</li>
                  <li><strong>Sering Lembur (OverTime):</strong> {selectedEmp.overTime === 'Yes' ? 'Ya' : 'Tidak'}</li>
                  <li><strong>Business Travel:</strong> {selectedEmp.businessTravel.replace('_', ' ')}</li>
                </ul>
              </div>

              {/* Kolom 3: Finansial & Kepuasan */}
              <div>
                <h3 className="font-bold text-lg border-b pb-2 mb-3">Finansial & Penilaian</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Gaji Bulanan:</strong> <span className="text-blue-600 font-bold">${selectedEmp.monthlyIncome.toLocaleString()}</span></li>
                  <li><strong>Kenaikan Gaji Terakhir:</strong> {selectedEmp.percentSalaryHike}%</li>
                  <li><strong>Stock Option:</strong> Level {selectedEmp.stockOptionLevel}</li>
                  <li><strong>Performance Rating:</strong> {selectedEmp.performanceRating} / 4</li>
                  <li><strong>Job Satisfaction:</strong> {selectedEmp.jobSatisfaction} / 4</li>
                  <li><strong>Work-Life Balance:</strong> {selectedEmp.workLifeBalance} / 4</li>
                </ul>
              </div>

            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400 no-print">
              *Dokumen ini dihasilkan secara otomatis oleh HR System.
            </div>
          </div>
        </div>
      )}

      {/* ================= DRAWER ADVANCED FILTER ================= */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-neu-base shadow-2xl transform transition-transform duration-300 z-40 p-6 ${
        isFilterOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-700">{t('filter')}</h2>
          <button onClick={() => setIsFilterOpen(false)} className="neumorphic-btn p-2 text-red-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Department</label>
            <select name="department" value={filters.department} onChange={handleFilterChange} className="neumorphic-inset w-full p-2 outline-none text-sm">
              <option value="">All</option>
              <option value="Sales">Sales</option>
              <option value="Research & Development">R&D</option>
              <option value="Human Resources">HR</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Gender</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="neumorphic-inset w-full p-2 outline-none text-sm">
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">OverTime</label>
            <select name="overTime" value={filters.overTime} onChange={handleFilterChange} className="neumorphic-inset w-full p-2 outline-none text-sm">
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
            <select name="attrition" value={filters.attrition} onChange={handleFilterChange} className="neumorphic-inset w-full p-2 outline-none text-sm">
              <option value="">Semua Status</option>
              <option value="Yes">Resign</option>
              <option value="No">Aktif</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Job Role</label>
            <select name="jobRole" value={filters.jobRole} onChange={handleFilterChange} className="neumorphic-inset w-full p-2 outline-none text-sm">
              <option value="">Semua Role</option>
              <option value="Sales Executive">Sales Executive</option>
              <option value="Research Scientist">Research Scientist</option>
              <option value="Laboratory Technician">Laboratory Technician</option>
              <option value="Manufacturing Director">Manufacturing Director</option>
              <option value="Healthcare Representative">Healthcare Representative</option>
              <option value="Manager">Manager</option>
              <option value="Sales Representative">Sales Representative</option>
              <option value="Research Director">Research Director</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Age Range</label>
            <div className="flex gap-2">
              <input type="number" name="ageMin" placeholder="Min" value={filters.ageMin} onChange={handleFilterChange} className="neumorphic-inset w-1/2 p-2 outline-none text-sm" />
              <input type="number" name="ageMax" placeholder="Max" value={filters.ageMax} onChange={handleFilterChange} className="neumorphic-inset w-1/2 p-2 outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Income Range ($)</label>
            <div className="flex gap-2">
              <input type="number" name="incomeMin" placeholder="Min" value={filters.incomeMin} onChange={handleFilterChange} className="neumorphic-inset w-1/2 p-2 outline-none text-sm" />
              <input type="number" name="incomeMax" placeholder="Max" value={filters.incomeMax} onChange={handleFilterChange} className="neumorphic-inset w-1/2 p-2 outline-none text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay saat filter terbuka */}
      {isFilterOpen && (
        <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black/20 z-30"></div>
      )}
    </div>
  );
}