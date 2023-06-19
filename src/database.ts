import { Sequelize, Model, DataTypes } from 'sequelize'

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: './store.sqlite',
  logging: false,
});

export const datatypes = [
  'image',
  'article',
]

export class Resource extends Model {
  declare id: number;
  declare type: number;
  declare resourceType: string;
  declare name: string;
  declare preview: string;
  declare content: string;
  declare hostname: string;
}

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare hostname: string;
  declare profilePicture: Resource;
  declare resources: Array<Resource>;
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
  hostname: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
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
  type: {
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
User.hasMany(Resource, {as: 'resources'})

await User.sync()
await Resource.sync()
