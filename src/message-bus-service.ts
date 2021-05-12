import { Subject, Observable, Subscription } from 'rxjs';
import { filter, share, shareReplay, takeUntil, multicast } from 'rxjs/operators';

export interface Message {
  appId: string;
  channelId: string;
  message: string;
}

export class MessageBusService {

  private messagesSubject: Subject<Message> = new Subject<Message>();
  public messages$: Observable<Message> = this.messagesSubject.asObservable();

  private subscriptions: Array<Subscription> = [];

  constructor() {
  }

  publish(message: Message) {
    this.messagesSubject.next(message);
  }

  subscribe(id: string, channel: string): Observable<Message> {
    // const subscription = this.messages$.pipe(
    //   filter(m => m.id === id)
    // );
    // this.subscriptions = [...this.subscriptions, subscription.subscribe().];
    return this.messages$.pipe(
      filter(m => m.channelId === channel)
    );
  }

  unsubscribe(id: string, channel: string) {
    // this.subscriptions
    console.log('TODO: manage unsubscription', { id, channel });
  }
}

