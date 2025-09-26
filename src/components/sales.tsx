import React from 'react';
import { TrendingUp, DollarSign, Calendar, Target, Award, BarChart3, Sparkles, Zap, Star } from 'lucide-react';

export const Sales: React.FC = () => {
  // Datos de ejemplo - aquí irá la lógica real después
  const salesData = {
    monthlyTotal: 45000,
    dailyAverage: 1500,
    monthlyGoal: 60000,
    subscriptions: {
      monthly: { count: 5, revenue: 15000 }, // 5 * 3000
      quarterly: { count: 4, revenue: 28000 }, // 4 * 7000
      yearly: { count: 1, revenue: 10000 } // 1 * 10000
    }
  };

  const progressPercentage = (salesData.monthlyTotal / salesData.monthlyGoal) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center">
              <Sparkles className="h-10 w-10 mr-4" />
              Ventas del Mes
            </h1>
            <p className="text-green-100 mt-2 text-lg">Resumen de ingresos y suscripciones</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl">
            <TrendingUp className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total del mes */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="bg-white/20 p-4 rounded-xl mr-4">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
            <div>
              <p className="text-emerald-100 font-medium text-sm">Total del Mes</p>
              <p className="text-3xl font-bold">
                ${salesData.monthlyTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Promedio diario */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="bg-white/20 p-4 rounded-xl mr-4">
              <Calendar className="h-12 w-12 text-white" />
            </div>
            <div>
              <p className="text-blue-100 font-medium text-sm">Promedio Diario</p>
              <p className="text-3xl font-bold">
                ${salesData.dailyAverage.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Meta mensual */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="bg-white/20 p-4 rounded-xl mr-4">
              <Target className="h-12 w-12 text-white" />
            </div>
            <div>
              <p className="text-orange-100 font-medium text-sm">Meta Mensual</p>
              <p className="text-3xl font-bold">
                ${salesData.monthlyGoal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <div className="bg-white/20 p-4 rounded-xl mr-4">
              <Star className="h-12 w-12 text-white" />
            </div>
            <div>
              <p className="text-purple-100 font-medium text-sm">Progreso</p>
              <p className="text-3xl font-bold">
                {progressPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Zap className="h-7 w-7 text-yellow-500 mr-3" />
            Progreso hacia la Meta
          </h2>
          <span className="text-lg font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
            ${salesData.monthlyTotal.toLocaleString()} / ${salesData.monthlyGoal.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 h-6 rounded-full transition-all duration-1000 shadow-lg"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-lg text-gray-600 mt-4 font-medium">
          Faltan ${(salesData.monthlyGoal - salesData.monthlyTotal).toLocaleString()} para alcanzar la meta
        </p>
      </div>

      {/* Desglose por tipo de suscripción */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suscripciones mensuales */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-xl border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-800">Suscripciones Mensuales</h3>
            <div className="bg-blue-500 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Cantidad:</span>
              <span className="font-bold text-blue-800 text-lg">{salesData.subscriptions.monthly.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Precio unitario:</span>
              <span className="font-bold text-blue-800 text-lg">$3,000</span>
            </div>
            <div className="flex justify-between border-t-2 border-blue-200 pt-4">
              <span className="text-blue-800 font-bold">Total:</span>
              <span className="font-bold text-blue-600 text-xl">
                ${salesData.subscriptions.monthly.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Suscripciones trimestrales */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-xl border-2 border-green-200 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-800">Suscripciones Trimestrales</h3>
            <div className="bg-green-500 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">Cantidad:</span>
              <span className="font-bold text-green-800 text-lg">{salesData.subscriptions.quarterly.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700 font-medium">Precio unitario:</span>
              <span className="font-bold text-green-800 text-lg">$7,000</span>
            </div>
            <div className="flex justify-between border-t-2 border-green-200 pt-4">
              <span className="text-green-800 font-bold">Total:</span>
              <span className="font-bold text-green-600 text-xl">
                ${salesData.subscriptions.quarterly.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Suscripciones anuales */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl shadow-xl border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-800">Suscripciones Anuales</h3>
            <div className="bg-purple-500 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-purple-700 font-medium">Cantidad:</span>
              <span className="font-bold text-purple-800 text-lg">{salesData.subscriptions.yearly.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700 font-medium">Precio unitario:</span>
              <span className="font-bold text-purple-800 text-lg">$10,000</span>
            </div>
            <div className="flex justify-between border-t-2 border-purple-200 pt-4">
              <span className="text-purple-800 font-bold">Total:</span>
              <span className="font-bold text-purple-600 text-xl">
                ${salesData.subscriptions.yearly.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de ventas recientes */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="h-7 w-7 text-indigo-500 mr-3" />
          Ventas Recientes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-bold text-gray-700 text-lg">Fecha</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 text-lg">Cliente</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 text-lg">Tipo</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 text-lg">Monto</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 text-lg">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <td className="py-4 px-6 font-medium">15/12/2024</td>
                <td className="py-4 px-6 font-semibold text-gray-800">Juan Pérez</td>
                <td className="py-4 px-6">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Mensual
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-lg text-green-600">$3,000</td>
                <td className="py-4 px-6">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Pagado
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                <td className="py-4 px-6 font-medium">14/12/2024</td>
                <td className="py-4 px-6 font-semibold text-gray-800">María García</td>
                <td className="py-4 px-6">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Trimestral
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-lg text-green-600">$7,000</td>
                <td className="py-4 px-6">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Pagado
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                <td className="py-4 px-6 font-medium">13/12/2024</td>
                <td className="py-4 px-6 font-semibold text-gray-800">Carlos López</td>
                <td className="py-4 px-6">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Anual
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-lg text-green-600">$10,000</td>
                <td className="py-4 px-6">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Pagado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};