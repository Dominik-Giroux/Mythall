import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdreService } from '../../../../services/ordres/ordre.service';
import { Ordre } from '../../../../services/ordres/models/ordre';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-organisateur-ordres-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurOrdresListComponent implements OnInit {

  constructor(
    private ordreService: OrdreService,
    public dialog: MatDialog
  ) { }

  ordres: Observable<Ordre[]>;

  ngOnInit() {
    this.ordres = this.ordreService.getOrdres();
  }

  confirmDelete(item: Ordre) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(result);
      }
    });
  }

  delete(ordre: Ordre) {
    this.ordreService.deleteOrdre(ordre);
  }

}