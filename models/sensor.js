const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sensor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sensor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Sensor.belongsTo(models.Esp32Device, {
        foreignKey: 'espId',
        as: 'esp32Device',
      });
      Sensor.hasMany(models.SensorReading, {
        foreignKey: 'sensorId',
        as: 'readings',
      });
    }
  }
  Sensor.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sensorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('UNASSIGNED', 'ASSIGNED'),
      defaultValue: 'UNASSIGNED',
      allowNull: false,
    },
    espId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'esp32_devices',
        key: 'espId',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Sensor',
    tableName: 'sensors',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['espId'],
      },
      {
        fields: ['userId', 'sensorId'],
        unique: true,
      },
    ],
  });
  return Sensor;
};
