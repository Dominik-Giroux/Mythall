import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IEsprit, EspritService } from '../../../../../services/esprit.service';

@Component({
  selector: 'creation-progression-esprits',
  templateUrl: './esprit.component.html'
})
export class JoueurPersonnageCreationProgressionEspritComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private espritService: EspritService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedEsprit: IEsprit;
  availableEsprits: IEsprit[] = [];

  ngOnInit() {
    this._getAvailableEsprits();
  }

  public get isCompleted(): boolean {
    return this.selectedEsprit ? true : false;
  }

  private async _getAvailableEsprits(): Promise<void> {
    this.availableEsprits = await this.espritService.getAvailableEsprits();
  }

  public setEsprit(): void {
    this.personnage.espritRef = this.selectedEsprit.id;
    this.personnage.esprit = this.selectedEsprit;
  }

  public async next(): Promise<void> {
    if (this.isCompleted) {

      // Rebuild Personnage
      const personnage = await this.personnageService.buildPersonnage(this.personnage);

      // Emit & Allow next step
      this.personnageChange.emit(personnage);
      this.completedChange.emit(true);

    }
  }

}