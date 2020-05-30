import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { IAlignement, AlignementService } from '../../../../../services/alignement.service';

@Component({
  selector: 'creation-progression-alignements',
  templateUrl: './alignement.component.html'
})
export class JoueurPersonnageCreationProgressionAlignementComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private alignementService: AlignementService,
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedAlignement: IAlignement;
  availableAlignements: IAlignement[] = [];

  ngOnInit() {
    this._getAvailableAlignements();
  }

  public get isCompleted(): boolean {
    return !!this.selectedAlignement;
  }

  private async _getAvailableAlignements(): Promise<void> {
    this.availableAlignements = await this.alignementService.getAvailableAlignements(this.personnage);
  }


  public setAlignement(): void {
    this.personnage.alignementRef = this.selectedAlignement.id;
    this.personnage.alignement = this.selectedAlignement;
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