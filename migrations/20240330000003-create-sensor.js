/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sensors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      sensorId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('UNASSIGNED', 'ASSIGNED'),
        defaultValue: 'UNASSIGNED',
        allowNull: false,
      },
      espId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'esp32_devices',
          key: 'espId',
        },
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('sensors', ['userId']);
    await queryInterface.addIndex('sensors', ['espId']);
    await queryInterface.addIndex('sensors', ['sensorId'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sensors');
  },
};
