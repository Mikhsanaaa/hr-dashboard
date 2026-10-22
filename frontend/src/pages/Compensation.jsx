import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Compensation() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/compensation/stats`)
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
  }, []);

  if (!stats) return <p className="text-center mt-20 text-xl">Loading data kompensasi...</p>;

  // Format data untuk Bar Chart (Gaji per Departemen)
  const chartData = stats.salaryPerDept.map((dept) => ({
    name: dept.department,
    TotalGaji: dept._sum.monthlyIncome,
    RataRata: Math.round(dept._avg.monthlyIncome),
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kompensasi & Anggaran</h1>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Total Beban Gaji / Bulan</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ${stats.totalSalary.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Rata-rata Gaji Karyawan</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${Math.round(stats.averageSalary).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-gray-500 text-sm font-medium">Estimasi Biaya Lembur</h2>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            ${Math.round(stats.estimatedOverTimeCost).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">*Estimasi 15% dari gaji (Karyawan: {stats.overTimeCount} org)</p>
        </div>
      </div>

      {/* Grafik Gaji per Departemen */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Alokasi Gaji per Departemen</h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="TotalGaji" name="Total Pengeluaran" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="RataRata" name="Rata-rata Gaji" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}