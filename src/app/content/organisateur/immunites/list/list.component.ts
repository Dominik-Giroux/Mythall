import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';
import { ImmuniteService } from '../../../../services/immunite.service';
import { Immunite } from '../../../../models/immunite';
import { Observable } from 'rxjs';

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

  immunites: Observable<Immunite[]>;

  ngOnInit() {
    this.immunites = this.immuniteService.getImmunites$();
  }

  confirmDelete(item: Immunite) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.immuniteService.deleteImmunite(result.id).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}