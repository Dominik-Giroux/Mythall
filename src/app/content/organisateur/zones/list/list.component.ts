import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ZoneService } from '../../../../services/zone.service';
import { Zone } from '../../../../models/zone';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/@core/toast.service';

@Component({
  selector: 'app-organisateur-zones-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurZonesListComponent implements OnInit {

  constructor(
    private zoneService: ZoneService,
    public dialog: MatDialog,
    private toast: ToastService
  ) { }

  zones: Observable<Zone[]>;

  ngOnInit() {
    this.zones = this.zoneService.getZones$();
  }

  confirmDelete(item: Zone) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.zoneService.deleteZone(result.id).subscribe(res => this.toast.delete(result.nom));
      }
    });
  }

}