/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('esp32_devices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      espId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'INACTIVE',
        allowNull: false,
      },
      lastHeartbeat: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      batteryLevel: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      signalStrength: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    await queryInterface.addIndex('esp32_devices', ['userId']);
    await queryInterface.addIndex('esp32_devices', ['espId'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('esp32_devices');
  },
};
