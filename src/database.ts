import { Sequelize, Model, DataTypes } from 'sequelize'

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: './store.sqlite'
});
  
export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  tableName: 'users',
  sequelize: db,
})

export class Resource extends Model {
  declare id: number;
  declare owner: number;
  declare name: string;
  declare preview: string;
  declare content: string;
}

Resource.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  owner: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preview: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  tableName: 'resources',
  sequelize: db,
})


await User.sync();
await Resource.sync()
