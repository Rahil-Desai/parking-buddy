// Simple database utility using localStorage
// In a real app, this would be replaced with a proper backend database

const USERS_KEY = 'parkingBuddyUsers';

// Simple password hashing simulation (in real app, use bcrypt)
const hashPassword = (password) => {
  // This is a simple hash for demo purposes
  // In production, use proper hashing like bcrypt
  return btoa(password + 'salt');
};

const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

export const database = {
  // Initialize database
  init() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
  },

  // Get all users
  getUsers() {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  },

  // Save users
  saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  },

  // Find user by email
  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  // Find user by ID
  findUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  },

  // Create new user
  createUser(userData) {
    const users = this.getUsers();
    
    // Check if user already exists
    if (this.findUserByEmail(userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashPassword(userData.password),
      role: 'guest', // Default role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    
    if (this.saveUsers(users)) {
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } else {
      throw new Error('Failed to save user');
    }
  },

  // Authenticate user
  authenticateUser(email, password) {
    const user = this.findUserByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update user
  updateUser(id, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (this.saveUsers(users)) {
      const { password, ...userWithoutPassword } = users[userIndex];
      return userWithoutPassword;
    } else {
      throw new Error('Failed to update user');
    }
  },

  // Delete user
  deleteUser(id) {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (users.length === filteredUsers.length) {
      throw new Error('User not found');
    }

    return this.saveUsers(filteredUsers);
  },

  // Get user statistics
  getUserStats() {
    const users = this.getUsers();
    return {
      totalUsers: users.length,
      guests: users.filter(user => user.role === 'guest').length,
      hosts: users.filter(user => user.role === 'host').length,
      recentUsers: users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(user => ({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }))
    };
  }
};

// Initialize database on import
database.init(); 