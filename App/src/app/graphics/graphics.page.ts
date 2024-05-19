import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InfluxDBService } from '../influx-db.service';

import * as Chart from 'chart.js';
import { interval } from 'rxjs';

@Component({
  selector: 'app-principal',
  templateUrl: './graphics.page.html',
  styleUrls: ['./graphics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class GraphicsPage implements OnInit, AfterViewInit {
  @ViewChild('myChart0', { static: false }) myChart0: ElementRef | undefined;
  @ViewChild('myChart1', { static: false }) myChart1: ElementRef | undefined;
  @ViewChild('myChart2', { static: false }) myChart2: ElementRef | undefined;
  @ViewChild('myChart3', { static: false }) myChart3: ElementRef | undefined;
  @ViewChild('myChart4', { static: false }) myChart4: ElementRef | undefined;

  temperature: number = 0;
  range_temp: string ="";
  selectedSegment: string = 'temperature';

  isAdmin: String = 'No'; //Para el menu

  constructor(private influxDBService: InfluxDBService) { }

  fields = ["temperature", "humidity", "volatile", "co2"];
  myChart: Chart | undefined;
  myChart_0: Chart| undefined;
  myChart_2: Chart | undefined;
  myChart_3: Chart | undefined;
  myChart_4: Chart | undefined;

  ngOnInit() {
    interval(5000).subscribe(() => {
      this.getDataAndUpdateChart();
    });
    this.isAdmin = localStorage.getItem('isAdmin') === 'true' ? 'Yes' : 'No';
  }

  ngAfterViewInit() {
    this.createCharts();
    this.getDataAndUpdateChart();
  }

  generateLabels(sensorData: any[]): string[] {
    const labels: string[] = [];
    if (sensorData.length > 0) {
      const now = new Date();
      for (let i = 4; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 1000);
        labels.push(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
      }
    }
    return labels;
  }

  createCharts() {
    this.createChart(this.myChart1, (chart) => this.myChart = chart);
    this.createChart(this.myChart2, (chart) => this.myChart_2 = chart);
    this.createChart(this.myChart3, (chart) => this.myChart_3 = chart);
    this.createChart(this.myChart4, (chart) => this.myChart_4 = chart);
    this.createChart_radar(this.myChart0, (chart) => this.myChart_0 = chart);
  }

  createChart(elementRef: ElementRef | undefined, setChart: (chart: Chart) => void) {
    if (elementRef) {
      const ctx = elementRef.nativeElement.getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels: [],
          datasets: Array.from({ length: 5 }, (_, i) => ({
            label: `Sensor ${i + 1}`,
            data: [],
            borderColor: ['red', 'blue', 'green', 'orange', 'yellow'][i],
            backgroundColor: [`rgba(255, 0, 0, 0.5)`, `rgba(0, 0, 255, 0.5)`, `rgba(0, 128, 0, 0.5)`, `rgba(255, 165, 0, 0.5)`, `rgba(255, 255, 0, 0.5)`][i],
            tension: 0.2,
          }))
        },
        options: {
          animations: {
            radius: {
              duration: 400,
              easing: 'linear',
              loop: (context: any) => context.active
            }
          },
          hoverRadius: 12,
          hoverBackgroundColor: 'yellow',
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          plugins: {
            tooltip: {
              enabled: false
            }
          }
        }
      };
      setChart(new Chart(ctx, config));
    }
  }

  createChart_radar(elementRef: ElementRef | undefined, setChart: (chart: Chart) => void) {
    if (elementRef) {
      const ctx = elementRef.nativeElement.getContext('2d');
      const config = {
        type: 'radar',
        data: {
          labels: this.fields,
          datasets: [{
            label: 'En toda la fábrica',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }]
        },
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          }
        }
      };
      setChart(new Chart(ctx, config));
    }
  }

  getDataAndUpdateChart() {
    this.fields.forEach(field => {
      this.influxDBService.getDataFromInfluxDB(field, "5m").subscribe({
        next: data => {
          this.updateChartData(data, field);
          this.updateChartData_general(data, field)
        },
        error: error => {
          console.error('Error fetching data from InfluxDB:', error);
        }
      });
    });
  }

  updateChartData(data: any[], field: string) {
    let chart: Chart | undefined;
    switch (field) {
      case 'temperature':
        chart = this.myChart;
        break;
      case 'humidity':
        chart = this.myChart_2;
        break;
      case 'co2':
        chart = this.myChart_3;
        break;
      case 'volatile':
        chart = this.myChart_4;
        break;
    }
    if (!chart) return;

    const sensorDataset: { [key: string]: any[] } = {};

    data.forEach(entry => {
      const sensorId = entry.id;
      if (!sensorDataset[sensorId]) {
        sensorDataset[sensorId] = [];
      }
      if (entry.startTime) {
        sensorDataset[sensorId].push({ value: entry.value, time: entry.startTime });
      }
    });

    Object.keys(sensorDataset).forEach((sensorId, index) => {
      if (chart&&chart.data.datasets && chart.data.datasets[index]) {
        chart.data.datasets[index].data = sensorDataset[sensorId].map(entry => entry.value);
      }
    });

    const labels = this.generateLabels(data);
    chart.data.labels = labels;
    chart.update();
  }

  updateChartData_general(data: any[], field: string) {
    const chart = this.myChart_0;
    if (!chart) return;
    const sensorDataset: { [key: string]: any[] } = {};
    let totalSum = 0;
    const index = this.fields.indexOf(field);

    data.forEach(entry => {
      const sensorId = entry.id;
      if (!sensorDataset[sensorId]) {
        sensorDataset[sensorId] = [];
      }
      if (entry.startTime) {
        sensorDataset[sensorId].push({ value: entry.value, time: entry.startTime });
      }
    });

    Object.keys(sensorDataset).forEach((sensorId, index) => { 
        
      let ultimoTiempo = sensorDataset[sensorId].reduce((anterior, actual) => {
        return (new Date(actual.time) > new Date(anterior.time)) ? actual : anterior;
      });
      totalSum += ultimoTiempo.value;
    });

    const average = Number((totalSum/5).toFixed(2));

    if (index !== -1 && chart.data.datasets && chart.data.datasets[0].data) {
      chart.data.datasets[0].data[index] = average;
    }

    if(field === "temperature"){
      this.temperature = average;
      switch (true) {
        case (average < 0):
            this.range_temp = "demasiado frio"
            break;
        case (average < 20):
            this.range_temp = "rasca"
            break;
        case (average >= 20 && average <= 30):
            this.range_temp = "la temperatura idónea"
            break;
        case (average > 30 && average <= 35):
            this.range_temp = "calorcete"
            break;
        case (average > 35):
            this.range_temp = "demasiado calor"
            break;
        default:
            this.range_temp = "una temperatura desconocida"
            break;
      }
    } 

    chart.update();
  }

  segmentChanged(event: any) {
    console.log(event.target.value)
    this.selectedSegment=event.target.value;
  }
}
