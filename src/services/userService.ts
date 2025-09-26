interface StoredUser {
  id: string;
  username: string;
  password: string;
  role: 'super_admin' | 'user';
  displayName: string;
  isFirstLogin: boolean;
  dashboardConfig?: any;
  createdAt: string;
}

class UserService {
  private readonly STORAGE_KEY = 'dashboard_users';
  private readonly SESSION_KEY = 'userSession';

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    const users = this.getAllUsers();
    if (users.length === 0) {
      // Crear usuarios iniciales
      const defaultUsers: StoredUser[] = [
        {
          id: '1',
          username: 'AlanG',
          password: 'alan123',
          role: 'super_admin',
          displayName: 'Alan',
          isFirstLogin: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          username: 'DanyP',
          password: 'Dany123',
          role: 'user',
          displayName: 'Daniela',
          isFirstLogin: false,
          dashboardConfig: { hasExistingData: true }, // Excepción para DanyP
          createdAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }

  getAllUsers(): StoredUser[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  getUserByUsername(username: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find(user => user.username === username) || null;
  }

  authenticateUser(username: string, password: string): StoredUser | null {
    const user = this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  createUser(userData: {
    username: string;
    displayName: string;
    role: 'super_admin' | 'user';
  }): { user: StoredUser; tempPassword: string } {
    const users = this.getAllUsers();
    
    // Verificar si el usuario ya existe
    if (users.some(user => user.username === userData.username)) {
      throw new Error('El usuario ya existe');
    }

    // Generar contraseña temporal
    const tempPassword = this.generateRandomPassword();
    
    const newUser: StoredUser = {
      id: Date.now().toString(),
      username: userData.username,
      password: tempPassword,
      role: userData.role,
      displayName: userData.displayName,
      isFirstLogin: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    
    return { user: newUser, tempPassword };
  }

  updateUserPassword(username: string, newPassword: string): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      users[userIndex].isFirstLogin = false;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }

  updateUserDashboardConfig(username: string, config: any): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
      users[userIndex].dashboardConfig = config;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  getCurrentSession(): StoredUser | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        return this.getUserByUsername(sessionData.username);
      } catch {
        return null;
      }
    }
    return null;
  }

  saveSession(user: StoredUser): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({
      username: user.username,
      role: user.role,
      displayName: user.displayName,
      isFirstLogin: user.isFirstLogin
    }));
  }

  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}

export const userService = new UserService();