import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Leaves() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/leaves/stats`)
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
  }, []);

  if (!stats) return <p className="text-center mt-20 text-xl">Loading data cuti...</p>;

  // Format data untuk Pie Chart
  const leaveChartData = stats.leaveTypes.map((item) => ({
    name: item.leaveType,
    value: item._count.id,
  }));
  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Cuti</h1>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Total Pengajuan Cuti</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Menunggu Persetujuan (Pending)</h2>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pendingRequests}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Tipe Cuti */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tipe Cuti</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {leaveChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel Pengajuan Terbaru */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Menunggu Persetujuan Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-3 font-semibold">Jabatan</th>
                  <th className="p-3 font-semibold">Departemen</th>
                  <th className="p-3 font-semibold">Tipe Cuti</th>
                  <th className="p-3 font-semibold">Tanggal</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPending.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{req.employee.jobRole}</td>
                    <td className="p-3 text-gray-600">{req.employee.department}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 text-sm">
                      {new Date(req.startDate).toLocaleDateString('id-ID')} - {new Date(req.endDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-semibold">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}