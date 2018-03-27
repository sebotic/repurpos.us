/*
 * Service for GA events, the main GA script is injected in app-routing.module
 */
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

  constructor() { }

  /*
   * Send an event to google analytics
   */
  public emitEvent(eventCategory: string, eventAction: string, eventLabel: string = null, eventValue: number = null) {
    (<any>window).ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }

}
