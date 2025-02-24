import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit{
  user:any;
  constructor(private UserService:UserService,private router:Router){

  }
  ngOnInit(): void {
    this.UserService.getAllUser().subscribe((res)=>{
      this.user=res

    });

  }

  getAlluser(){
    this.UserService.getAllUser().subscribe((res)=>{
      this.user=res

      });
    }
deleteuser(username:string){
this.UserService.deleteuser(username).subscribe((res)=>{
this.getAlluser();

});
}

edituser(username:string){
this.router.navigate(['/edituser',username]);
}
}
