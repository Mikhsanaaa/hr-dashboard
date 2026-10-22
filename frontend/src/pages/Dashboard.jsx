import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

// Komponen UI untuk Insight Kontekstual
function InlineInsight({ type, text }) {
  if (!text) return null;

  const styles = {
    danger: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };
  
  const icons = {
    danger: '🚨',
    warning: '⚠️',
    info: '💡',
    success: '✅'
  };

  return (
    <div className={`mt-4 p-3 rounded-lg border text-sm font-medium flex gap-3 items-start ${styles[type]}`}>
      <span className="text-lg">{icons[type]}</span>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('demografi');
  const [statusFilter, setStatusFilter] = useState('All'); 

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/employees`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <p className="text-center mt-20 text-xl font-bold text-blue-600 animate-pulse">Menganalisis Data...</p>;

  // Filter Data
  const filteredData = data.filter(emp => {
    if (statusFilter === 'All') return true;
    return emp.attrition === statusFilter;
  });

  // Helper Agregasi
  const getCountData = (key) => {
    const counts = {};
    filteredData.forEach(item => {
      const val = item[key] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, total: counts[name] }));
  };

  const getBinnedData = (key, binSize, labelSuffix) => {
    const bins = {};
    filteredData.forEach(item => {
      const val = item[key];
      const binStart = Math.floor(val / binSize) * binSize;
      const binLabel = `${binStart}-${binStart + binSize - 1} ${labelSuffix}`;
      bins[binLabel] = (bins[binLabel] || 0) + 1;
    });
    return Object.keys(bins)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(name => ({ name, total: bins[name] }));
  };

  // Statistik
  const stats = {
    total: filteredData.length,
    attritionCount: filteredData.filter(d => d.attrition === 'Yes').length,
    activeCount: filteredData.filter(d => d.attrition === 'No').length,
  };

  const turnoverRate = statusFilter === 'Yes' ? 100 : 
                       statusFilter === 'No' ? 0 : 
                       ((stats.attritionCount / data.length) * 100).toFixed(1);

  // Data untuk Grafik
  const ageData = getBinnedData('age', 5, 'Thn');
  const genderData = getCountData('gender');
  const maritalData = getCountData('maritalStatus');
  const distanceData = getBinnedData('distanceFromHome', 5, 'km');

  const deptData = getCountData('department');
  const jobRoleData = getCountData('jobRole');
  const overTimeData = getCountData('overTime');
  
  const incomeData = getBinnedData('monthlyIncome', 2000, '$');
  const stockData = getCountData('stockOptionLevel');
  const hikeData = getCountData('percentSalaryHike');

  const jobSatData = getCountData('jobSatisfaction');
  const wlbData = getCountData('workLifeBalance');
  const envSatData = getCountData('environmentSatisfaction');
  const perfData = getCountData('performanceRating');

  // Perhitungan untuk Insight
  const overtimePct = ((filteredData.filter(d => d.overTime === 'Yes').length / filteredData.length) * 100).toFixed(1);
  const badWlbPct = ((filteredData.filter(d => d.workLifeBalance === 1).length / filteredData.length) * 100).toFixed(1);
  const avgIncome = filteredData.reduce((acc, curr) => acc + curr.monthlyIncome, 0) / (filteredData.length || 1);
  const underpaidHighPerformers = filteredData.filter(d => d.performanceRating === 4 && d.monthlyIncome < avgIncome).length;
  const avgDistance = (filteredData.reduce((acc, curr) => acc + curr.distanceFromHome, 0) / (filteredData.length || 1)).toFixed(1);

  // Komponen UI Kecil
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 font-bold text-sm transition-all duration-300 ${
        activeTab === id ? 'neumorphic-inset text-blue-600' : 'text-gray-500 hover:text-blue-500'
      }`}
    >
      {label}
    </button>
  );

  const StatusToggle = ({ id, label }) => (
    <button
      onClick={() => setStatusFilter(id)}
      className={`px-4 py-2 font-bold text-xs rounded-lg transition-all duration-300 ${
        statusFilter === id ? 'neumorphic text-blue-600 bg-white/50' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Header & Filter Status */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-700">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Analisis profil tenaga kerja berdasarkan status</p>
        </div>
        
        <div className="neumorphic-inset p-1.5 flex gap-2 w-full xl:w-auto">
          <StatusToggle id="All" label="Semua Karyawan" />
          <StatusToggle id="No" label="Aktif" />
          <StatusToggle id="Yes" label="Resign" />
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="neumorphic p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">
            {statusFilter === 'All' ? 'Total Karyawan' : statusFilter === 'No' ? 'Total Aktif' : 'Total Resign'}
          </p>
          <p className={`text-4xl font-black ${statusFilter === 'Yes' ? 'text-red-500' : 'text-blue-600'}`}>
            {stats.total}
          </p>
        </div>
        <div className="neumorphic p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Turnover Rate</p>
          <p className="text-4xl font-black text-orange-500">{turnoverRate}%</p>
        </div>
        <div className="neumorphic p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Rasio Status</p>
          <div className="flex items-center gap-4">
            <p className="text-xl font-bold text-green-600">{stats.activeCount} Aktif</p>
            <div className="h-6 w-px bg-gray-300"></div>
            <p className="text-xl font-bold text-red-500">{stats.attritionCount} Resign</p>
          </div>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="neumorphic p-2 mb-8 flex gap-2 overflow-x-auto">
        <TabButton id="demografi" label="1. Demografi" />
        <TabButton id="pekerjaan" label="2. Pekerjaan & Karier" />
        <TabButton id="finansial" label="3. Finansial" />
        <TabButton id="kepuasan" label="4. Kepuasan & Performa" />
      </div>

      {/* ================= KONTEN TAB ================= */}
      
      {/* TAB 1: DEMOGRAFI */}
      {activeTab === 'demografi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Distribusi Usia</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Rasio Gender</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {genderData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Status Pernikahan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={maritalData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {maritalData.map((e, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Jarak Rumah ke Kantor</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InlineInsight 
              type="info" 
              text={`Rata-rata karyawan menempuh ${avgDistance} km setiap hari. Pertimbangkan kebijakan WFH hibrida untuk mengurangi risiko kelelahan (burnout) akibat perjalanan.`}
            />
          </div>
        </div>
      )}

      {/* TAB 2: PEKERJAAN */}
      {activeTab === 'pekerjaan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Sebaran Departemen</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Pengaruh Lembur (OverTime)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={overTimeData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {overTimeData.map((e, i) => <Cell key={i} fill={COLORS[(i+1) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <InlineInsight 
              type={overtimePct > 25 ? "warning" : "success"} 
              text={`Berdasarkan grafik di atas, terdapat ${overtimePct}% karyawan yang sering lembur. Data historis IBM menunjukkan lembur berlebih berkorelasi kuat dengan tingginya risiko resign.`}
            />
          </div>

          <div className="neumorphic p-6 md:col-span-2">
            <h3 className="font-bold text-gray-700 mb-4">Sebaran Job Role (Posisi)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobRoleData} layout="vertical" margin={{ left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 11}} width={150} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINANSIAL */}
      {activeTab === 'finansial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neumorphic p-6 md:col-span-2">
            <h3 className="font-bold text-gray-700 mb-4">Distribusi Gaji Bulanan (Monthly Income)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InlineInsight 
              type="info" 
              text={`Ditemukan ${underpaidHighPerformers} karyawan dengan performa tertinggi (Rating 4) namun gajinya di bawah rata-rata departemen. Segera lakukan penyesuaian gaji (Retention Strategy) untuk mencegah mereka diambil kompetitor.`}
            />
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Tingkat Kenaikan Gaji (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hikeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Level Stock Option</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KEPUASAN */}
      {activeTab === 'kepuasan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Tingkat Kepuasan Kerja (1-4)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobSatData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Work-Life Balance (1-4)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wlbData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InlineInsight 
              type={badWlbPct > 15 ? "danger" : "success"} 
              text={`Terdapat ${badWlbPct}% karyawan dengan skor WLB terendah (Skor 1). Ini adalah indikator utama terjadinya burnout. HR disarankan segera melakukan program konseling atau evaluasi shift.`}
            />
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Performance Rating (1-4)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={perfData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {perfData.map((e, i) => <Cell key={i} fill={COLORS[(i+3) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="neumorphic p-6">
            <h3 className="font-bold text-gray-700 mb-4">Kepuasan Lingkungan Kerja (1-4)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={envSatData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}