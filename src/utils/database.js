// Mock database using localStorage
// In a real app, this would be replaced with actual backend API calls

// Initialize localStorage database
const init = () => {
  if (!localStorage.getItem('parkingBuddyUsers')) {
    localStorage.setItem('parkingBuddyUsers', JSON.stringify([]));
  }
};

// Get all users
const getUsers = () => {
  const users = localStorage.getItem('parkingBuddyUsers');
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('parkingBuddyUsers', JSON.stringify(users));
};

// Simple password hashing simulation
const hashPassword = (password) => {
  // In a real app, use bcrypt or similar
  return btoa(password + 'salt'); // Base64 encoding for demo
};

// Verify password
const verifyPassword = (password, hashedPassword) => {
  return hashPassword(password) === hashedPassword;
};

// Find user by email
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Find user by ID
const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Create new user
const createUser = (userData) => {
  const users = getUsers();
  
  // Check if user already exists
  if (findUserByEmail(userData.email)) {
    return { success: false, error: 'User with this email already exists' };
  }

  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: hashPassword(userData.password),
    role: userData.role || 'guest',
    createdAt: new Date().toISOString(),
    isVerified: false
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: { ...newUser, password: undefined } };
};

// Authenticate user
const authenticateUser = (email, password) => {
  const user = findUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!verifyPassword(password, user.password)) {
    return { success: false, error: 'Invalid password' };
  }

  return { 
    success: true, 
    user: { ...user, password: undefined } 
  };
};

// Update user
const updateUser = (id, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);

  return { 
    success: true, 
    user: { ...users[userIndex], password: undefined } 
  };
};

// Delete user
const deleteUser = (id) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return { success: false, error: 'User not found' };
  }

  saveUsers(filteredUsers);
  return { success: true };
};

// Get user statistics
const getUserStats = () => {
  const users = getUsers();
  const total = users.length;
  const guests = users.filter(user => user.role === 'guest').length;
  const hosts = users.filter(user => user.role === 'host').length;
  const recent = users
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return { total, guests, hosts, recent };
};

// Initialize on import
init();

export {
  init,
  getUsers,
  saveUsers,
  hashPassword,
  verifyPassword,
  findUserByEmail,
  findUserById,
  createUser,
  authenticateUser,
  updateUser,
  deleteUser,
  getUserStats
}; 