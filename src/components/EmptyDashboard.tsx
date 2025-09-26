import React from 'react';
import { BarChart3, Users, UserPlus, Settings, Sparkles } from 'lucide-react';

const EmptyDashboard: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Bienvenido a tu Dashboard!
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Tu dashboard está listo para ser configurado. Comienza explorando las diferentes secciones disponibles.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-800">Leads</h3>
            <p className="text-xs text-gray-500">Gestiona tus contactos</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <UserPlus className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-800">Agregar</h3>
            <p className="text-xs text-gray-500">Nuevos leads</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-800">Ventas</h3>
            <p className="text-xs text-gray-500">Analiza resultados</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <Settings className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-800">Config</h3>
            <p className="text-xs text-gray-500">Personaliza tu espacio</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Consejo:</span> Usa las pestañas superiores para navegar entre las diferentes secciones de tu dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;