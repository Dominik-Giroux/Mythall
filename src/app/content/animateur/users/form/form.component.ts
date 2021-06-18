import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService, IUser } from '../../../../services/user.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-animateur-users-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AnimateurUsersFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public auth: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) { }

  id: string;
  user = {} as IUser;

  ngOnInit() {
    this._getUser();
  }

  private _getUser(): void {
    this.activatedRoute.params.subscribe(async (params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.user = await this.userService.getUser(this.id);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.id) {
      const result = await this.userService.updateUser(this.user);
      if (result) {
        this.router.navigate(["/animateur/users/list"]);
      };
    }
  }

}