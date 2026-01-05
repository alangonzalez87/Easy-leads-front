import React, { useState } from "react";
import { Save, X } from "lucide-react";

interface AddLeadFormProps {
  onCancel: () => void;
  onSave: (formData: any) => void; // lo maneja el contenedor (insert/update en Supabase)
  initialData?: any; // si existe → edición, si no → alta
}

export const AddLeadForm: React.FC<AddLeadFormProps> = ({
  onCancel,
  onSave,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || "",
    email: initialData.email || "",
    tel: initialData.tel || "",
    tablero: initialData.tablero || "",
    vendedor: initialData.vendedor || "",
    estado: (initialData.estado || "activo"),
    tiempo: initialData.tiempo || "",
    fecha_finalizacion: initialData.fecha_finalizacion || "",
    observaciones: initialData.observaciones || "",
    precio: 0,  // Inicialmente el precio será 0, se asignará más tarde
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const plan = formData.tiempo;  // '30', '90', '365', o 'monthly', 'quarterly', 'annual'
    const price = 0
    // Agregar el precio al objeto formData
    const leadData = { ...formData, plan };  // Añadir el campo 'precio'

    console.log("📤addleadForm Enviando Lead con precio:", leadData); // Log estratégico para verificar los datos

    onSave(leadData);  // Enviar los datos al contenedor (alta o actualización del lead)
  };


  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingresa el nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="ejemplo@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.tel}
                onChange={(e) => handleChange("tel", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="+54 9 3468 123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tablero <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.tablero}
                onChange={(e) => handleChange("tablero", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecciona un tablero</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.tiempo}
                onChange={(e) => handleChange("tiempo", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecciona duración</option>
                <option value="30">1 mes</option>
                <option value="90">3 meses</option>
                <option value="365">1 año</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Finalización <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.fecha_finalizacion}
                onChange={(e) =>
                  handleChange("fecha_finalizacion", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="activo">Activo</option>
                <option value="pendiente">Pendiente</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendedor
              </label>
              <select
                value={formData.vendedor}
                onChange={(e) => handleChange("vendedor", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Sin asignar</option>
                <option value="Alan">Alan</option>
                <option value="Daniela">Daniela</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => handleChange("observaciones", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="p-3 bg-gradient-to-r from-red-500 to-pink-500 
                         text-white rounded-full shadow-md 
                         hover:scale-110 transition-transform"
              title="Cancelar"
            >
              <X size={20} />
            </button>
            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 
                         text-white rounded-full shadow-md 
                         hover:scale-110 transition-transform"
              title="Guardar"
            >
              <Save size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
