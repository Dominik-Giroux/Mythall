import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/@core/user.service';
import { User } from '../../../../services/@core/models/user';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-animateur-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AnimateurUsersListComponent implements OnInit {

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ){}

  users: User[];
  sortedData: any;
  filter: any = {
    displayname: '',
    email: '',
    role: ''
  };

  ngOnInit(){
    this.userService.getUsers().subscribe(response => {
      this.users = response;
      this.sortedData = this.users.slice();
    });
  }

  confirmDelete(item: User) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.displayname, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delete(result);
      }
    });
  }

  delete(user: User){
    this.userService.deleteUser(user);
  }

  filterResult(user: User): boolean{

    let result: boolean = true;

    if(this.filter.displayname){
      if(!user.displayname.toLowerCase().includes(this.filter.displayname.toLowerCase())){
        result = false;
      }
    }

    if(this.filter.email){
      if(!user.email.toLowerCase().includes(this.filter.email.toLowerCase())){
        result = false;
      }
    }

    if(this.filter.role){

      result = false;

      if(this.filter.role == "joueur"){
        if(user.roles.joueur){
          result = true;
        }
      }

      if(this.filter.role == "animateur"){
        if(user.roles.animateur){
          result = true;
        }
      }

      if(this.filter.role == "organisateur"){
        if(user.roles.organisateur){
          result = true;
        }
      }

    }

    return result;

  }
  
  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction == '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'displayname': return compare(a.displayname, b.displayname, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'role': return compare(a.roles, b.roles, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}