import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PersonnageService, IPersonnage } from '../../../../../services/personnage.service';
import { ISort, SortItem, SortService } from '../../../../../services/sort.service';
import { Choix } from '../../../../../services/choix.service';

@Component({
  selector: 'creation-progression-sorts',
  templateUrl: './sorts.component.html'
})
export class JoueurPersonnageCreationProgressionSortsComponent implements OnInit {

  constructor(
    private personnageService: PersonnageService,
    private sortService: SortService
  ) { }

  @Input() stepper: MatStepper;
  @Input() progression: boolean;
  @Input() personnage: IPersonnage;
  @Input() choixPersonnage: Choix[];

  @Output() personnageChange: EventEmitter<IPersonnage> = new EventEmitter<IPersonnage>();
  @Output() completedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedSorts: ISort[] = [];
  availableSorts = [];
  quantity = [];
  currentIndex: number = 0;

  ngOnInit() {
    this._getAvailableSorts();

    // Get the amount of sorts to choose
    if (this.choixPersonnage) {
      this.choixPersonnage.forEach((choix) => {
        if (choix.type == 'sort' && choix.quantite > 0 && !choix.domaine) {
          this.quantity.push(Array(choix.quantite).fill(1).map((x, i) => i)); // Crée un array de la quantité de choix [1,2,3,...]
        }
      });
    }

  }

  public get isCompleted(): boolean {
    return this.selectedSorts && this.selectedSorts.length == this.quantity.length ? true : false;
  }

  private async _getAvailableSorts(): Promise<void> {
    this.availableSorts[this.currentIndex] = await this.sortService.getAvailableSorts(this.personnage);
  }

  setSort(index) {

    // Set Current Index
    this.currentIndex = index + 1;

    // Set Current sort
    if (!this.personnage.sorts) this.personnage.sorts = [];

    const selectedSortItem = new SortItem();
    selectedSortItem.sort = this.selectedSorts[index];
    selectedSortItem.sortRef = this.selectedSorts[index].id;
    selectedSortItem.niveauObtention = this.personnage.niveauReel;

    this.personnage.sorts.push(selectedSortItem);

    // Refresh List of Available sorts
    this._getAvailableSorts();

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