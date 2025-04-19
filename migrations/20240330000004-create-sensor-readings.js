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

    // Add indexes
    await queryInterface.addIndex('sensor_readings', ['userId', 'timestamp'], {
      name: 'idx_sensor_readings_user_timestamp',
    });
    await queryInterface.addIndex('sensor_readings', ['sensorId', 'timestamp'], {
      unique: true,
      name: 'idx_sensor_readings_sensor_timestamp_unique',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sensor_readings');
  },
};
