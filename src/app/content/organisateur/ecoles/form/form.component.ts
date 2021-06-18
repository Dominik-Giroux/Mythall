import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EcoleService, IEcole } from '../../../../services/ecole.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-organisateur-ecoles-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurEcolesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private ecoleService: EcoleService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  ecole = {} as IEcole;

  ngOnInit() {
    this._getEcole();
  }

  private _getEcole(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.ecole = await this.ecoleService.getEcole(this.id);
      }
    });
  }

  public async submit(): Promise<void> {

    if (this.id) {

      // Update
      const result = await this.ecoleService.updateEcole(this.ecole);
      if (result) {
        this.toast.update(result.nom);
        this.router.navigate(["/organisateur/ecoles/list"]);
      }

    } else {

      // Add
      const result = await this.ecoleService.addEcole(this.ecole);
      if (result) {
        this.toast.add(result.nom);
        this.router.navigate(["/organisateur/ecoles/list"]);
      }

    }
  }

}