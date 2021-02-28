import { Injectable } from '@angular/core';
import * as data from '../../assets/db.json';
import {UserData} from '../models/user-data.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userList: UserData[];

  constructor() {
    if(localStorage.getItem('users'))
    {
      this.userList = JSON.parse(localStorage.getItem('users'));
    }
    else{
      localStorage.setItem('users', JSON.stringify(data.users));
      this.userList = data.users;
    }

  }

  getUsers(){
      // Returning Observable because in reality this data should be coming from backend instead of local storage.
      return of(this.userList);
  }

  addUser(userData){
    this.userList.push(userData);
    localStorage.setItem('users', JSON.stringify(this.userList));
    return of(userData);
  }

  public getUser(id) {
    return of(this.userList.find(user => user.id === id));
  }

  updateUser(userData){
    let index = this.userList.findIndex(user => user.id === userData.id);
    this.userList.splice(index, 1, userData);
    localStorage.setItem('users', JSON.stringify(this.userList));
    return of(userData);
  }




  deleteUser(id){
    this.userList.forEach((value,index)=>{
      if(value.id==id) this.userList.splice(index,1);
    });
    localStorage.setItem('users', JSON.stringify(this.userList));
    return of(this.userList);
  }

}
