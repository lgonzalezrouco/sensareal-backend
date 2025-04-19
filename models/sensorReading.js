const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SensorReading extends Model {
    static associate(models) {
      SensorReading.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      SensorReading.belongsTo(models.Sensor, {
        foreignKey: 'sensorId',
        as: 'sensor',
      });
    }
  }
  SensorReading.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    sensorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id',
      },
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -273.15, // Absolute zero
      },
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    batteryLevel: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    signalStrength: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
  }, {
    sequelize,
    modelName: 'SensorReading',
    tableName: 'sensor_readings',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'timestamp'],
      },
      {
        fields: ['sensorId', 'timestamp'],
        unique: true,
      },
    ],
  });
  return SensorReading;
};
