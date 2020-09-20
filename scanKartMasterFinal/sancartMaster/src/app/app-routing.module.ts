import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewordersComponent } from './home/neworders/neworders.component';
import { PastordersComponent } from './home/pastorders/pastorders.component';
import { LoginComponent } from './login/login.component';
import { GetotpComponent } from './getotp/getotp.component';
import { SignupComponent } from './signup/signup.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { BarcodeComponent } from './home/barcode/barcode.component';
import { AuthGuard } from './service/auth.router';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:"login" ,component:LoginComponent},
  {path:"signup" , component:SignupComponent},
  {path:"getotp", component:GetotpComponent},
  {path:"home", component:HomeComponent, canActivate:[AuthGuard],
   children:[
    {path:"neworders", component:NewordersComponent},
    {path:"neworders/:searchTerm", component:NewordersComponent},
    {path:"pastorders", component:PastordersComponent},
    {path:"barcode", component:BarcodeComponent}

  ]},
  { path: '**', component: NoPageFoundComponent }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes , { useHash: true }    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
