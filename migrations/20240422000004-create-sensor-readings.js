module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sensor_readings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sensorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sensors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      humidity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      batteryLevel: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      signalStrength: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('sensor_readings', ['userId', 'timestamp']);
    await queryInterface.addIndex('sensor_readings', ['sensorId', 'timestamp'], {
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sensor_readings');
  },
};
