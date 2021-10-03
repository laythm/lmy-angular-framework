import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


import {  AuthenticationService } from '../../../../core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'main-app',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

export class MainComponent {
    constructor(public translate: TranslateService) { }
}
