import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import type { Asset } from '../types';

interface StatisticsPanelProps {
  assets: Asset[];
}

const COLORS = {
  Transformateur: '#0d9488',
  Ligne: '#0369a1',
  Poste: '#b45309',
  Compteur: '#7e22ce',
  Générateur: '#d97706',
};

const STATUS_COLORS = {
  Actif: '#10b981',
  'En maintenance': '#f59e0b',
  'Hors service': '#ef4444',
  'En alerte': '#f97316',
};

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ assets }) => {
  const typeDistribution = React.useMemo(() => {
    const distribution: Record<string, number> = {};
    assets.forEach(asset => {
      distribution[asset.type] = (distribution[asset.type] || 0) + 1;
    });
    return Object.entries(distribution).map(([type, count]) => ({
      name: type,
      value: count,
      color: COLORS[type as keyof typeof COLORS],
    }));
  }, [assets]);

  const statusDistribution = React.useMemo(() => {
    const distribution: Record<string, number> = {};
    assets.forEach(asset => {
      distribution[asset.status] = (distribution[asset.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
    }));
  }, [assets]);

  const criticalityStats = React.useMemo(() => {
    const stats = { Haute: 0, Moyenne: 0, Faible: 0 };
    assets.forEach(asset => {
      stats[asset.criticality]++;
    });
    return [
      { name: 'Haute', value: stats.Haute, color: '#ef4444' },
      { name: 'Moyenne', value: stats.Moyenne, color: '#f59e0b' },
      { name: 'Faible', value: stats.Faible, color: '#10b981' },
    ];
  }, [assets]);

  const alertCount = assets.reduce((sum, asset) => sum + (asset.alerts?.length || 0), 0);
  const maintenanceCount = assets.filter(asset => asset.status === 'En maintenance').length;
  const activeCount = assets.filter(asset => asset.status === 'Actif').length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Actifs</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Maintenance</p>
              <p className="text-2xl font-bold">{maintenanceCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Alertes</p>
              <p className="text-2xl font-bold">{alertCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-2xl font-bold">{assets.length}</p>
            </div>
            <Zap className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-white/30 dark:border-slate-700/30">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Répartition par Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-white/30 dark:border-slate-700/30">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Statuts des Actifs
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Criticality Overview */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-white/30 dark:border-slate-700/30">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
          Criticité des Actifs
        </h3>
        <div className="space-y-3">
          {criticalityStats.map((item) => {
            const total = assets.length;
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.value}</span>
                  <div className="w-20 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
