import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { InteractionDto } from 'src/app/shared/services/inquiry/entities/interaction.dto';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html'
})
export class InteractionsComponent implements OnInit, OnChanges {

  interactions: Array<InteractionDto>;

  interactionsPage: number;

  interactionsPageSize = 4;

  collectionSize: number;

  @Input() inquiryId: string;

  @Input() countAdded = 0;

  constructor(
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.interactionsPage = 1;
    // this.inquiryId = '5af3b09d-1e9d-e911-a962-000d3a454e11';
    this.getInteractions(this.interactionsPage);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    if (changes.countAdded && this.countAdded > 0 && (changes.countAdded.currentValue !== changes.countAdded.previousValue)) {
      this.interactionsPage = 1;
      this.getInteractions(this.interactionsPage);
    }
  }

  getInteractions(page) {
    this.interactionsPage = page;
    this.customerService.getInteractionsByInquiryId(this.inquiryId, this.interactionsPage, this.interactionsPageSize)
      .subscribe(interactions => {
        this.interactions = interactions.data;
        this.collectionSize = interactions.count;
        console.log(interactions);
      }, error => {
        console.log(error);
      });
  }

}
