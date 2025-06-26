/**
* Component for pay confirmation receive
*
* @description: This class receive the pay confirmation from Santander Bank
* @author Edwin Javier Sanabria Mesa.
* @version 1.0
* @date 10-07-2020.
*
**/
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { SessionStorage } from 'src/app/shared/services/cache/cache.index';

@Component({
  selector: 'app-payment-result-mex',
  template: ''
})

export class PaymentResultMexComponent implements OnInit {

  success: any;
  nuAut: any;
  operacion: any;
  fecha: any;
  banco: any;
  marca: any;
  nb_merchant: any;
  nbResponse: any;
  sucursal: any;
  empresa: any;
  importe: any;
  referenciaPayment: any;
  referencia: any;
  nbMoneda: any;
  cdEmpresa: any;
  urlTokenId: any;
  idLiga: any;
  email: any;
  cdResponse: string;
  rejectedDescription: string;
  isProcessing = true;
  stateConfirmation: string;
  pathResponseImage: string;
  isRejected = false;
  nb_error: string;
  rejectedBy: string;
  public user: UserInformationModel;
  public isAuserAnonymous;

  // Payment Date.
  public sysdate = new Date();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private config: ConfigurationService) {

    this.route.queryParams.subscribe(params => {
      this.success = params['success'];
      this.nuAut = params['nuAut'];
      this.operacion = params['operacion'];
      this.fecha = params['fecha'];
      this.banco = params['banco'];
      this.marca = params['marca'];
      this.nb_merchant = params['nb_merchant'];
      this.nbResponse = params['nbResponse'];
      this.nb_error = params['nb_error'];
      this.sucursal = params['sucursal'];
      this.empresa = params['empresa'];
      this.importe = params['importe'];
      this.referencia = params['referencia'];
      this.referenciaPayment = params['referenciaPayment'];
      this.nbMoneda = params['nbMoneda'];
      this.cdEmpresa = params['cdEmpresa'];
      this.urlTokenId = params['urlTokenId'];
      this.idLiga = params['idLiga'];
      this.email = params['email'];
      this.cdResponse = params['cdResponse'];
    });
  }

  getConsolidatedAnswer(): any {
    const consolidatedAnswer = {
      success: this.success,
      nuAut: this.nuAut,
      operacion: this.operacion,
      fecha: this.fecha,
      banco: this.banco,
      marca: this.marca,
      nb_merchant: this.nb_merchant,
      nbResponse: this.nbResponse,
      nb_error: this.nb_error,
      sucursal: this.sucursal,
      empresa: this.empresa,
      importe: this.importe,
      referencia: this.referencia,
      referenciaPayment: this.referenciaPayment,
      nbMoneda: this.nbMoneda,
      cdEmpresa: this.cdEmpresa,
      urlTokenId: this.urlTokenId,
      idLiga: this.idLiga,
      email: this.email,
      cdResponse: this.cdResponse
    };

    return consolidatedAnswer;
  }

  ngOnInit() {
    const targetOrigin = this.getUrl();
    parent.postMessage(this.getConsolidatedAnswer(), targetOrigin);

  }

  getUrl(): any {
    const portNumber = location.port ? ':'.concat(location.port) : '';
    const url = window.location.protocol + '//'
    + window.location.hostname
    + portNumber
    + '/payments/payment-process/'
    + sessionStorage.getItem(this.config.KEY_POLICY_ID) ;
    sessionStorage.removeItem(this.config.KEY_POLICY_ID);
    return url;
  }
}
