import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DonService } from '../../../../services/dons/don.service';
import { FourberieService } from '../../../../services/fourberies/fourberie.service';
import { StatistiqueService, IStatistique } from '../../../../services/statistique.service';
import { Fourberie } from '../../../../services/fourberies/models/fourberie';
import { Don } from '../../../../services/dons/models/don';

@Component({
  selector: 'app-organisateur-fourberies-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurFourberiesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private donService: DonService,
    private fourberieService: FourberieService,
    private statistiqueService: StatistiqueService,
    private router: Router
  ) { }

  id: string;
  dons: Don[]
  fourberie: Fourberie = new Fourberie();
  fourberies: Fourberie[];
  statistiques: IStatistique[];

  ngOnInit() {
    this.getFourberie();
    this.getFourberies();
    this.getDons();
    this._getStatistiques();
  }

  getFourberie() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.fourberieService.getFourberie(this.id).subscribe(response => {
          this.fourberie = response;
        });
      }
    });
  }

  getDons() {
    this.donService.getDons().subscribe(response => {
      this.dons = response;
    })
  }

  getFourberies() {
    this.fourberieService.getFourberies().subscribe(response => {
      this.fourberies = response;
    })
  }

  private async _getStatistiques(): Promise<void> {
    this.statistiques =  await this.statistiqueService.getStatistiques();
  }

  submit() {
    if (this.id) {
      this.fourberieService.updateFourberie(this.id, this.fourberie.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/fourberies/list"]);
        }
      });
    } else {
      this.fourberieService.addFourberie(this.fourberie.saveState()).then(result => {
        if (result) {
          this.router.navigate(["/organisateur/fourberies/list"]);
        }
      });
    }
  }

}