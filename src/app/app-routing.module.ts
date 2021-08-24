import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {LoginGuard} from "./shared/login.guard";
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'admin',
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/admin-page/admin-page.module').then(m => m.AdminPageModule),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
