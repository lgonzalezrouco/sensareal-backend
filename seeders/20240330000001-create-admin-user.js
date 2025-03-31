const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      email: 'admin@sensareal.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: true,
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: 'admin@sensareal.com' }, {});
  },
};
