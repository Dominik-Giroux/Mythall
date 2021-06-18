import { Component, OnInit } from '@angular/core';
import { IDieu, DieuService } from '../../../../services/dieu.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-organisateur-dieux-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurDieuxListComponent implements OnInit {

  constructor(
    private dieuService: DieuService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  dieux: IDieu[];

  ngOnInit() {
    this._getDieux();
  }

  private async _getDieux(): Promise<void> {
    this.dieux = await this.dieuService.getDieux()
  }

  private async confirmDelete(item: IDieu): Promise<void> {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result: IDieu) => {
      await this.dieuService.deleteDieu(result.id);
      this.toast.delete(result.nom);
    });
  }

}