module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sensors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('sensors', ['userId']);
    await queryInterface.addIndex('sensors', ['userId', 'id'], {
      unique: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sensors');
  },
};
