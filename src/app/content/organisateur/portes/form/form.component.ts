import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { PorteService, IPorte } from '../../../../services/porte.service';


@Component({
  selector: 'app-organisateur-portes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurPortesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private porteService: PorteService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  porte: IPorte = {} as IPorte;

  ngOnInit() {
    this._getPorte();
  }

  private _getPorte(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.porte = await this.porteService.getPorte(this.id);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.id) {
      const result = await this.porteService.updatePorte(this.porte)
      if (result) {
        this.toast.update(result.nom);
        this.router.navigate(["/organisateur/portes/list"]);
      }
    } else {
      const result = await this.porteService.addPorte(this.porte)
      if (result) {
        this.toast.add(result.nom);
        this.router.navigate(["/organisateur/portes/list"]);
      }
    }
  }

}