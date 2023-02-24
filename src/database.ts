import { Sequelize, Model, DataTypes } from 'sequelize'

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: './store.sqlite'
});

export class Resource extends Model {
  declare id: number;
  declare owner: number;
  declare name: string;
  declare preview: string;
  declare content: string;
}

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare profilePicture: Resource;
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


User.belongsTo(Resource, { as: 'profilePicture', constraints: false })

await User.sync();
await Resource.sync()
