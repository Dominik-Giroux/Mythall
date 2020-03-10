import { Component, OnInit } from '@angular/core';
import { DieuService } from '../../../../services/dieu.service';
import { Dieu } from '../../../../models/dieu';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organisateur-dieux-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurDieuxListComponent implements OnInit {

  constructor(
    private dieuService: DieuService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  dieux: Observable<Dieu[]>;

  ngOnInit() {
    this.dieux = this.dieuService.getDieux$()
  }

  confirmDelete(item: Dieu) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe((result: Dieu) => {
      this.dieuService.deleteDieu(result.id).subscribe(res => this.toast.delete(result.nom));
    });
  }

}