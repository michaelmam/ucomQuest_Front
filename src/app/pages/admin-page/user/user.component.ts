import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../../shared/service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog"
import {UserDialogComponent} from "./user-dialog/user-dialog.component";
import {MatSort} from "@angular/material/sort";
export interface UserProps {
  _id: string;
  name: string;
  code: string;
  teamName: string;
  verificationCode: string;
  playingLocationSteps: string[]
  admin: string;
  userPlayingLocations: string[]
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
export class UserComponent implements OnInit, AfterViewInit {
  showNewUserComponent: boolean = false;
  editing: boolean = false;
  editUserData: UserProps = {} as UserProps;
  displayedColumns: string[] = [
    // 'index',
    'code',
    'verificationCode',
    'teamName',
    'role',
    'admin',
    'playStatus',
    'location',
    'locationSteps',
    'actions'
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  usersData: UserProps[] = [];
  dataSource = new MatTableDataSource(this.usersData);
  @ViewChild(MatSort) sort = {} as MatSort;

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
  compare(a: UserProps, b: UserProps, props: keyof UserProps, value: number) {

    // props = props === 'admin' ? 'adminData.teamName' as keyof UserProps : props

    // @ts-ignore
    if ( a[props] < b[props] ){
      return -value;
    }
    // @ts-ignore
    if ( a[props] > b[props] ){
      return value;
    }
    return 0;
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe((e) => {
      let prop = e.active as keyof UserProps;
      this.usersData.sort((a,b) => this.compare(a, b, prop, e.direction === 'asc' ? 1 : -1));
      this.dataSource = new MatTableDataSource(this.usersData);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  addUser(user: UserProps) {
   if(this.editing) {
     this.userService.updateUser({...this.editUserData, ...user}).subscribe(data => {
       if (data && !data.error) {
         this.usersData.unshift({...this.editUserData, ...user})
         this.dataSource = new MatTableDataSource(this.usersData);
         this.snackBar.open(`updated ${this.editUserData.code}`, 'ok', {
           duration: 1000,
         })
         this.editUserData = {} as UserProps;
         this.editing = false;
       }
       if (data.error) {
         this.snackBar.open(data.error, 'ok', {
           duration: 1000,
         })
       }
     })
   } else {
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

  editFunction(user: UserProps) {
    this.showNewUserComponent = true;
    this.editing = true;
    if (this.editUserData?._id) {
      this.usersData.unshift(this.editUserData)
      this.dataSource = new MatTableDataSource(this.usersData);
    }
    this.editUserData = user;
    this.usersData = this.usersData.filter(({_id}) => user._id !== _id)
    this.dataSource = new MatTableDataSource(this.usersData);
  }
}
