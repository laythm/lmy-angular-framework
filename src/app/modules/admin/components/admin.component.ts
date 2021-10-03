import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent  {
    
  constructor(private _auth: AuthenticationService,
    private router: Router) {}
 
    logout(): void {
      this._auth.logout();
      this.router.navigate(['/'], {});
    }
}
