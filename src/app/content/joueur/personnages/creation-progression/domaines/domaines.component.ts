import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage, Choix } from '../../../../../services/personnage.service';
import { IDomaine, DomaineService } from '../../../../../services/domaine.service';

@Component({
  selector: 'creation-progression-domaines',
  templateUrl: './domaines.component.html'
})
export class JoueurPersonnageCreationProgressionDomainesComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private domaineService: DomaineService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;
  @Input() choixPersonnage: Choix[];

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedDomaines: IDomaine[] = [];
  availableDomaines = [];
  quantity = [];
  currentIndex: number = 0;

  ngOnInit() {
    this._getAvailableDomaines();

    // Get the amount of domaines to choose
    this.choixPersonnage.forEach((choix) => {
      if (choix.type == 'domaine' && choix.quantite > 0) {
        this.quantity = Array(choix.quantite).fill(1).map((x, i) => i); // Crée un array de la quantité de choix [1,2,3,...]
      }
    });

  }

  public get isCompleted(): boolean {
    return (this.selectedDomaines && this.selectedDomaines.length == this.quantity.length) ? true : false;
  }

  private async _getAvailableDomaines(): Promise<void> {
    this.availableDomaines[this.currentIndex] = await this.domaineService.getAvailableDomaines(this.personnage);
  }

  public setDomaine(index): void {

    // Set Current Index
    this.currentIndex = index + 1;

    // Set Current domaine
    if (!this.personnage.domaines) this.personnage.domaines = [];
    if (!this.personnage.domainesRef) this.personnage.domainesRef = [];

    this.personnage.domaines[index] = this.selectedDomaines[index];
    this.personnage.domainesRef[index] = this.selectedDomaines[index].id;

    // Refresh List of Available domaines
    this._getAvailableDomaines();

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