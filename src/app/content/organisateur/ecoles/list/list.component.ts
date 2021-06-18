import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';
import { EcoleService, IEcole } from '../../../../services/ecole.service';

@Component({
  selector: 'app-organisateur-ecoles-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurEcolesListComponent implements OnInit {

  constructor(
    private ecoleService: EcoleService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  ecoles: IEcole[];

  ngOnInit() {
    this._getEcoles();
  }

  private async _getEcoles(): Promise<void> {
    this.ecoles = await this.ecoleService.getEcoles();
  }

  public async confirmDelete(item: IEcole) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.ecoleService.deleteEcole(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}
