import { Component } from '@angular/core';
import { Alignement } from '../../../../migration/models/alignement';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-organisateur-alignements-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class OrganisateurAlignementsListComponent {

  constructor(
    public dialog: MatDialog,
  ) { }

  alignements = Object.values(Alignement);

}