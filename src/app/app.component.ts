import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { GraficoComponent } from './dashboard/grafico/grafico.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GraficoComponent, HttpClientModule],
  template: `
    <h1>Dashboard de Consumo</h1>
    <app-grafico></app-grafico>
  `
})
export class AppComponent {
  title = 'frontend-dashboard';
}
