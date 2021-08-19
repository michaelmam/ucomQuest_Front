import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FileService } from 'src/app/shared/service/file.service';
export interface FileData {
  createdAt: string;
  fileHref: string;
  fileType: "photo" | 'video';
  updatedAt: string;
  userCode: string
  userId: string
  userTeamName: string;
  _id: string;
}
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  displayedColumns: string[] = [
    'userTeamName',
    'userCode',
    'created At',
    'file',
    'download',
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  files: FileData[] = []
  dataSource = new MatTableDataSource(this.files);
  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.fileService.getFiles().subscribe((data: FileData[]) => {
      this.files = data
      this.dataSource = new MatTableDataSource(this.files);
      this.dataSource.paginator = this.paginator as MatPaginator;
    })
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(element: FileData) {

  }

  date(data: string) {
    return new Date(data).toLocaleString()
  }

  open(url: string){
      window.open(url, "_blank");
  }
}
