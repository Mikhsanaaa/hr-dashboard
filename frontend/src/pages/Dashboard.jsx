import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/employees/stats`)
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
  }, []);

  if (!stats) return <p className="text-center mt-20 text-xl">Loading data...</p>;

  // Format data departemen untuk Recharts
  const chartData = stats.departments.map((dept) => ({
    name: dept.department,
    total: dept._count.id,
  }));

    // Format data untuk Pie Chart
  const attritionData = [
    { name: 'Aktif', value: stats.activeEmployees },
    { name: 'Resign', value: stats.attritionCount },
  ];
  const COLORS_ATTRITION = ['#22c55e', '#ef4444']; // Hijau, Merah

  const genderData = stats.genderStats.map((g) => ({
    name: g.gender,
    value: g._count.id,
  }));
  const COLORS_GENDER = ['#3b82f6', '#ec4899']; // Biru, Pink

  const overTimeData = stats.overTimeStats.map((o) => ({
    name: o.overTime === 'Yes' ? 'Lembur' : 'Tidak Lembur',
    total: o._count.id,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Total Karyawan</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Karyawan Aktif</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.activeEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Turnover Rate</h2>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.turnoverRate}%</p>
        </div>
      </div>

      {/* Grafik */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Distribusi Karyawan per Departemen</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
            {/* Baris Grafik Tambahan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Pie Chart Status Karyawan */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Status Karyawan</h2>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attritionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {attritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_ATTRITION[index % COLORS_ATTRITION.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Gender */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Distribusi Gender</h2>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart OverTime */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Pengaruh Lembur (OverTime) terhadap Karyawan</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overTimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}