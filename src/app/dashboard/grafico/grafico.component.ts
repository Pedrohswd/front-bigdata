import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartItem } from 'chart.js';
import { Tomada } from '../../models/tomada';
import { ChartModule } from 'primeng/chart';
import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-grafico',
  imports: [CommonModule, ChartModule],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.css'
})
export class GraficoComponent implements OnInit {
  private http = inject(HttpClient);
  constructor(@Inject(PLATFORM_ID) private platformId: any, private cd: ChangeDetectorRef) { }
  mediaPorAparelho: any;
  data: any
  aparelhos: string[] = [];
  
  @ViewChild('lineChart', { static: true }) lineChartRef!: ElementRef;
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef;
  @ViewChild('avgChart', { static: true }) avgChartRef!: ElementRef;


  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return; // 👉 evita erro no SSR

    this.http.get<{ dados: Tomada[] }>('https://api-bigdata.onrender.com/dados').subscribe(response => {
      const dados = response.dados;

      const lineLabels = dados.map(d =>
        new Date(d.data_hora_salvamento).toLocaleTimeString()
      );
      const lineData = dados.map(d => d.energia_ativa_consumida);

      new Chart(this.lineChartRef.nativeElement as ChartItem, {
        type: 'line',
        data: {
          labels: lineLabels,
          datasets: [{
            label: 'Consumo Total (kWh)',
            data: lineData,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            fill: true,
          }]
        },
        options: {
          responsive: true,
        }
      });
  
      const porTomada: Record<string, number[]> = {};
      dados.forEach(d => {
        const key = d.identificador_tomada;
        if (!porTomada[key]) porTomada[key] = [];
        porTomada[key].push(d.consumo_hora);
      });

      this.aparelhos = Object.keys(porTomada);
      const totalPorAparelho = this.aparelhos.map(k =>
        porTomada[k].reduce((sum, val) => sum + val, 0)
      );
      this.mediaPorAparelho = this.aparelhos.map(k =>
        porTomada[k].reduce((sum, val) => sum + val, 0) / porTomada[k].length
      );

      new Chart(this.barChartRef.nativeElement as ChartItem, {
        type: 'bar',
        data: {
          labels: this.aparelhos,
          datasets: [{
            label: 'Total por Aparelho (kWh)',
            data: totalPorAparelho,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
        }
      });

      new Chart(this.avgChartRef.nativeElement as ChartItem, {
        type: 'pie',
        data: {
          labels: this.aparelhos,
          datasets: [{
            label: 'Média por Aparelho (kWh)',
            data: this.mediaPorAparelho,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
          }]
        },
        options: {
          responsive: true,
        }
      });
    });

  }
}