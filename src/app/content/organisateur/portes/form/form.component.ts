import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/@core/toast.service';
import { PorteService } from '../../../../services/porte.service';
import { Porte } from '../../../../models/porte';


@Component({
  selector: 'app-organisateur-portes-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurPortesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private porteService: PorteService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  porte: Porte = new Porte();

  ngOnInit() {
    this.getPorte();
  }

  getPorte() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.porteService.getPorte(this.id).subscribe(response => {
          this.porte = response;
        });
      }
    });
  }

  submit() {
    if (this.id) {
      this.porteService.updatePorte(this.porte).subscribe(result => {
        if (result) {
          this.toast.update(result.nom);
          this.router.navigate(["/organisateur/portes/list"]);
        }
      });
    } else {
      this.porteService.addPorte(this.porte.saveState()).subscribe(result => {
        if (result) {
          this.toast.add(result.nom);
          this.router.navigate(["/organisateur/portes/list"]);
        }
      });
    }
  }

}