import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http:HttpClient) { }

  loginUser(username: any,password: any):Observable<any>{
    const apiUrl='http://localhost:8091/user/login-user';

    
   return  this.http.post(apiUrl,{username,password});
  }
}
