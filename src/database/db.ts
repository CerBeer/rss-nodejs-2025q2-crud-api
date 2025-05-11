import { v4 } from "uuid";

export type NewUser = {
  username: string;
  age: number;
  hobbies: string[];
};

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

const emptyUser = {
  id: "",
  username: "",
  age: 0,
  hobbies: [],
};

export class Users {
  private _records: Map<string, User> = new Map();
  private _instance: Users;

  public constructor() {
    if (!this._instance) this._instance = this;
    return this._instance;
  }

  public addUser = (newUser: NewUser): User => {
    const id = v4();
    const user: User = { id, ...newUser };
    this._records.set(id, user);
    return user;
  };

  public getAllUsers = (): User[] => {
    const models: User[] = [];
    this._records.forEach((record: User) => {
      models.push(record);
    });
    return models;
  };

  public getUserById = (id: string): User => {
    const user = this._records.get(id);
    if (user) return user;
    return emptyUser;
  };

  public updateUser = (id: string, newUser: NewUser): User => {
    const user = this.getUserById(id);
    if (!user.id) return user;
    const updatedUser = {
      id,
      username: newUser.username ? newUser.username : user.username,
      age: newUser.age ? newUser.age : user.age,
      hobbies: newUser.hobbies ? newUser.hobbies : user.hobbies,
    };
    this._records.set(id, updatedUser);
    return updatedUser;
  };

  public deleteUser = (id: string): User => {
    const user = this.getUserById(id);
    if (!user.id) return user;
    this._records.delete(id);
    return user;
  };

  public flushDB = (): User[] => {
    this._records = new Map();
    return this.getAllUsers();
  };
}
