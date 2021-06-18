import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { IDuree, DureeService, IDureeDB } from '../../../../services/duree.service';

@Component({
  selector: 'app-organisateur-durees-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurDureesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private dureeService: DureeService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  duree: IDuree = {} as IDuree;

  ngOnInit() {
    this._getDuree();
  }

  private async _getDuree(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.duree = await this.dureeService.getDuree(this.id);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.id) {

      // Update
      const result = await this.dureeService.updateDuree(this.duree);
      if (result) {
        this.toast.update(result.nom);
        this.router.navigate(["/organisateur/durees/list"]);
      }

    } else {

      // Add
      const result = await this.dureeService.addDuree(this.duree);
      if (result) {
        this.toast.add(result.nom);
        this.router.navigate(["/organisateur/durees/list"]);
      }

    }
  }

}