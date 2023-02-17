import { Sequelize, Model, DataTypes } from 'sequelize'

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: './store.sqlite'
});
  
export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string | null;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: new DataTypes.STRING(128),
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: new DataTypes.STRING(128),
    allowNull: false,
  },
},
{
  tableName: 'users',
  sequelize: db,
})

await User.sync();
