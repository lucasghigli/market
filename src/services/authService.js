const USERS_KEY = 'supermarket_users';
const SESSION_KEY = 'supermarket_session';
const USERS_RESET_VERSION = 'cleared-v1';

function getUsers() {
  const resetVersion = localStorage.getItem('supermarket_users_reset');
  if (resetVersion !== USERS_RESET_VERSION) {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.setItem('supermarket_users_reset', USERS_RESET_VERSION);
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
    return [];
  }

  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(stored);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function buildSession(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
  };
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(buildSession(user)));
}

export const authService = {
  login(email, password) {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    saveSession(user);
    return buildSession(user);
  },

  register(name, email, password, phone = '') {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    saveSession(newUser);
    return buildSession(newUser);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser() {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    const user = getUsers().find((u) => u.id === session.id);
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return buildSession(user);
  },

  getUserById(id) {
    const user = getUsers().find((u) => u.id === id);
    if (!user) return null;
    const { password, ...profile } = user;
    return profile;
  },

  updateProfile(id, { name, email, phone }) {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPhone = phone?.trim() ?? '';

    if (!trimmedName) throw new Error('Name is required');
    if (!trimmedEmail) throw new Error('Email is required');

    const emailTaken = users.some(
      (u) => u.id !== id && u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (emailTaken) throw new Error('Email already in use');

    users[index] = {
      ...users[index],
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      updatedAt: new Date().toISOString(),
    };
    saveUsers(users);

    const session = this.getCurrentUser();
    if (session?.id === id) {
      saveSession(users[index]);
    }

    const { password, ...profile } = users[index];
    return profile;
  },

  deleteAccount(id) {
    const users = getUsers();
    if (!users.some((u) => u.id === id)) throw new Error('User not found');
    saveUsers(users.filter((u) => u.id !== id));

    const session = this.getCurrentUser();
    if (session?.id === id) {
      this.logout();
    }
  },

  getAllUsers() {
    return getUsers().map(({ password, ...user }) => user);
  },

  deleteUser(id) {
    const users = getUsers().filter((u) => u.id !== id);
    saveUsers(users);
    const session = this.getCurrentUser();
    if (session?.id === id) {
      this.logout();
    }
  },

  updateUserRole(id, role) {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index].role = role;
    saveUsers(users);
    const session = this.getCurrentUser();
    if (session?.id === id) {
      saveSession(users[index]);
    }
  },
};
