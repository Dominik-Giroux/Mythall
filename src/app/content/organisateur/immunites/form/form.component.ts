import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { ImmuniteService, IImmunite } from '../../../../services/immunite.service';

@Component({
  selector: 'app-organisateur-immunites-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurImmunitesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private immuniteService: ImmuniteService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  immunite = {} as IImmunite;

  ngOnInit() {
    this.getImmunite();
  }

  private getImmunite(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.immunite = await this.immuniteService.getImmunite(this.id);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.id) {

      // Update
      const result = await this.immuniteService.updateImmunite(this.immunite);
      if (result) {
        this.toast.update(result.nom);
        this.router.navigate(["/organisateur/immunites/list"]);
      }

    } else {

      // Add
      const result = await this.immuniteService.addImmunite(this.immunite);
      if (result) {
        this.toast.add(result.nom);
        this.router.navigate(["/organisateur/immunites/list"]);
      }

    }
  }

}