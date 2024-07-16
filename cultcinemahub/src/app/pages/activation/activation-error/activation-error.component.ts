import { Component } from '@angular/core';

@Component({
  selector: 'app-activation-error',
  templateUrl: './activation-error.component.html',
  styleUrl: './activation-error.component.scss'
})
export class ActivationErrorComponent {
  message = 'Token di attivazione non valido. Controlla la tua email o contatta il supporto.';
}
