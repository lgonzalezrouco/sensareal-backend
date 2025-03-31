const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('email_verification', 'password_reset'),
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'tokens',
    timestamps: true
  });

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Token;
}; 