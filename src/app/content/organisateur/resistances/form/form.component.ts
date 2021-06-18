import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResistanceService, IResistance } from '../../../../services/resistance.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-organisateur-resistances-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurResistancesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private resistanceService: ResistanceService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  resistance = {} as IResistance;

  ngOnInit() {
    this._getResistance();
  }

  private _getResistance(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.resistance = await this.resistanceService.getResistance(this.id);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.id) {

      // Update
      const result = await this.resistanceService.updateResistance(this.resistance);
      if (result) {
        this.toast.update(result.nom);
        this.router.navigate(["/organisateur/resistances/list"]);
      }

    } else {

      // Add
      const result = await this.resistanceService.addResistance(this.resistance);
      if (result) {
        this.toast.add(result.nom);
        this.router.navigate(["/organisateur/resistances/list"]);
      }
    }
  }

}