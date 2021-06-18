import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';
import { ImmuniteService, IImmunite } from '../../../../services/immunite.service';

@Component({
  selector: 'app-organisateur-immunites-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurImmunitesListComponent implements OnInit {

  constructor(
    private immuniteService: ImmuniteService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  immunites: IImmunite[];

  ngOnInit() {
    this._getImmunites();
  }

  private async _getImmunites(): Promise<void> {
    this.immunites = await this.immuniteService.getImmunites();
  }

  public confirmDelete(item: IImmunite): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.immuniteService.deleteImmunite(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}