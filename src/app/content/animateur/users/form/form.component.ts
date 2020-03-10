import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../../../services/@core/user.service';
import { User } from '../../../../services/@core/models/user';
import { AuthenticationService } from '../../../../services/@core/authentication.service';

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
  ){}

  id: string;
  user: User = new User();

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']){
        this.id = params['id'];
        this.userService.getUser(this.id).subscribe(response => {
          this.user = this.userService.map(response);
        });
      }
    });
  }

  submit() {
    if(this.id){
      this.userService.updateUser(this.id, this.user.saveState()).then(result => {
        if(result){
          this.router.navigate(["/animateur/users/list"]);
        }
      });
    }    
  }

}