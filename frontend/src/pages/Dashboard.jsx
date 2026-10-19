import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    </div>
  );
}