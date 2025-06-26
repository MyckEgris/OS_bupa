import { Component, OnInit, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { MyPortfolioService } from 'src/app/security/services/my-portfolio/my-portfolio.service';
import { MyPortfolioReducer } from 'src/app/security/reducers/my-portfolio.reducer';
import { MyPortfolioModel, AgentIdModel } from 'src/app/security/model/my-portfolio.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-portfolio-container',
  templateUrl: './view-portfolio-container.component.html',
  styleUrls: ['./view-portfolio-container.component.css']
})
export class ViewPortfolioContainerComponent implements OnInit {

  constructor(private service: MyPortfolioService,
    private authService: AuthService,
    private router: Router) {
    this.agentsStoareged = [];
    this.dropdownArray = [];
    this.breadcrumbArray = [];
  }

  public model: any;
  public breadcrumbArray: AgentIdModel[];
  public dropdownArray: AgentIdModel[];
  public breadcrumbMaxSize = 4;
  private agentsStoareged: AgentIdModel[] = [];
  private currentAgentId: string;
  private rootAgentId: string;
  public childUrl = '';

  ngOnInit() {
    this.childUrl = 'agents/view-portfolio';
    const agentStoraged = this.service.getMyPortfolioFromReduxStorage();
    if (agentStoraged === undefined) {
      this.currentAgentId = this.authService.getUser().agent_number;
      this.rootAgentId = this.currentAgentId;
      const defaultAgentIdModel = {} as AgentIdModel;
      defaultAgentIdModel.agentId = this.currentAgentId;
      this.breadcrumbArray.push(defaultAgentIdModel);
      this.agentsStoareged.push(defaultAgentIdModel);
    } else {
      this.breadcrumbArray = agentStoraged.agents;
      this.agentsStoareged = agentStoraged.agents;
      this.rootAgentId = agentStoraged.rootAgentId;
      this.currentAgentId = agentStoraged.currentAgentId;
    }
  }

  buildBreadcrumb() {

    this.breadcrumbArray = this.breadcrumbArray.slice(0, this.breadcrumbMaxSize);

    if (this.agentsStoareged.length > this.breadcrumbMaxSize) {
      this.dropdownArray = this.agentsStoareged.slice(this.breadcrumbMaxSize);
    }
  }

  navigateBack(e: Event, agentId: string) {
    e.preventDefault();
    const agents = this.agentsStoareged.slice(0, this.agentsStoareged.findIndex(x => x.agentId === agentId) + 1);
    const portfolioInstance = {} as MyPortfolioModel;
    portfolioInstance.agents = agents;
    portfolioInstance.rootAgentId = this.rootAgentId;
    portfolioInstance.currentAgentId = agentId;
    this.service.setMyPortfolioStore(portfolioInstance);
    this.router.navigate(['/' + this.childUrl]);
  }


}
