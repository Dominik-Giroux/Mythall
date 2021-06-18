import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';
import { ResistanceService, IResistance } from '../../../../services/resistance.service';

@Component({
  selector: 'app-organisateur-resistances-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurResistancesListComponent implements OnInit {

  constructor(
    private resistanceService: ResistanceService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  resistances: IResistance[];

  ngOnInit() {
    this._getResistances();
  }

  private async _getResistances(): Promise<void> {
    this.resistances = await this.resistanceService.getResistances();
  }

  public confirmDelete(item: IResistance) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.resistanceService.deleteResistance(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}