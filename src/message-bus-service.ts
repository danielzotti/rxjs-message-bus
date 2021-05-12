import { Subject, Observable, Subscription } from 'rxjs';
import { filter, share, map } from 'rxjs/operators';

export interface Message {
  applicationId: string;
  channel: string;
  event: string;
  detail: any;
}

export class MessageBusService {

  private messagesSubject: Subject<Message> = new Subject<Message>();
  private messages$: Observable<Message> = this.messagesSubject.asObservable();

  private subscriptions: Record<string, Subscription> = {};

  constructor() {
  }


  public subscribe(applicationId: string, event: string, channel: string, callback: (e: any) => any): void {
    const subscription = this.messages$.pipe(
      filter(m => m.channel === channel && m.event === event), // m.applicationId === applicationId &&
      map(m => m.detail),
      share()
    ).subscribe(callback);
    this.subscriptions = {
      ...this.subscriptions,
      [MessageBusService.getSubscriptionId(applicationId, channel, event)]: subscription
    };
  }


  public unsubscribe(applicationId: string, event: string, channel: string, callback?: (e?: any) => any): void {
    const subscriptionKey = Object.keys(this.subscriptions).find(s => s === MessageBusService.getSubscriptionId(applicationId, channel, event));
    if(!subscriptionKey) {
      return;
    }
    console.log(`Unsubscribing application "${ applicationId }" from "${ channel }" channel with event "${ event }"...`);
    this.subscriptions[subscriptionKey].unsubscribe();
    delete this.subscriptions[subscriptionKey];
    if(callback) {
      callback();
    }
  }


  public publish(applicationId: string, event: string, channel: string, detail: any = {}) { // applicationId == e.spa
    this.messagesSubject.next({ event, channel, detail, applicationId });
  }

  public removeChannel(channel: string): void {
    // TODO
  }

  private static getSubscriptionId(applicationId: string, channel: string, event: string) {
    return `${ applicationId }___${ channel }___${ event }`;
  }
}

