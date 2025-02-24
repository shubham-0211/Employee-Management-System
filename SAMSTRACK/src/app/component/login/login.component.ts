import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private loginService: LoginService,private router:Router){}

  username:any;
  password:any;

  login(){
    this.loginService.loginUser(this.username,this.password).subscribe((res) => {

    if(res != null) {

    this.router.navigateByUrl('/home')
}else{
  alert('invalid ');
}
    });

  }

}
