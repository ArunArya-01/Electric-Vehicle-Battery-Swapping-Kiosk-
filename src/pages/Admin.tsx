// src/pages/Admin.tsx

import { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from '@/components/Navbar';
import { useKiosks } from '@/context/KioskContext';
import type { Kiosk } from './Kiosks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, AlertTriangle } from 'lucide-react';

// --- 1. REGISTER THE NEW CHART TYPES ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our chart data
type ChartData = {
  labels: string[];
  datasets: any[];
};

// --- 2. KPI CARD COMPONENT ---
// A small helper component to make the KPI cards look good
interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}
const KpiCard = ({ title, value, icon }: KpiCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function AdminPage() {
  // --- 3. GET LIVE DATA & HISTORY FROM THE HOOK ---
  const { liveKiosks, history } = useKiosks();

  // --- 4. STATE FOR ALL OUR CHARTS & KPIs ---
  const [kpiData, setKpiData] = useState({ total: 0, available: 0, operational: 0 });
  const [barChartData, setBarChartData] = useState<ChartData | null>(null);
  const [doughnutChartData, setDoughnutChartData] = useState<ChartData | null>(null);
  const [lineChartData, setLineChartData] = useState<ChartData | null>(null);

  // --- 5. A SINGLE useEffect TO UPDATE EVERYTHING ---
  useEffect(() => {
    // This will now re-run every 3 seconds when liveKiosks or history changes
    
    // --- Calculate KPIs ---
    const totalBatteries = liveKiosks.reduce((sum, k) => sum + k.totalBatteries, 0);
    const availableBatteries = liveKiosks.reduce((sum, k) => sum + k.availableBatteries, 0);
    const operationalKiosks = liveKiosks.filter(k => k.status === 'operational').length;
    setKpiData({ 
      total: totalBatteries, 
      available: availableBatteries, 
      operational: operationalKiosks 
    });

    // --- Format Bar Chart (Your original chart) ---
    setBarChartData({
      labels: liveKiosks.map((kiosk: Kiosk) => kiosk.name),
      datasets: [
        {
          label: 'Available Batteries',
          data: liveKiosks.map((kiosk: Kiosk) => kiosk.availableBatteries),
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green
        },
        {
          label: 'Used Batteries',
          data: liveKiosks.map((kiosk: Kiosk) => kiosk.totalBatteries - kiosk.availableBatteries),
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
        },
      ],
    });

    // --- Format Doughnut Chart ---
    const busyKiosks = liveKiosks.filter(k => k.status === 'busy').length;
    const maintenanceKiosks = liveKiosks.filter(k => k.status === 'maintenance').length;
    setDoughnutChartData({
      labels: ['Operational', 'Busy', 'Maintenance'],
      datasets: [{
        label: 'Kiosk Status',
        data: [operationalKiosks, busyKiosks, maintenanceKiosks],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(255, 99, 132, 0.6)',  // Red
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      }],
    });

    // --- Format Line Chart ---
    setLineChartData({
      labels: history.map(h => h.time), // The time (e.g., "10:30:05")
      datasets: [{
        label: 'Total Available Batteries',
        data: history.map(h => h.totalAvailable), // The number
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1, // Makes the line smooth
      }],
    });

  }, [liveKiosks, history]); // Re-run whenever the live data changes

  // --- 6. CHART OPTIONS (REUSABLE) ---
  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Live Kiosk Inventory' } },
    scales: { y: { beginAtZero: true, stacked: true }, x: { stacked: true } },
    animation: { duration: 500 },
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Kiosk Status' } },
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Network-Wide Battery Level (Live)' } },
    scales: { y: { beginAtZero: true } },
    animation: { duration: 0 }, // No animation for a smoother live feed
  };

  // --- 7. NEW JSX LAYOUT ---
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        
        {/* --- KPI CARDS --- */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <KpiCard 
            title="Total Available Batteries" 
            value={`${kpiData.available} / ${kpiData.total}`}
            icon={<Battery className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard 
            title="Operational Kiosks" 
            value={`${kpiData.operational} / ${liveKiosks.length}`}
            icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard 
            title="Network Capacity" 
            value={`${((kpiData.available / kpiData.total) * 100 || 0).toFixed(0)}%`}
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* --- CHARTS GRID --- */}
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* Doughnut Chart (1/3 width) */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div style={{ height: '300px', position: 'relative' }}>
                {doughnutChartData ? (
                  <Doughnut options={doughnutOptions} data={doughnutChartData} />
                ) : <p>Loading...</p>}
              </div>
            </CardContent>
          </Card>
          
          {/* Bar Chart (2/3 width) */}
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div style={{ height: '300px', position: 'relative' }}>
                {barChartData ? (
                  <Bar options={barOptions} data={barChartData} />
                ) : <p>Loading...</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- FULL-WIDTH LINE CHART --- */}
        <Card>
          <CardContent className="p-4">
            <div style={{ height: '300px', position: 'relative' }}>
              {lineChartData ? (
                <Line options={lineOptions} data={lineChartData} />
              ) : <p>Loading...</p>}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}