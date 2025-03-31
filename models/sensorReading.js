const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SensorReading = sequelize.define('SensorReading', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -273.15 // Absolute zero
      }
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sensor_readings',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'timestamp']
      }
    ]
  });

  return SensorReading;
}; 