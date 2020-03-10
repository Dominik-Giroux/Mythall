import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/@core/toast.service';
import { ImmuniteService } from '../../../../services/immunite.service';
import { Immunite } from '../../../../models/immunite';

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
  immunite: Immunite = new Immunite();

  ngOnInit() {
    this.getImmunite();
  }

  getImmunite() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.immuniteService.getImmunite(this.id).subscribe(response => {
          this.immunite = response;
        });
      }
    });
  }

  submit() {
    if (this.id) {

      // Update
      this.immuniteService.updateImmunite(this.immunite).subscribe(result => {
        if (result) {
          this.toast.update(result.nom);
          this.router.navigate(["/organisateur/immunites/list"]);
        }
      });

    } else {

      // Add
      this.immuniteService.addImmunite(this.immunite).subscribe(result => {
        if (result) {
          this.toast.add(result.nom);
          this.router.navigate(["/organisateur/immunites/list"]);
        }
      });
      
    }
  }

}