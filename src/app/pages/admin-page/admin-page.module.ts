import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPageRoutingModule } from './admin-page-routing.module';
import { NewGameComponent } from './game/new-game/new-game.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GameDialogComponent } from './game/game-dialog/game-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { GameComponent } from './game/game.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {AdminPageComponent} from "./admin-page.component";
import { LocationComponent } from './location/location.component';
import { LocationDialogComponent } from './location/location-dialog/location-dialog.component';
import { NewLocationComponent } from './location/new-location/new-location.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatSelectModule} from "@angular/material/select";
import { UserComponent } from './user/user.component';
import { UserDialogComponent } from './user/user-dialog/user-dialog.component';
import { NewUserComponent } from './user/new-user/new-user.component';
import { FilesComponent } from './files/files.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {DragDropModule} from "@angular/cdk/drag-drop";
@NgModule({
  declarations: [
    NewGameComponent,
    GameDialogComponent,
    GameComponent,
    AdminPageComponent,
    LocationComponent,
    LocationDialogComponent,
    NewLocationComponent,
    UserComponent,
    UserDialogComponent,
    NewUserComponent,
    FilesComponent
  ],
  exports: [
    NewGameComponent,
    GameComponent
  ],
  imports: [
    NgxMatSelectSearchModule,
    CommonModule,
    AdminPageRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule
  ],
})
export class AdminPageModule { }
