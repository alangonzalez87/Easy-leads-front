import React from 'react';
import { TableroStats } from '../types';

interface PieChartProps {
  data: TableroStats[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  // Asegurarse de que los datos no sean vacíos y calculamos el total.
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Si el total es 0, no mostrar nada
  if (total === 0) return <div>No hay datos disponibles</div>;

  let currentAngle = 0;

  // Función para crear las rutas (segmentos) del gráfico
  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Coordenadas del círculo
    const radius = 1; // Radio
    const x1 = radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Creación de la ruta del gráfico (arc)
    return `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} viewBox="-1 -1 2 2" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const path = createPath(percentage, currentAngle);
            currentAngle += (percentage / 100) * 360;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="0.02"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* Centro del gráfico */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700">
              Tablero {item.tablero}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
