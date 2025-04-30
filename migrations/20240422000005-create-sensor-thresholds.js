module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sensor_thresholds', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      type: {
        type: Sequelize.ENUM('temperature', 'humidity'),
        allowNull: false,
      },
      threshold: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      condition: {
        type: Sequelize.ENUM('above', 'below'),
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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

    await queryInterface.addIndex('sensor_thresholds', ['userId']);
    await queryInterface.addIndex('sensor_thresholds', ['sensorId']);
    await queryInterface.addIndex('sensor_thresholds', ['userId', 'sensorId', 'type', 'condition'], {
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sensor_thresholds');
  },
};
