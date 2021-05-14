import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Message {
  appId: string;
  channelId: string;
  detail: string;
}

export class MessageBusService {

  private messagesSubject: Subject<Message> = new Subject<Message>();
  public messages$: Observable<Message> = this.messagesSubject.asObservable();

  constructor() {
  }

  publish(message: Message) {
    this.messagesSubject.next(message);
    // this.messagesSubject.next({ ...message, detail: `[${ appId }/${ channelId }] ${ text }` });
  }

  subscribe(appId: string, channelId: string): Observable<Message> {
    return this.messages$.pipe(
      filter(m => m.channelId === channelId)
    );
  }

  static add(num1: number, num2: number) {
    return num1 + num2;
  }
}
