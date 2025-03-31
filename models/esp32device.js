const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Esp32Device extends Model {
    static associate(models) {
      Esp32Device.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Esp32Device.hasMany(models.Sensor, {
        foreignKey: 'espId',
        as: 'sensors',
      });
    }
  }
  Esp32Device.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    espId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'INACTIVE',
      allowNull: false,
    },
    lastHeartbeat: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'Esp32Device',
    tableName: 'esp32_devices',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['espId'],
        unique: true,
      },
    ],
  });
  return Esp32Device;
};
