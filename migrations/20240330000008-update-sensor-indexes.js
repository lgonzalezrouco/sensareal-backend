/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    // Remove the old unique index on sensorId
    await queryInterface.removeIndex('sensors', 'sensorId');

    // Add the new composite unique index
    await queryInterface.addIndex('sensors', ['userId', 'sensorId'], {
      unique: true,
      name: 'sensors_userId_sensorId_unique',
    });
  },

  async down(queryInterface, _Sequelize) {
    // Remove the composite unique index
    await queryInterface.removeIndex('sensors', 'sensors_userId_sensorId_unique');

    // Restore the old unique index on sensorId
    await queryInterface.addIndex('sensors', ['sensorId'], {
      unique: true,
      name: 'sensorId',
    });
  },
};
