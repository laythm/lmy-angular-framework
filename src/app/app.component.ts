import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthenticationService, MessageServiceCommonKeys } from './core';
import { MessageService, RolesEnum } from './core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  canAccessAdmin: boolean;
  loggedIn: boolean;
  processing: boolean;
  messageSubscription: Subscription;
  showNavbar: boolean;
  routeLoading: boolean;

  constructor(private _auth: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    public translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document) {
    this.setInternationalization();
    this.setInfo();

    var processesCounter = 0;
    this.messageSubscription = this.messageService.getMessage().subscribe(message => {
      if (message.key == MessageServiceCommonKeys.processing_start) {
        processesCounter++;
      } else if (message.key == MessageServiceCommonKeys.processing_end) {
        processesCounter--;
      } else if (message.key == MessageServiceCommonKeys.userLoggedIn) {
        this.setInfo();
      } else if (message.key == MessageServiceCommonKeys.userLoggedOut) {
        this.router.navigate(['/'], {});
        this.setInfo();
      }

      if (processesCounter > 0) {
        this.processing = true;
      } else {
        this.processing = false;
      }
    });


    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.routeLoading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.routeLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  setInternationalization() {
    this.translateService.addLangs(['en', 'ar']);
    this.translateService.setDefaultLang('ar');
    var savedLang = localStorage.getItem('lang');

    if (savedLang) {
      this.setLang(savedLang);

    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.setLang(browserLang.match(/en|ar/) ? browserLang : 'en');
    }
  }

  setInfo() {
    this.loggedIn = this._auth.getCurrentUser != null;
    this.canAccessAdmin = this._auth.getCurrentUserHasRole(RolesEnum.Admin);
  }

  logout(): void {
    this._auth.logout();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.messageSubscription.unsubscribe();
  }

  changeLanguage() {
    let lang = '';

    if (this.translateService.currentLang == 'ar') {
      lang = 'en';

    } else {
      lang = 'ar';
    }

    this.setLang(lang);
  }

  setLang(lang) {
    localStorage.setItem('lang', lang);
    //this.document.documentElement.lang = lang;
    this.translateService.use(lang).subscribe(r => {
      this.document.documentElement.dir = this.translateService.instant('dir');
    });
  }
}
