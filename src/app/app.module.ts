import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AdminPageModule} from "./pages/admin-page/admin-page.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JwtInterceptor} from "./jwt.interceptor";
import { LoginComponent } from './pages/login/login.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AdminPageModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
