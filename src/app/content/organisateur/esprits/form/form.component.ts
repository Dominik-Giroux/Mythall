import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AptitudeService } from '../../../../services/aptitudes/aptitude.service';
import { DonService } from '../../../../services/dons/don.service';
import { EspritService } from '../../../../services/esprits/esprit-service';
import { SortService } from '../../../../services/sorts/sort.service';

import { AptitudeItem, Aptitude } from '../../../../services/aptitudes/models/aptitude';
import { Don, DonItem } from '../../../../services/dons/models/don';
import { Esprit } from '../../../../services/esprits/models/esprit';
import { Sort, SortItem } from '../../../../services/sorts/models/sort';

@Component({
  selector: 'app-organisateur-esprits-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurEspritsFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private aptitudeService: AptitudeService,
    private donService: DonService,
    private espritService: EspritService,
    private sortService: SortService,
    private router: Router
  ){}

  id: string;
  esprit: Esprit = new Esprit();
  aptitudes: Aptitude[];
  dons: Don[];
  sorts: Sort[];

  ngOnInit() {
    this.getEsprit();
    this.getaptitudes();
    this.getDons();
    this.getSorts();
  }

  getEsprit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']){
        this.id = params['id'];
        this.espritService.getEsprit(this.id).subscribe(response => {
          this.esprit = response;
        });
      }
    });
  }

  getaptitudes() {
    this.aptitudeService.getAptitudes().subscribe(response => {
      this.aptitudes = response;
    })
  }

  getDons() {
    this.donService.getDons().subscribe(response => {
      this.dons = response;
    })
  }

  getSorts(){
    this.sortService.getSorts().subscribe(response => {
      this.sorts = response;
    })
  }

  submit() {
    if(this.id){
      this.espritService.updateEsprit(this.id, this.esprit.saveState()).then(result => {
        if(result){
          this.router.navigate(["/organisateur/esprits/list"]);
        }
      });
    } else {
      this.espritService.addEsprit(this.esprit.saveState()).then(result => {
        if(result){
          this.router.navigate(["/organisateur/esprits/list"]);
        }
      });
    }    
  }

  addAptitude(){
    if(!this.esprit.aptitudes) this.esprit.aptitudes = [];
    this.esprit.aptitudes.push(new AptitudeItem());
  }

  deleteAptitude(index: number){
    this.esprit.aptitudes.splice(index, 1);
  }

  addDon(){
    if(!this.esprit.dons) this.esprit.dons = [];
    this.esprit.dons.push(new DonItem());
  }

  deleteDon(index: number){
    this.esprit.dons.splice(index, 1);
  }

  addSort(){
    if(!this.esprit.sorts) this.esprit.sorts = [];
    this.esprit.sorts.push(new SortItem());
  }

  deleteSort(index: number){
    this.esprit.sorts.splice(index, 1);
  }

}