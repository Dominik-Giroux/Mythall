import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IDieu, DieuService } from '../../../../../services/dieu.service';

@Component({
  selector: 'creation-progression-dieus',
  templateUrl: './dieu.component.html'
})
export class JoueurPersonnageCreationProgressionDieuComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private dieuService: DieuService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedDieu: IDieu;
  availableDieus: IDieu[] = [];

  ngOnInit() {
    this._getAvailableDieux();
  }

  public get isCompleted(): boolean {
    return this.selectedDieu ? true : false;
  }

  private async _getAvailableDieux(): Promise<void> {
    this.availableDieus = await this.dieuService.getAvailableDieux(this.personnage);
  }

  public setDieu(): void {
    this.personnage.dieuRef = this.selectedDieu.id;
    this.personnage.dieu = this.selectedDieu;
  }

  public async next(): Promise<void> {
    if (this.isCompleted) {

      // Rebuild Personnage
      const personnage = await this.personnageService.buildPersonnage(this.personnage);

      // Emit & Allow next step
      this.personnageChange.emit(personnage);
      this.completedChange.emit(true);
      setTimeout(() => {
        this.stepper.next();
      });

    }
  }

}