import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { ZoneService, IZone } from '../../../../services/zone.service';

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
  zone: IZone = {} as IZone;

  ngOnInit() {
    this.getZone();
  }

  public getZone(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.zone = await this.zoneService.getZone(this.id);
      }
    });
  }

  public async submit(): Promise<void> {

    if (this.id) {

      // Update
      const result = await this.zoneService.updateZone(this.zone);
      if (result) {
        this.toast.update(this.zone.nom);
        this.router.navigate(["/organisateur/zones/list"]);
      }

    } else {

      // Add
      const result = await this.zoneService.addZone(this.zone);
      if (result) {
        this.toast.add(this.zone.nom);
        this.router.navigate(["/organisateur/zones/list"]);
      }

    }
  }

}