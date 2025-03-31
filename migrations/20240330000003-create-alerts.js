'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alerts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('temperature', 'humidity'),
        allowNull: false
      },
      threshold: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      condition: {
        type: Sequelize.ENUM('above', 'below'),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastTriggered: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('alerts', ['userId', 'type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alerts');
  }
}; 