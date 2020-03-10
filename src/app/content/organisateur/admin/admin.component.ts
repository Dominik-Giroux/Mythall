import { Component, OnInit } from '@angular/core';
import { MigrationPersonnageService } from '../../../migration/scripts/migration-personnage.service';

@Component({
  selector: 'app-organisateur-admin',
  templateUrl: './admin.component.html'
})
export class OrganisateurAdminComponent implements OnInit {

  constructor(
    private migrationPersonnage: MigrationPersonnageService,
  ) { }

  async ngOnInit() {
    await this.migrationPersonnage.migratePersonnage('uI5G5QdrjuiBXFOq4Upz');
  }

}