
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  getAllUser():Observable<any>{
    const apiUrl='http://localhost:8091/user/get-all-user';
    return this.http.get(apiUrl);
  }
  Adduser(userdata:any):Observable<any>{
    const apiUrl='http://localhost:8091/user/register-user';
    return this.http.post(apiUrl,userdata,{responseType:'text'as'json'});

  }
  deleteuser(username:string):Observable<any>{
    const apiUrl=`http://localhost:8091/user/delete-user-by-username?username=${username}`;
    return this.http.delete(apiUrl);
  }
   getUserByUsername(username:any):Observable<any>{
  const apiUrl=`http://localhost:8091/user/get-user-by-username/${username}`;
  return this.http.get(apiUrl);
   }
  updateUser(userdata:any):Observable<any>{
  const apiUrl=`http://localhost:8091/user/update-user`;
  return this.http.put(apiUrl,userdata);
 }
}
