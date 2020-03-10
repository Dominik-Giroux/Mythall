import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StatistiqueService } from '../../../../services/statistique.service';
import { Statistique } from '../../../../models/statistique';
import { ToastService } from '../../../../services/@core/toast.service';

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
  statistique: Statistique = new Statistique();

  ngOnInit() {
    this.getStatistique();
  }

  getStatistique() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.statistiqueService.getStatistique(this.id).subscribe(response => {
          this.statistique = response;
        });
      }
    });
  }

  submit() {
    if (this.id) {

      // Update
      this.statistiqueService.updateStatistique(this.statistique).subscribe(result => {
        if (result) {
          this.toast.update(result.nom);
          this.router.navigate(["/organisateur/statistiques/list"]);
        }
      });

    } else {

      // Add
      this.statistiqueService.addStatistique(this.statistique).subscribe(result => {
        if (result) {
          this.toast.add(result.nom);
          this.router.navigate(["/organisateur/statistiques/list"]);
        }
      });

    }
  }

}