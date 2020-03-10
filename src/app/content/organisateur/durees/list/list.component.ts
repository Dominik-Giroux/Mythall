import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';
import { DureeService } from '../../../../services/duree.service';
import { Duree } from '../../../../models/duree';
import { Observable } from 'rxjs';

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

  durees: Observable<Duree[]>;

  ngOnInit() {
    this.durees = this.dureeService.getDurees$();
  }

  confirmDelete(item: Duree) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dureeService.deleteDuree(result).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}