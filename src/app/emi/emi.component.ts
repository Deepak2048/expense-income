import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BasicInfoServiceService } from '../service/basic-info-service.service';
import { Chart } from 'chart.js/auto';

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

  constructor(private basicInfoServiceService: BasicInfoServiceService) {}
  ngOnInit(): void {
    this.findAllBasicInformation();
    this.mostUsedCategory();
    this.statsData();
  }

  title: string = '';
  description: string = '';
  amount: number = 0.0;
  type: string = '';
  category: string = '';
  files: File[] = [];
  date: string = '';

  statData: any;
  amountData: any[] = [];

  totalExpense: number = 0.0;
  totalIncome: number = 0.0;
  balanceAmount: number = 0.0;

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
          alert('successfully!');
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

  statsData() {
    this.basicInfoServiceService.listBasicInformation().subscribe({
      next: (data) => {
        this.statData = data;
        if (data != null) {
          for (let i = 0; i < this.statData.length; i++) {
            if (this.statData[i].type === 'expense') {
              this.totalExpense = this.totalExpense + this.statData[i].amount;
            } else {
              this.totalIncome = this.totalIncome + this.statData[i].amount;
            }

            this.amountData.push(this.statData[i].amount);
          }
          if (this.totalExpense > this.totalIncome) {
            this.balanceAmount = this.totalExpense - this.totalIncome;
          } else {
            this.balanceAmount = this.totalIncome - this.totalExpense;
          }
          this.RenderStats(
            this.totalExpense,
            this.totalIncome,
            this.balanceAmount
          );
        }
      },
      error: (error) => {
        console.log('got error while listing income', error);
      },
    });
  }

  RenderStats(totalExpense: any, totalIncome: any, balanceData: any) {
    new Chart('statsId', {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense', 'Balance sheet', 'Top Category'],
        datasets: [
          {
            label: '# of Expense-Income',
            data: [totalExpense, totalIncome, balanceData],
            borderWidth: 1,
            // backgroundColor:[#36A2EB80],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
