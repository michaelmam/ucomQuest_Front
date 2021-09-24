import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "./user/user-dialog/user-dialog.component";
import { ModalComponent } from './modal/modal.component';
import {ApiService} from "../../shared/service/api.service";
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  map = {}
  constructor(public dialog: MatDialog, private apiService: ApiService) {
  }
  ngOnInit() {
  }
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:keydown', ['$event'])
  keUp(e: { keyCode: string | number; type: string; }) {
    // @ts-ignore
    this.map[e.keyCode] = e.type == 'keydown';
    // @ts-ignore
    if( this.map[17] && this.map[191]) {
      console.log('Keypress ctrl + /');
      this.openModal()
    }
  }
  openModal() {
    this.dialog.open(ModalComponent);
  }

  getImages() {
    this.apiService.get('file/images').subscribe(data => {
      console.log(data);
    })
  }
}
