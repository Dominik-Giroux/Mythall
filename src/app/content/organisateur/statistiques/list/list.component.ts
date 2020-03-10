import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StatistiqueService } from '../../../../services/statistique.service';
import { Statistique } from '../../../../models/statistique';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';

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

  statistiques: Observable<Statistique[]>;

  ngOnInit() {
    this.statistiques = this.statistiqueService.getStatistiques$();
  }

  confirmDelete(item: Statistique) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.statistiqueService.deleteStatistique(result.id).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}