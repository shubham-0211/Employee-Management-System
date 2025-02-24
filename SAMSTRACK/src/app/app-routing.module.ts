import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { AllUserComponent } from './component/all-user/all-user.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { EdituserComponent } from './component/edituser/edituser.component';

const routes: Routes = [
  {
    path:'',component:WelcomeComponent
  },
  {
    path:'login',component:LoginComponent
 },
 {
  path:'home',component:HomeComponent
 },
 {
  path:'all-user',component:AllUserComponent
 },
 {
  path:'add-user',component:AddUserComponent
 },
 {
  path:'adduser',component:AddUserComponent
 },
 {
  path:'edituser/:username',component:EdituserComponent
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
