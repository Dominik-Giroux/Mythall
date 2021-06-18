import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StatistiqueService, IStatistique } from '../../../../services/statistique.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-organisateur-statistiques-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurStatistiquesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private statistiqueService: StatistiqueService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  statistique = {} as IStatistique;

  ngOnInit() {
    this._getStatistique();
  }

  private _getStatistique(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.statistique = await this.statistiqueService.getStatistique(this.id);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.id) {

      // Update
      const result = await this.statistiqueService.updateStatistique(this.statistique);
      if (result) {
        this.toast.update(result.nom);
        this.router.navigate(["/organisateur/statistiques/list"]);
      }

    } else {

      // Add
      const result = await this.statistiqueService.addStatistique(this.statistique);
      if (result) {
        this.toast.add(result.nom);
        this.router.navigate(["/organisateur/statistiques/list"]);
      }

    }
  }

}