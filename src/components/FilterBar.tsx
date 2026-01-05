import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  tableros: string[];
  vendedores: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  tableros,
  vendedores
}) => {
  const clearFilters = () => {
    onFilterChange({
      tablero: '',
      vendedor: '',
      estado: ''
    });
  };

  const hasActiveFilters = filters.tablero || filters.vendedor || filters.estado;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tablero
          </label>
          <select
            value={filters.tablero}
            onChange={(e) => onFilterChange({ ...filters, tablero: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tableros</option>
            {tableros.map((tablero) => (
              <option key={tablero} value={tablero}>
                {tablero}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendedor
          </label>
          <select
            value={filters.vendedor}
            onChange={(e) => onFilterChange({ ...filters, vendedor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los vendedores</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor} value={vendedor}>
                {vendedor}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filters.estado}
            onChange={(e) => onFilterChange({ ...filters, estado: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="pendiente">Pendiente</option>
            <option value="pausado">Pausado</option>
          </select>
        </div>
      </div>
    </div>
  );
};
