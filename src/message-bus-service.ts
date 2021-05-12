import { Subject, Observable } from 'rxjs';
import { filter, share, shareReplay } from 'rxjs/operators';

export interface Message {
  id: string;
  message: string;
}

export class MessageBusService {

  private messagesSubject: Subject<Message> = new Subject<Message>();
  public messages$: Observable<Message> = this.messagesSubject.asObservable();

  constructor() {
  }

  publish(message: Message) {
    this.messagesSubject.next(message);
  }

  subscribe(id: string): Observable<Message> {
    return this.messages$.pipe(
      filter(m => m.id === id),
    );
  }

  unsubscribe(id: string) {
    // TODO
  }
}

