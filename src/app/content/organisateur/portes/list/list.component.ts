import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';
import { PorteService, IPorte } from '../../../../services/porte.service';
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

  portes: IPorte[];

  ngOnInit() {
    this._getPortes();
  }

  private async _getPortes(): Promise<void> {
    this.portes = await this.porteService.getPortes();
  }

  confirmDelete(item: IPorte) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.porteService.deletePorte(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}