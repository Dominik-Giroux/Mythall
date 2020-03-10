import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';
import { ResistanceService } from '../../../../services/resistance.service';
import { Resistance } from '../../../../models/resistance';
import { Observable } from 'rxjs';

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

  resistances: Observable<Resistance[]>;

  ngOnInit() {
    this.resistances = this.resistanceService.getResistances$();
  }

  confirmDelete(item: Resistance) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resistanceService.deleteResistance(result.id).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}