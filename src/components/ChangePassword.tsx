// src/components/ChangePassword.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordProps {
  onPasswordChanged?: () => void;
}

export default function ChangePassword({ onPasswordChanged }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("⚠️ Las contraseñas nuevas no coinciden");
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Contraseña actualizada con éxito");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        if (onPasswordChanged) {
          onPasswordChanged();
        }
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contraseña actual */}
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            placeholder="Contraseña actual"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Nueva contraseña */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirmar nueva contraseña */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
