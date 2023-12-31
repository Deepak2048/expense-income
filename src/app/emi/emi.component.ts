import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BasicInfoServiceService } from '../service/basic-info-service.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-emi',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './emi.component.html',
  styleUrl: './emi.component.css',
})
export class EmiComponent implements OnInit {
  basicInformationList: any[] = [];
  filteredBasicInformationList: any[] = [];

  filterType: string | null = null;
  filterCategory: string | null = null;

  allIncome: any;
  allExpense: any;
  allCategory: any;

  constructor(
    private basicInfoServiceService: BasicInfoServiceService,
  ) {}
  ngOnInit(): void {
    this.findAllBasicInformation();
    // this.RenderStats()
    // this.getIncome();
    // this.getExpense();
    this.mostUsedCategory();
  }

  title: string = '';
  description: string = '';
  amount: string = '';
  type: string = '';
  category: string = '';
  files: File[] = [];
  date: string = '';

  emi() {
    this.basicInfoServiceService
      .addBasicInformation({
        title: this.title,
        description: this.description,
        amount: this.amount,
        type: this.type,
        category: this.category,
        files: this.files,
        date: this.date,
      })
      .subscribe({
        next: (data) => {
          alert("successfully!")
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  findAllBasicInformation() {
    this.basicInfoServiceService.listBasicInformation().subscribe({
      next: (data) => {
        this.filteredBasicInformationList = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteBasicInfo(id: number) {
    this.basicInfoServiceService.deleteBasicInformation(id).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.basicInformationList = data;
        } else if (
          data &&
          typeof data === 'object' &&
          Object.keys(data).length === 0
        ) {
          this.basicInformationList = [];
        } else {
          console.error('Invalid response after deletion:', data);
        }
        alert('deleted successfully!');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  filterBasicInfo() {
    this.basicInfoServiceService.listBasicInformation().subscribe({
      next: (data) => {
        this.filteredBasicInformationList = data.filter((info: any) => {
          const typeCondition =
            !this.filterType || info.type === this.filterType;
          const categoryCondition =
            !this.filterCategory || info.category === this.filterCategory;

          return typeCondition && categoryCondition;
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getIncome() {
    this.basicInfoServiceService.listBasicInformation().subscribe({
      next: (data) => {
        console.log('************', data);

        const incomeData = data.filter((info: any) => {
          console.log('info  type', info.type === 'income');
          return info.type === 'income';
        });
        console.log('-------------------', incomeData);

        return (this.allIncome = incomeData);
      },
      error: (error) => {
        console.log('got error while listing income', error);
      },
    });
  }

  getExpense() {
    this.basicInfoServiceService.listBasicInformation().subscribe({
      next: (data) => {
        const expenseData = data.filter((info: any) => {
          return info.type === 'expense';
        });
        console.log('expenseData', expenseData);

        return (this.allExpense = expenseData);
      },
      error: (error) => {
        console.log('got error while listing expense', error);
      },
    });
  }

  mostUsedCategory() {
    this.basicInfoServiceService.listBasicInformation().subscribe({
      next: (data) => {
        // const categoryCounts = {};
        const categoryCounts: { [key: string]: number } = {};
        data.forEach((item: any) => {
          const category = item.category;
          console.log('category', category);

          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        // Find the most used category
        let mostUsedCategory = null;
        let maxCount = 0;

        for (const category in categoryCounts) {
          if (categoryCounts[category] > maxCount) {
            mostUsedCategory = category;
            maxCount = categoryCounts[category];
          }
        }

        console.log('Most used category:', mostUsedCategory);
        console.log('Count:', maxCount);
      },
      error: (error) => {
        console.log('got error while find most used category', error);
      },
    });
  }

  RenderStats(){
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    const myStats = new Chart(
      'acquisitions',
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map(row => row.count)
            }
          ]
        },
        options:{
          scales:{
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }
}
