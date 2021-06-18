import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IDieu, DieuService } from '../../../../services/dieu.service';
import { IAlignement, AlignementService } from '../../../../services/alignement.service';
import { DomaineService, IDomaine } from '../../../../services/domaine.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-organisateur-dieux-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurDieuxFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private alignementService: AlignementService,
    private dieuService: DieuService,
    private domaineService: DomaineService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  dieu: IDieu = {} as IDieu;
  alignements: IAlignement[];
  domaines: IDomaine[];

  ngOnInit() {
    this._getDieu();
    this._getDomaines();
    this._getAlignements();
  }

  private async _getDieu(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.dieu = await this.dieuService.getDieu(this.id);
      }
    });
  }

  private async _getDomaines(): Promise<void> {
    this.domaines = await this.domaineService.getDomaines();
  }

  private async _getAlignements(): Promise<void> {
    this.alignements = await this.alignementService.getAlignements();
  }

  public async submit() {

    if (this.id) {

      // Update
      const result = await this.dieuService.updateDieu(this.dieu)
      if (result) {
        this.toast.update(this.dieu.nom);
        this.router.navigate(["/organisateur/dieux/list"]);
      }

    } else {

      // Add
      const result = await this.dieuService.addDieu(this.dieu)
      if (result) {
        this.toast.add(this.dieu.nom);
        this.router.navigate(["/organisateur/dieux/list"]);
      }

    }
  }

}