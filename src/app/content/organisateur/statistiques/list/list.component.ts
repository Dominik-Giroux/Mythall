import { Component, OnInit } from '@angular/core';
import { StatistiqueService, IStatistique } from '../../../../services/statistique.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-organisateur-statistiques-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurStatistiquesListComponent implements OnInit {

  constructor(
    private statistiqueService: StatistiqueService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  statistiques: IStatistique[];

  ngOnInit() {
    this._getStatistiques();
  }

  private async _getStatistiques(): Promise<void> {
    this.statistiques = await this.statistiqueService.getStatistiques();
  }

  public confirmDelete(item: IStatistique): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.statistiqueService.deleteStatistique(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}