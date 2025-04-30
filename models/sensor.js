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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
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
        fields: ['userId', 'id'],
        unique: true,
      },
    ],
  });
  return Sensor;
};
