module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sensor_thresholds', 'type', {
      type: Sequelize.ENUM('temperature', 'humidity'),
      allowNull: false,
      defaultValue: 'temperature', // Default value for existing records
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn('sensor_thresholds', 'type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_sensor_thresholds_type;');
  },
};
