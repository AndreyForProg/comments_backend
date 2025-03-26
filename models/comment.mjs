'use strict'
import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      })
      Comment.belongsTo(models.Comment, {
        foreignKey: 'parentId',
        as: 'parent',
      })
      Comment.hasMany(models.Comment, {
        foreignKey: 'parentId',
        as: 'children',
      })
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      homePage: DataTypes.STRING,
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    },
  )
  return Comment
}
