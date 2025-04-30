module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('email_alerts', {
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
      thresholdValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      actualValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      condition: {
        type: Sequelize.ENUM('above', 'below'),
        allowNull: false,
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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

    await queryInterface.addIndex('email_alerts', ['userId']);
    await queryInterface.addIndex('email_alerts', ['sensorId']);
    await queryInterface.addIndex('email_alerts', ['userId', 'sensorId', 'sentAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('email_alerts');
  },
};
