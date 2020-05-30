import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IOrdre, OrdreService } from '../../../../../services/ordre.service';

@Component({
  selector: 'creation-progression-ordres',
  templateUrl: './ordre.component.html'
})
export class JoueurPersonnageCreationProgressionOrdreComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private ordreService: OrdreService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedOrdre: IOrdre;
  availableOrdres: IOrdre[] = [];

  ngOnInit() {
    this._getAvailableOrdres();
  }

  public get isCompleted(): boolean {
    return this.selectedOrdre ? true : false;
  }

  private async _getAvailableOrdres(): Promise<void> {
    this.availableOrdres = await this.ordreService.getAvailableOrdres(this.personnage);
  }

  public setOrdre(): void {
    this.personnage.ordresRef.push(this.selectedOrdre.id);
    this.personnage.ordres.push(this.selectedOrdre);
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