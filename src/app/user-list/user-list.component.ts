import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { UserDetailsService } from '../shared/user-details.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements AfterViewInit, OnInit {

  title = 'userManagement';
  data: any;
  errorMessage: any;

  displayedColumns: string[] = ['#', 'Image', 'First Name', 'Last Name', 'Birth Date', 'Blood Group'];
  dataSource = new MatTableDataSource<User>();

  constructor(private userDetail: UserDetailsService) { }

  @ViewChild(MatPaginator) paginator !: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getUserDetail()
  }

  getUserDetail() {
    this.userDetail.getData('users').subscribe(
      (response) => {
        this.dataSource.data = response.users;
        console.log(this.dataSource)
      },
      (error) => {
        this.errorMessage = error;
        console.error('There was an error!', error);
      }
    );
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  exportToExcel() {
    const displayedColumns = ['#', 'Image', 'First Name', 'Last Name', 'Birth Date', 'Blood Group'];

    // Prepare the data for export
    const exportData = this.dataSource.data.map((row, index) => {
      return {
        '#': index + 1,
        'Image': row.image,
        'First Name': row.firstName,
        'Last Name': row.lastName,
        'Birth Date': this.formatDate(row.birthDate),
        'Blood Group': row.bloodGroup,
      };
    });

    // Convert the data to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Add headers with styling
    XLSX.utils.sheet_add_aoa(ws, [
      displayedColumns
    ], { origin: 'A1' });

    // Define the column widths
    ws['!cols'] = [
      { wpx: 50 },   // Serial number column
      { wpx: 150 },  // Image column
      { wpx: 150 },  // First Name column
      { wpx: 150 },  // Last Name column
      { wpx: 100 },  // Birth Date column
      { wpx: 100 },  // Blood Group column
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users List');

    XLSX.writeFile(wb, 'user-data.xlsx');
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString('en-GB') : '';
  }

}

export interface User {
  image: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  bloodGroup: string;
  //Add other properties if necessary
}
