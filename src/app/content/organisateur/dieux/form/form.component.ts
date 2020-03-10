import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DieuService } from '../../../../services/dieu.service';
import { Dieu } from '../../../../models/dieu';
import { AlignementService } from '../../../../services/alignement.service';
import { Alignement } from '../../../../models/alignement';
import { Domaine } from '../../../../services/domaines/models/domaine';
import { DomaineService } from '../../../../services/domaines/domaine-service';
import { ToastService } from '../../../../services/@core/toast.service';

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
  dieu: Dieu = new Dieu();
  alignements: Alignement[];
  domaines: Domaine[];

  ngOnInit() {
    this.getDieu();
    this.getDomains();
    this.alignementService.getAlignements().subscribe(result => this.alignements = result);
  }

  getDieu() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.dieuService.getDieu(this.id).subscribe(response => {
          this.dieu = response;
        });
      }
    });
  }

  getDomains() {
    this.domaineService.getDomaines().subscribe(response => {
      this.domaines = response;
    })
  }

  submit() {

    if (this.id) {

      // Update
      this.dieuService.updateDieu(this.dieu).subscribe(result => {
        if (result) {
          this.toast.update(this.dieu.nom);
          this.router.navigate(["/organisateur/dieux/list"]);
        }
      });

    } else {

      // Add
      this.dieuService.addDieu(this.dieu).subscribe(result => {
        if (result) {
          this.toast.add(this.dieu.nom);
          this.router.navigate(["/organisateur/dieux/list"]);
        }
      });

    }
  }

}