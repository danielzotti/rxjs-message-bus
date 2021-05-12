import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { filter, share, shareReplay, takeUntil, multicast, publish } from 'rxjs/operators';

export interface Message {
  appId: string;
  channelId: string;
  message: string;
}

export class MessageBusService {

  private messagesSubject: Subject<Message> = new Subject<Message>();
  public messages$: Observable<Message> = this.messagesSubject.asObservable();

  constructor() {
  }

  publish(message: Message) {
    const { appId, channelId, message: text } = message;
    this.messagesSubject.next({ ...message, message: `[${ appId }/${ channelId }] ${ text }` });
  }

  subscribe(appId: string, channelId: string): Observable<Message> {
    return this.messages$.pipe(
      filter(m => m.channelId === channelId),
      share()
    );
  }
}

