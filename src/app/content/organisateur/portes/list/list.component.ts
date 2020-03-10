import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';
import { PorteService } from '../../../../services/porte.service';
import { Porte } from '../../../../models/porte';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organisateur-portes-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurPortesListComponent implements OnInit {

  constructor(
    private porteService: PorteService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  portes: Observable<Porte[]>;

  ngOnInit() {
    this.portes = this.porteService.getPortes$();
  }

  confirmDelete(item: Porte) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.porteService.deletePorte(result.id).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}