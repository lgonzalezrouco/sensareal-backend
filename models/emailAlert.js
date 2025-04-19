const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailAlert extends Model {
    static associate(models) {
      EmailAlert.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      EmailAlert.belongsTo(models.Sensor, {
        foreignKey: 'sensorId',
        as: 'sensor',
      });
    }
  }
  EmailAlert.init({
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
    thresholdValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    actualValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM('above', 'below'),
      allowNull: false,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'EmailAlert',
    tableName: 'email_alerts',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['sensorId'],
      },
      {
        fields: ['userId', 'sensorId', 'sentAt'],
      },
    ],
  });
  return EmailAlert;
};
