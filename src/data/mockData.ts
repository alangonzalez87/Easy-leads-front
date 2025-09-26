import { Lead } from '../types';
import { format, addDays, subDays } from 'date-fns';

const today = new Date();

export const mockLeads: Lead[] = [
  {
    id: '1',
    nombre: 'María García',
    email: 'maria.garcia@email.com',
    tel: '+34 600 123 456',
    tablero: 'Inmobiliario',
    estado: 'activo',
    tiempo: 15,
    finalizaDia: format(addDays(today, 2), 'yyyy-MM-dd'),
    vendedor: 'Carlos Ruiz'
  },
  {
    id: '2',
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    tel: '+34 600 234 567',
    tablero: 'Tecnología',
    estado: 'activo',
    tiempo: 30,
    finalizaDia: format(addDays(today, 5), 'yyyy-MM-dd'),
    vendedor: 'Ana López'
  },
  {
    id: '3',
    nombre: 'Laura Martín',
    email: 'laura.martin@email.com',
    tablero: 'Marketing',
    estado: 'pausado',
    tiempo: 7,
    finalizaDia: format(subDays(today, 1), 'yyyy-MM-dd'),
    vendedor: 'Carlos Ruiz'
  },
  {
    id: '4',
    nombre: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    tel: '+34 600 345 678',
    tablero: 'Inmobiliario',
    estado: 'activo',
    tiempo: 45,
    finalizaDia: format(addDays(today, 1), 'yyyy-MM-dd'),
    vendedor: 'Ana López'
  },
  {
    id: '5',
    nombre: 'Carmen Vega',
    email: 'carmen.vega@email.com',
    tablero: 'Salud',
    estado: 'completado',
    tiempo: 60,
    finalizaDia: format(subDays(today, 2), 'yyyy-MM-dd'),
    vendedor: 'Pedro González'
  },
  {
    id: '6',
    nombre: 'Diego Torres',
    email: 'diego.torres@email.com',
    tel: '+34 600 456 789',
    tablero: 'Tecnología',
    estado: 'activo',
    tiempo: 20,
    finalizaDia: format(addDays(today, 3), 'yyyy-MM-dd'),
    vendedor: 'Carlos Ruiz'
  },
  {
    id: '7',
    nombre: 'Elena Morales',
    email: 'elena.morales@email.com',
    tablero: 'Marketing',
    estado: 'inactivo',
    tiempo: 10,
    finalizaDia: format(subDays(today, 3), 'yyyy-MM-dd'),
    vendedor: 'Ana López'
  },
  {
    id: '8',
    nombre: 'Fernando Castro',
    email: 'fernando.castro@email.com',
    tel: '+34 600 567 890',
    tablero: 'Salud',
    estado: 'activo',
    tiempo: 25,
    finalizaDia: format(today, 'yyyy-MM-dd'),
    vendedor: 'Pedro González'
  }
];

export const getTableros = (): string[] => {
  return Array.from(new Set(mockLeads.map(lead => lead.tablero)));
};

export const getVendedores = (): string[] => {
  return Array.from(new Set(mockLeads.map(lead => lead.vendedor)));
};