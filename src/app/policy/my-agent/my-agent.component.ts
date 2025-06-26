/**
* MyAgentComponent.ts
* Component that shows agent information for policy holders
* @description: MyAgentComponent
* @author Andrés Felipe Tamayo
* @version 1.0
* @date 05-15-2018.
*
**/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyDto } from '../../shared/services/policy/entities/policy.dto';
import {AgentService } from '../../shared/services/agent/agent.service';
import { Agent } from '../../shared/services/agent/entities/agent';
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-my-agent',
  templateUrl: './my-agent.component.html'
})
export class MyAgentComponent implements OnInit {

  /**
   * holds the policy information who is bring by the resolver
   */
  policyInfo: PolicyDto;
  /**
   * Agent information
   */
  currentAgent: Agent;
  /**
   * hold the form information
   */
  formAgent: FormGroup;

  /**
   * Contruct Methos
   * @param _route   route  Injection
   * @param _agentService _agentService injection
   */
  constructor( private _route: ActivatedRoute,
    private _agentService: AgentService) {
    const result = this._route.snapshot.data['policyInfo'];
    this.policyInfo = result.policyInfo;
  }

  /**
   * search if theres a mistake on the route resolver and if it's ok the process starts
   */
  ngOnInit() {

    if (this._route.snapshot.data['policyInfo'].error !== null) {
      this.searchAgent();
    }

  }

  /**
   * Search the agent using his id extracted on the policy information
   */
  private searchAgent() {
    this._agentService.getAgentById( String(this.policyInfo.agent.agentId))
    .subscribe( agent => {
      this.currentAgent = agent;
      this.fillAgentInformation();
    });
  }

  /**
   * Fill the agent information on the form
   */
  private fillAgentInformation() {
    const postalAddress = this.currentAgent.addresses.filter(add => add.type === 'Physical')[0];
    const phisicalPhone = this.currentAgent.phones.filter(phone => phone.type === 'Office')[0];
    const faxPhone = this.currentAgent.phones.filter(phone => phone.type === 'Fax')[0];
    const cellPhone = this.currentAgent.phones.filter(phone => phone.type === 'Portable')[0];
    const Mail =  this.currentAgent.emails.filter(email => email.emailTypeId === 1)[0];

    this.formAgent = new FormGroup({
      'fullName': new FormControl( { value: this._agentService.getAgentName(this.currentAgent), disabled: true} ),
      'phoneOffice': new FormControl( { value: phisicalPhone === undefined ? '' : phisicalPhone.phoneNumber, disabled: true} ),
      'phoneFax': new FormControl( { value: faxPhone === undefined ? '' : faxPhone.phoneNumber, disabled: true} ),
      'cellPhone': new FormControl( { value: cellPhone === undefined ? '' : cellPhone.phoneNumber , disabled: true}),
      'email': new FormControl( { value: Mail === undefined ? '' : Mail.eMailAddress, disabled: true} ),
      'address': new FormControl( { value: postalAddress === undefined ? '' : postalAddress.addressLine, disabled: true} ),
      'postalCity': new FormControl( { value: postalAddress === undefined ? '' : postalAddress.city, disabled: true} ),
      'postalState': new FormControl( { value: postalAddress === undefined ? '' : postalAddress.state, disabled: true} ),
      'postalCountry': new FormControl( { value: postalAddress === undefined ? '' : postalAddress.country, disabled: true} ),
    });

  }
}
