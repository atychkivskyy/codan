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

  @ViewChild('myChart1', {static: false}) myChart1: ElementRef | undefined;
  @ViewChild('myChart2', {static: false}) myChart2: ElementRef | undefined;
  @ViewChild('myChart3', {static: false}) myChart3: ElementRef | undefined;
  @ViewChild('myChart4', {static: false}) myChart4: ElementRef | undefined;

  constructor(private influxDBService:InfluxDBService) { }

  influxData:any;
  myChart: Chart | undefined;
  myChart_2: Chart | undefined;
  myChart_3: Chart | undefined;
  myChart_4: Chart | undefined;


  ngOnInit() {
    // Aquí puedes inicializar tus datos si es necesario
    interval(5000).subscribe(() => {
      this.getDataAndUpdateChart();
    });
  }

  ngAfterViewInit() {
    this.createFirstChart();
    this.createSecondChart();
    this.createThirdChart();
    this.createFourthChart();
    // Llama a la función para obtener los datos inicialmente
    this.getDataAndUpdateChart();
  }

  getDataAndUpdateChart() {
    this.influxDBService.getDataFromInfluxDB().subscribe({
      next: (groupedData: { [key: string]: any[] }) => {
        this.updateChartData(groupedData);
        console.log(groupedData)
      },
      error: (error: any) => {
        console.error('Error fetching data from InfluxDB:', error);
        // Maneja el error si es necesario
      }
    });
  }
  
  
  
  updateChartData(data: any) {
    // Filtramos los datos para obtener solo los relacionados con la temperatura
    const temperatureData = data.filter((entry: any) => entry.field === 'temperature');
    const humidityData = data.filter((entry: any) => entry.field === 'humidity');
    const co2Data = data.filter((entry: any) => entry.field === 'co2');
    const volatileData = data.filter((entry: any) => entry.field === 'volatile');
  
    // Función para actualizar los datos de un gráfico
    const updateChart = (chart: Chart | undefined, sensorData: any[]) => {
      if (!chart) return;
  
      // Creamos un objeto para almacenar los datos de cada sensor
      const sensorDataset: { [key: string]: any[] } = {};
  
      // Agrupamos los datos por ID de sensor
      sensorData.forEach((entry: any) => {
        const sensorId = entry.id;
        if (!sensorDataset[sensorId]) {
          sensorDataset[sensorId] = [];
        }
        sensorDataset[sensorId].push({ value: entry.value, time: entry.startTime });
      });
  
      // Actualizamos los datos de cada dataset con los datos correspondientes a cada sensor
      Object.keys(sensorDataset).forEach((sensorId: string, index: number) => {
        if (chart?.data.datasets && chart.data.datasets[index]) {
          chart.data.datasets[index].data = sensorDataset[sensorId].map((entry: any) => entry.value);
        }
      });
  
      // Actualizamos las etiquetas del eje x
      const labels: string[] = [];
      const latestDataTime = new Date(sensorData[sensorData.length - 1].startTime);
      const oldestAllowedTime = new Date(latestDataTime);
      oldestAllowedTime.setMinutes(latestDataTime.getMinutes() - 30); // 30 minutos antes del último dato
      const maxLabels = 6;
      let remainingLabels = maxLabels;
  
      // Agregar hasta 6 etiquetas o hasta que no haya más datos
      for (let i = sensorData.length - 1; i >= 0 && remainingLabels > 0; i--) {
        const time = new Date(sensorData[i].startTime);
        if (time >= oldestAllowedTime) {
          labels.unshift(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
          remainingLabels--;
        }
      }
  
      // Rellenar con el valor de la siguiente etiqueta si no hay suficientes datos
      while (remainingLabels > 0) {
        labels.unshift(labels[0]);
        remainingLabels--;
      }
  
      // Actualizamos las etiquetas del eje x
      chart.data.labels = labels;
  
      // Actualizamos el gráfico
      chart.update();
    };
  
    // Actualizar cada gráfico con los datos correspondientes
    updateChart(this.myChart, temperatureData);
    updateChart(this.myChart_2, humidityData);
    updateChart(this.myChart_3, co2Data);
    updateChart(this.myChart_4, volatileData);
  }
  
  
  

  createFirstChart() {
    if (this.myChart1) {
      const ctx = this.myChart1.nativeElement.getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Sensor 1',
            data: [0],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            tension: 0.4,
          },
          {
            label: 'Sensor 2',
            data: [0],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 3',
            data: [0],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 128, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 4',
            data: [0],
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 5',
            data: [0],
            borderColor: 'yellow',
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            tension: 0.2,
          }]
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
      this.myChart=new Chart(ctx, config);
    }
  }

  createSecondChart() {
    if (this.myChart2) {
      const ctx = this.myChart2.nativeElement.getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Sensor 1',
            data: [0],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            tension: 0.4,
          },
          {
            label: 'Sensor 2',
            data: [0],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 3',
            data: [0],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 128, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 4',
            data: [0],
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 5',
            data: [0],
            borderColor: 'yellow',
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            tension: 0.2,
          }]
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
      this.myChart_2=new Chart(ctx, config);
    }
  }

  createThirdChart() {
    if (this.myChart3) {
      const ctx = this.myChart3.nativeElement.getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Sensor 1',
            data: [0],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            tension: 0.4,
          },
          {
            label: 'Sensor 2',
            data: [0],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 3',
            data: [0],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 128, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 4',
            data: [0],
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 5',
            data: [0],
            borderColor: 'yellow',
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            tension: 0.2,
          }]
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
      this.myChart_3=new Chart(ctx, config);
    }
  }

  createFourthChart(){
    if (this.myChart4) {
      const ctx = this.myChart4.nativeElement.getContext('2d');
      const config = {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Sensor 1',
            data: [0],
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            tension: 0.4,
          },
          {
            label: 'Sensor 2',
            data: [0],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 3',
            data: [0],
            borderColor: 'green',
            backgroundColor: 'rgba(0, 128, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 4',
            data: [0],
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.5)',
            tension: 0.2,
          },
          {
            label: 'Sensor 5',
            data: [0],
            borderColor: 'yellow',
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            tension: 0.2,
          }]
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
      this.myChart_4=new Chart(ctx, config);
    }
  }

}

