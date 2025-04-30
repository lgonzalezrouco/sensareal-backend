const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SensorThreshold extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SensorThreshold.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      SensorThreshold.belongsTo(models.Sensor, {
        foreignKey: 'sensorId',
        as: 'sensor',
      });
    }
  }
  SensorThreshold.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sensorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id',
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
    type: {
      type: DataTypes.ENUM('temperature', 'humidity'),
      allowNull: false,
    },
    threshold: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM('above', 'below'),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'SensorThreshold',
    tableName: 'sensor_thresholds',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['sensorId'],
      },
      {
        fields: ['userId', 'sensorId', 'type', 'condition'],
        unique: true,
      },
    ],
  });
  return SensorThreshold;
};
