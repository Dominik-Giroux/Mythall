import { Component, OnInit } from '@angular/core';
import { ZoneService, IZone } from '../../../../services/zone.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';

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

  zones: IZone[];

  ngOnInit() {
    this._getZones();
  }

  private async _getZones(): Promise<void> {
    this.zones = await this.zoneService.getZones();
  }

  public confirm(item: IZone): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.zoneService.deleteZone(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}