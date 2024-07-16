import { Component } from '@angular/core';

@Component({
  selector: 'app-activation-success',
  templateUrl: './activation-success.component.html',
  styleUrl: './activation-success.component.scss'
})
export class ActivationSuccessComponent {
  message = 'Account attivato con successo! Ora puoi accedere al nostro servizio.';
}
