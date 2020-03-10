import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';
import { EcoleService } from '../../../../services/ecole.service';
import { Ecole } from '../../../../models/ecole';
import { Observable } from 'rxjs';

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

  ecoles: Observable<Ecole[]>;

  ngOnInit() {
    this.ecoles = this.ecoleService.getEcoles$();
  }

  confirmDelete(item: Ecole) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ecoleService.deleteEcole(result.id).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}
