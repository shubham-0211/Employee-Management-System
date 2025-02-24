import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  constructor(private UserService:UserService,private router:Router){}
  username:any;
password:any;
firstName:any;
lastName:any;
email:any;
role:any;

adduser(){


  const userData={
    username:this.username,
    password:this.password,
    firstName:this.firstName,
    lastName:this.lastName,
    email:this.email,
    role:this.role

  }
  this.UserService.Adduser(userData).subscribe((res)=>{
    alert(res);
    this.router.navigateByUrl('/all-user')
  }

  );
}
}
