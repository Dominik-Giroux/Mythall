import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { EcoleService } from '../../../../services/ecole.service';
import { PorteService } from '../../../../services/porte.service';
import { SortService } from '../../../../services/sorts/sort.service';
import { DureeService } from '../../../../services/duree.service';
import { ZoneService } from '../../../../services/zone.service';
import { Sort } from '../../../../services/sorts/models/sort';
import { Ecole } from '../../../../models/ecole';
import { Porte } from '../../../../models/porte';
import { Duree } from '../../../../models/duree';
import { Zone } from '../../../../models/zone';

@Component({
  selector: 'app-organisateur-sorts-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurSortsFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private sortService: SortService,
    private ecoleService: EcoleService,
    private porteService: PorteService,
    private dureeService: DureeService,
    private zoneService: ZoneService,
    private router: Router
  ){}

  id: string;
  sort: Sort = new Sort();
  ecoles: Observable<Ecole[]>;
  portes: Observable<Porte[]>;
  durees: Observable<Duree[]>;
  zones: Observable<Zone[]>;

  ngOnInit() {
    this.getSort();
    this.getEcoles();
    this.getPortes();
    this.getDurees();
    this.getZones();
  }

  getSort() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']){
        this.id = params['id'];
        this.sortService.getSort(this.id).subscribe(response => {
          this.sort = this.sortService.map(response);
        });
      }
    });
  }

  getEcoles() {
    this.ecoles = this.ecoleService.getEcoles();
  }

  getPortes() {
    this.portes = this.porteService.getPortes();
  }

  getDurees() {
    this.durees = this.dureeService.getDurees();
  }

  getZones() {
    this.zones = this.zoneService.getZones();
  }

  submit() {
    if(this.id){
      this.sortService.updateSort(this.id, this.sort.saveState()).then(result => {
        if(result){
          this.router.navigate(["/organisateur/sorts/list"]);
        }
      });
    } else {
      this.sortService.addSort(this.sort.saveState()).then(result => {
        if(result){
          this.router.navigate(["/organisateur/sorts/list"]);
        }
      });
    }    
  }

}