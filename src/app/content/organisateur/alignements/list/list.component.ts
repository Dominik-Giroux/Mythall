import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../layout/dialogs/delete/delete.dialog.component';
import { ToastService } from '../../../../services/toast.service';
import { IAlignement, AlignementService } from '../../../../services/alignement.service';

@Component({
  selector: 'app-organisateur-alignements-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurAlignementsListComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private toast: ToastService,
    private alignementService: AlignementService,
  ) { }

  alignements: IAlignement[];

  ngOnInit() {
    this._getAlignements();
  }

  private async _getAlignements(): Promise<void> {
    this.alignements = await this.alignementService.getAlignements();
  }

  public async confirmDelete(item: IAlignement): Promise<void> {

    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: 'auto',
      data: { displayname: item.nom, item: item }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.alignementService.deleteAlignement(result.id);
        this.toast.delete(result.nom);
      }
    });
  }

}
