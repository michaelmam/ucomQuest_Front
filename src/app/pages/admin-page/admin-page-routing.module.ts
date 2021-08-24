import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import {AdminPageComponent} from "./admin-page.component";
import { LocationComponent } from './location/location.component';
import { UserComponent } from './user/user.component';
import { FilesComponent } from './files/files.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: '', component: GameComponent
      },
      {
        path: 'location', component: LocationComponent,
      },
      {
        path: 'user', component: UserComponent,
      },
      {
        path: 'file', component: FilesComponent,
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPageRoutingModule { }
