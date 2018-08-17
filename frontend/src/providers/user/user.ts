import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "../../models/user.model";

@Injectable()
export class UserProvider {
  private user: User;

  constructor(public http: HttpClient) {
  }
}
