import { UserService } from './../../services/user.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit{


username:any;
password:any;
firstName:any;
lastName:any;
email:any;
role:any;

constructor(private activatedRoute:ActivatedRoute,
  private userService:UserService,
  private router:Router)
{}

ngOnInit(): void {
  this.username=this.activatedRoute.snapshot.paramMap.get('username');
  this.getUserByUsername();
}
getUserByUsername(){
  this.userService.getUserByUsername(this.username).subscribe(res =>{
    console.log(res);


    this.password=res.password;
    this.firstName=res.firstName;
    this.lastName=res.lastName;
    this.email=res.email;
    this.role=res.role;

  });
}
updateUser(){
const userdata={
username:this.username,
password:this.password,
firstName:this.firstName,
lastName:this.lastName,
email:this.email,
role:this.role,

};

this.userService.updateUser(userdata).subscribe(res =>{
  alert('update');
  this.router.navigateByUrl('/all-user')
})
  }
}
