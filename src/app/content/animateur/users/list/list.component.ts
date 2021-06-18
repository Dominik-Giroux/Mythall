import { Component, OnInit } from '@angular/core';
import { UserService, IUser } from '../../../../services/user.service';
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
  ) { }

  users: IUser[];
  sortedData: any;
  filter: any = {
    displayname: '',
    email: '',
    role: ''
  };

  ngOnInit() {
    this._getUsers();
  }

  private async _getUsers(): Promise<void> {
    this.users = await this.userService.getUsers();
    this.sortedData = this.users.slice();
  }

  confirmDelete(item: IUser) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.displayname, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.userService.deleteUser(result);
      }
    });
  }

  public filterResult(user: IUser): boolean {

    let result: boolean = true;

    if (this.filter.displayname) {
      if (!user.displayname.toLowerCase().includes(this.filter.displayname.toLowerCase())) {
        result = false;
      }
    }

    if (this.filter.email) {
      if (!user.email.toLowerCase().includes(this.filter.email.toLowerCase())) {
        result = false;
      }
    }

    if (this.filter.role) {

      result = false;

      if (this.filter.role == "joueur") {
        if (user.roles.joueur) {
          result = true;
        }
      }

      if (this.filter.role == "animateur") {
        if (user.roles.animateur) {
          result = true;
        }
      }

      if (this.filter.role == "organisateur") {
        if (user.roles.organisateur) {
          result = true;
        }
      }

    }

    return result;

  }

  public sortData(sort: Sort): void {
    const data = this.users.slice();
    if (!sort.active || sort.direction == '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'displayname': return this._compare(a.displayname, b.displayname, isAsc);
        case 'email': return this._compare(a.email, b.email, isAsc);
        case 'role': return this._compare(a.roles, b.roles, isAsc);
        default: return 0;
      }
    });
  }

  private _compare(a, b, isAsc): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}