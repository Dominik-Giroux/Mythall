import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ResistanceService } from '../../../../services/resistance.service';
import { Resistance } from '../../../../models/resistance';
import { ToastService } from '../../../../services/@core/toast.service';

@Component({
  selector: 'app-organisateur-resistances-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurResistancesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private resistanceService: ResistanceService,
    private router: Router,
    private toast: ToastService
  ) { }

  id: string;
  resistance: Resistance = new Resistance();

  ngOnInit() {
    this.getResistance();
  }

  getResistance() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.resistanceService.getResistance(this.id).subscribe(response => {
          this.resistance = response;
        });
      }
    });
  }

  submit() {
    if (this.id) {

      // Update
      this.resistanceService.updateResistance(this.resistance).subscribe(result => {
        if (result) {
          this.toast.update(result.nom);
          this.router.navigate(["/organisateur/resistances/list"]);
        }
      });

    } else {

      // Add
      this.resistanceService.addResistance(this.resistance).subscribe(result => {
        if (result) {
          this.toast.add(result.nom);
          this.router.navigate(["/organisateur/resistances/list"]);
        }
      });
    }
  }

}