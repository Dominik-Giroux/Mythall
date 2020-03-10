import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EcoleService } from '../../../../services/ecole.service';
import { Ecole } from '../../../../models/ecole';
import { ToastService } from '../../../../services/@core/toast.service';

@Component({
  selector: 'app-organisateur-ecoles-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurEcolesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private ecoleService: EcoleService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  ecole: Ecole = new Ecole();

  ngOnInit() {
    this.getEcole();
  }

  getEcole() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.ecoleService.getEcole(this.id).subscribe(response => {
          this.ecole = response;
        });
      }
    });
  }

  submit() {

    if (this.id) {

      // Update
      this.ecoleService.updateEcole(this.ecole).subscribe(result => {
        if (result) {
          this.toast.update(result.nom);
          this.router.navigate(["/organisateur/ecoles/list"]);
        }
      });

    } else {

      // Add
      this.ecoleService.addEcole(this.ecole).subscribe(result => {
        if (result) {
          this.toast.add(result.nom);
          this.router.navigate(["/organisateur/ecoles/list"]);
        }
      });

    }
  }

}