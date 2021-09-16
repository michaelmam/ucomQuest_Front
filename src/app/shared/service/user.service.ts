import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {UserProps} from "../../pages/admin-page/user/user.component";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  newUser(user: UserProps) {
    return this.apiService.post('user', user)
  }
  getUsers() {
    return this.apiService.get('user')
  }

  getAdminUsers() {
    return this.apiService.get('user/admins')
  }
  updateUser(user: UserProps) {
    return this.apiService.putOnlyObject('user', user)
  }

  removeUser(id: string) {
    return this.apiService.delete('user', id)
  }
  removeUserInfo(id: string) {
    return this.apiService.put('user/info', id)
  }
}
