import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../../shared/service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog"
import {UserDialogComponent} from "./user-dialog/user-dialog.component";
export interface UserProps {
  _id: string;
  name: string;
  code: string;
  teamName: string;
  id: string;
  role: 'player' | 'admin';
  phone_number?: number
  chatTo: string;
  adminId?: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  showNewUserComponent: boolean = false;

  displayedColumns: string[] = [
    // 'index',
    'code',
    'verificationCode',
    'teamName',
    'role',
    'admin',
    'location',
    'locationSteps',
    'actions'
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  usersData: UserProps[] = [];
  dataSource = new MatTableDataSource(this.usersData);

  constructor(private userService: UserService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.userService.getUsers().subscribe(data => {
      if (data) {
        this.usersData = data
        this.dataSource = new MatTableDataSource(this.usersData);
      }
    })
  }

  addUser(user: UserProps) {
    this.userService.newUser(user).subscribe(data => {
      if (data && !data.error) {
        this.usersData.unshift(data)
        this.dataSource = new MatTableDataSource(this.usersData);
        this.snackBar.open(`created ${user.code}`, 'ok', {
          duration: 1000,
        })
      }
      if (data.error) {
        this.snackBar.open(data.error, 'ok', {
          duration: 1000,
        })
      }
    })
  }

  delete(user: UserProps) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '250px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.userService.removeUser(user._id).subscribe(data => {
          if(data) {
            this.usersData = this.usersData.filter(({_id}) => _id !== user._id );
            this.dataSource = new MatTableDataSource(this.usersData);
            this.snackBar.open(`removed ${user.name}`, 'ok', {
              duration: 1000,
            })
          }
        })
      }
    });
  }
}
