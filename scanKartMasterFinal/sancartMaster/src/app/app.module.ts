import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ServiceService} from '../app/services/services.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewordersComponent, RemoveUnderscorePipe } from './home/neworders/neworders.component';
import { PastordersComponent } from './home/pastorders/pastorders.component';
import { LoginComponent } from './login/login.component';
import { GetotpComponent } from './getotp/getotp.component';
import { SignupComponent } from './signup/signup.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { BarcodeComponent } from './home/barcode/barcode.component';
//InfiniteScrollModule
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
//NgxSpinnerModule
import { NgxSpinnerModule } from "ngx-spinner";
//authRouter
import { RouterModule } from '@angular/router';
import { AuthGuard } from './service/auth.router';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewordersComponent,
    PastordersComponent,
    LoginComponent,
    GetotpComponent,
    SignupComponent,
    NoPageFoundComponent,
    RemoveUnderscorePipe,
    BarcodeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    BrowserModule,
    RouterModule,
    NgxPaginationModule

  ],
  providers: [ServiceService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
