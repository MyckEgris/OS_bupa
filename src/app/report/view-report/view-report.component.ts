/**
* ViewReportComponent
*
* @description: this class view Report Component.
* @author Jaime Trujillo.
* @version 1.0
* @date 16-03-2020.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as pbi from 'powerbi-client';
import { ReportService } from 'src/app/shared/services/report/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ReportConfiguration } from 'src/app/shared/services/report/entities/ReportConfiguration';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';


/**
 * this class view Report Component.
 */
@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html'
})
export class ViewReportComponent implements OnInit, OnDestroy {
  /**
   * Report Reference.
   */
  public reportReference: string;

  public reportElementId: string;
  /**
   * Report Configurations.
   */
  private reportConfigurations: ReportConfiguration[];

  /**
   * Change Language Subscription.
   */
  private changeLanguageSubscription: Subscription;

  /**
   * Report Container Name.
   */
  public REPORT_CONTAINER = 'reportsContainer';

  /**
   * Error Title Prefix.
   */
  private ERROR_TITLE = 'REPORT.VIEW_REPORT.ERRORS.TITLE_';

  /**
   * Error Message Prefix.
   */
  private ERROR_MESSAGE = 'REPORT.VIEW_REPORT.ERRORS.MESSAGE_';

  /**
   * Constructor of the class.
   * @param reportService Report Service.
   * @param activeRouter Active Router Service.
   * @param translate Translate Service.
   * @param translationService  Translation Service.
   * @param notification Notification Service.
   */
  constructor(
    private reportService: ReportService,
    private activeRouter: ActivatedRoute,
    private translate: TranslateService,
    private translationService: TranslationService,
    private notification: NotificationService,
    private router: Router) { }

  /**
   * Ng On Init Method.
   */
  ngOnInit() {
    this.applyNotReusePageOnChange();
    this.addOnChangeLanguage();
    this.activeRouter.params.subscribe(params => {
      this.reportReference = params['reportreference'];
      this.reportElementId = this.REPORT_CONTAINER + this.reportReference;
      this.getReport();
    }, error => {
      console.error(error);
    });
  }

  /**
   * Method for apply not reuse page on change.
   */
  applyNotReusePageOnChange() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  /**
   * Ng On Destroy Method.
   */
  ngOnDestroy() {
    if (this.changeLanguageSubscription) {
      this.changeLanguageSubscription.unsubscribe();
    }
  }

  /**
   * Add OnChange Language Method.
   */
  addOnChangeLanguage() {
    this.changeLanguageSubscription = this.translate.onLangChange.subscribe(() => {
      if (this.reportConfigurations) {
        this.router.navigate(['reports/view-report/' + this.reportReference]);
      }
    });
  }

  /**
   * Get Report.
   */
  getReport() {
    this.reportService.getReportConfigurations(this.reportReference).subscribe(
      response => {
        this.reportConfigurations = response;
        this.changeReport();
      },
      error => {
          if (this.checkIfIsBusinessError(error)) {
           this.showError(error);
          }
        }
      );
  }

  /**
   * Change Report.
   */
  changeReport() {
    // try {
      const languageId = this.translationService.getLanguage();
      const reportConfiguration = this.reportConfigurations.find(x => x.language === languageId);
      if (reportConfiguration) {
        this.loadReport(reportConfiguration);
      }
    // } catch {}
  }

  /**
   * Check is a Business Error.
   * @param error error
   */
  checkIfIsBusinessError(error: { status: number; }) {
    return error.status === 404;
  }

  /**
   * Load Report.
   * @param reportConfiguration report configuration.
   */
  loadReport(reportConfiguration: ReportConfiguration) {
    const reportConfig = {
      type: 'report',
      uniqueId: reportConfiguration.reportId,
      embedUrl: reportConfiguration.embedUrl,
      accessToken: reportConfiguration.accessToken
    };

    const reportsContainer = <HTMLElement>document.getElementById(this.reportElementId);
    const powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    const report = powerbi.embed(
      reportsContainer,
      reportConfig
    );
    // Report.off removes a given event handler if it exists.
    report.off('loaded');
    // Report.on will add an event handler which prints to Log window.
    report.on('loaded', function() {
    });
    report.off('pageChanged');
    report.on('pageChanged', e => {
    });
    report.on('error', function(event) {
      report.off('error');
    });
  }

  /**
   * Show error.
   * @param error error to show.
   */
  async showError(error) {
    const ErrorTitle = await this.translate.get(`${this.ERROR_TITLE}${error.status}`).toPromise();
    const ErrorMessage = await this.translate.get(`${this.ERROR_MESSAGE}${error.status}`).toPromise();
    this.notification.showDialog(ErrorTitle, ErrorMessage);
  }
}
