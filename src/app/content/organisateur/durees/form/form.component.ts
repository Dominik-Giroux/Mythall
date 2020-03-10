import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/@core/toast.service';
import { DureeService } from '../../../../services/duree.service';
import { Duree } from '../../../../models/duree';

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
  duree: Duree = new Duree();

  ngOnInit() {
    this.getDuree();
  }

  getDuree() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.dureeService.getDuree(this.id).subscribe(response => {
          this.duree = response;
        });
      }
    });
  }

  submit() {
    if (this.id) {

      // Update
      this.dureeService.updateDuree(this.duree).subscribe(result => {
        if (result) {
          this.toast.update(result.nom);
          this.router.navigate(["/organisateur/durees/list"]);
        }
      });

    } else {

      // Add
      this.dureeService.addDuree(this.duree.saveState()).subscribe(result => {
        if (result) {
          this.toast.add(result.nom);
          this.router.navigate(["/organisateur/durees/list"]);
        }
      });

    }
  }

}