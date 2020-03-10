import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from "@angular/core";

@Injectable()
export class Snackbar extends MatSnackBar {
  
  add(name) {
    this.open(name + " ajouté avec succès.", "Dismiss", {
      duration: 3000,
    });
  }

  update(name) {
    this.open(name + " mise à jour avec succès.", "Dismiss", {
      duration: 3000,
    });
  }

  delete(name) {
    this.open(name + " supprimé avec succès.", "Dismiss", {
      duration: 3000,
    });
  }

}