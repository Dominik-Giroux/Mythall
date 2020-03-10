import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/@core/toast.service';
import { ZoneService } from '../../../../services/zone.service';
import { Zone } from '../../../../models/zone';

@Component({
  selector: 'app-organisateur-zones-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganisateurZonesFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private zoneService: ZoneService
  ) { }

  id: string;
  zone: Zone = new Zone();

  ngOnInit() {
    this.getZone();
  }

  getZone() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.zoneService.getZone(this.id).subscribe(response => {
          this.zone = response;
        });
      }
    });
  }

  submit() {

    if (this.id) {

      // Update
      this.zoneService.updateZone(this.zone).subscribe(result => {
        if (result) {
          this.toast.update(this.zone.nom);
          this.router.navigate(["/organisateur/zones/list"]);
        }
      });

    } else {

      // Add
      this.zoneService.addZone(this.zone).subscribe(result => {
        if (result) {
          this.toast.add(this.zone.nom);
          this.router.navigate(["/organisateur/zones/list"]);
        }
      });

    }
  }

}