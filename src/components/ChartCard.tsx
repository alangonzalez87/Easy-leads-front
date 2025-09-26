import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Lead } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartCardProps {
  leads: Lead[];
  title: string;
  dataKey: keyof Lead;
}

export const ChartCard: React.FC<ChartCardProps> = ({ leads, title, dataKey }) => {
  const processData = () => {
    const counts = leads.reduce((acc, lead) => {
      const value = lead[dataKey] as string;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#F97316', // orange
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: colors.slice(0, Object.keys(counts).length),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverBackgroundColor: colors.slice(0, Object.keys(counts).length).map(color => color + 'CC'),
          hoverBorderColor: colors.slice(0, Object.keys(counts).length),
          hoverBorderWidth: 4,
          hoverOffset: 8,
        },
      ],
      total,
      counts,
    };
  };

  const data = processData();

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500',
          },
          generateLabels: function(chart) {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            labels.forEach((label, index) => {
              const count = data.counts[label.text!];
              const percentage = ((count / data.total) * 100).toFixed(1);
              label.text = `${label.text}: ${count} (${percentage}%)`;
            });
            
            return labels;
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const count = context.parsed;
            const percentage = ((count / data.total) * 100).toFixed(1);
            return [
              `Cantidad: ${count}`,
              `Porcentaje: ${percentage}%`,
              `Total: ${data.total}`
            ];
          },
        },
      },
    },
    onHover: (event, elements) => {
      const canvas = event.native?.target as HTMLCanvasElement;
      if (canvas) {
        canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ height: '300px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};