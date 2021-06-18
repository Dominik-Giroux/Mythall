import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';
import { IDuree, DureeService } from '../../../../services/duree.service';

@Component({
  selector: 'app-organisateur-durees-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurDureesListComponent implements OnInit {

  constructor(
    private dureeService: DureeService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  durees: IDuree[];

  ngOnInit() {
    this._getDurees();
  }

  private async _getDurees(): Promise<void> {
    this.durees = await this.dureeService.getDurees();
  }

  public async confirmDelete(item: IDuree) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.dureeService.deleteDuree(result);
        this.toast.delete(result.nom);
      }
    });
  }

}