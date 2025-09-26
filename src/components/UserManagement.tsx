import React, { useEffect, useState } from 'react';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

type Role = 'admin' | 'user' | 'super_admin';

interface AppUser {
  id: number;
  username: string;
  display_name: string;
  role: Role;
  is_first_login: boolean;
  created_at: string;
}

interface UserManagementProps {
  currentUser: {
    username: string;
    displayName: string;
    role: Role;
    isFirstLogin: boolean;
  };
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', display_name: '', role: 'user' as Role });
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
    return (
      <div className="p-6 text-center text-gray-600">
        No tenés permisos para ver esta sección.
      </div>
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/getUsers");
      const allUsers = await response.json();
      if (response.ok) setUsers(allUsers);
      else setError(allUsers.error || "No se pudieron cargar los usuarios");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
    }
  };

  // Crear usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!newUser.username.trim() || !newUser.display_name.trim()) {
      setError('Completá usuario y nombre para mostrar');
      setLoading(false);
      return;
    }

    try {
      const tempPass = Math.random().toString(36).slice(-8);
      const response = await fetch("http://localhost:3000/auth/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, tempPassword: tempPass }),
      });

      const data = await response.json();

      if (response.ok) {
        await loadUsers();
        setTempPassword(tempPass);
        setShowTempPassword(true);
        setNewUser({ username: '', display_name: '', role: 'user' });
        setShowCreateForm(false);
      } else {
        setError(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      console.error(err);
      setError('Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
const handleDeleteUser = async (userId: number) => {
  if (!window.confirm("⚠️ ¿Seguro que querés eliminar este usuario y todo su contenido?")) return;

  try {
    const res = await fetch(`http://localhost:3000/auth/deleteUser/${userId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert(`✅ Usuario ${data.user.username} y todos sus leads fueron eliminados`);
    } else {
      alert(data.error || "❌ No se pudo eliminar el usuario");
    }
  } catch (err) {
    console.error("❌ Error al eliminar:", err);
  }
};




  // Resetear contraseña
  const handleResetPassword = async (userId: number) => {
    try {
      const response = await fetch("http://localhost:3000/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setTempPassword(data.tempPassword);
        setShowTempPassword(true);
      } else {
        alert(data.error || "No se pudo resetear la contraseña");
      }
    } catch (err) {
      console.error("❌ Error al resetear contraseña:", err);
    }
  };

  // Copiar contraseña temporal
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(tempPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const closeTempPasswordModal = () => {
    setShowTempPassword(false);
    setTempPassword('');
    setCopiedPassword(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-xl">
            <UsersIcon size={28} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-500">{users.length} usuarios registrados</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <UserPlus size={20} />
          Crear Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-lg">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Usuario</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-left">Creado</th>
              <th className="px-6 py-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{u.display_name}</div>
                  <div className="text-sm text-gray-500">@{u.username}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    u.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                    u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.is_first_login ? (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock size={18} /> <span className="text-sm">Primer login</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={18} /> <span className="text-sm">Activo</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => handleResetPassword(u.id)}
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                    title="Resetear contraseña"
                  >
                    <Key size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    title="Eliminar usuario"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Usuario */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-8 relative">
            {/* Botón cerrar */}
            <button
              onClick={() => { 
                setShowCreateForm(false); 
                setError(''); 
                setNewUser({ username: '', display_name: '', role: 'user' }); 
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              title="Cerrar"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-6">
              <UserPlus size={22} className="text-purple-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Crear Nuevo Usuario</h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Nombre de Usuario (login)
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: juanp"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Nombre para mostrar
                </label>
                <input
                  type="text"
                  value={newUser.display_name}
                  onChange={(e) => setNewUser({ ...newUser, display_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => { 
                    setShowCreateForm(false); 
                    setError(''); 
                    setNewUser({ username: '', display_name: '', role: 'user' }); 
                  }}
                  className="flex-1 px-5 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal contraseña temporal */}
      {showTempPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contraseña temporal</h3>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={tempPassword}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                {copiedPassword ? <Check size={16} /> : <Copy size={16} />}
                {copiedPassword ? 'Copiado' : 'Copiar'}
              </button>
              <button
                onClick={closeTempPasswordModal}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
