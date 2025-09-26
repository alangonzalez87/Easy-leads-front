import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface GoogleSheetsConfigProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSave: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsConfig: React.FC<GoogleSheetsConfigProps> = ({
  apiKey,
  onApiKeyChange,
  onSave,
  isOpen,
  onClose
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Configurar Google Sheets API
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¡Tu Google Sheet ya está configurado!</p>
                <p className="text-xs">El dashboard puede acceder a los datos directamente. La API Key es opcional para mayor rendimiento.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">API Key Opcional:</p>
                <p className="text-xs">Para mejor rendimiento, puedes obtener una API Key gratuita en Google Cloud Console.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Sheets API Key (Opcional)
            </label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Opcional: Ingresa tu API Key para mejor rendimiento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};