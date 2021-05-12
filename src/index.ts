import { fromEvent, Observable } from 'rxjs';
import { filter, pluck, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { Message, MessageBusService } from './message-bus-service';

const messageService: MessageBusService = new MessageBusService();
const $inputMessage: HTMLInputElement = document.querySelector('#input__message');
const $inputChannel: HTMLSelectElement = document.querySelector('#input__channel');
const $inputButtonSend: HTMLButtonElement = document.querySelector('#input__send');

const messageInputChanged$: Observable<string> = fromEvent($inputMessage, 'change').pipe(
  pluck('target', 'value'),
  startWith($inputMessage.value),
) as Observable<string>;

const channelInputChanged$: Observable<string> = fromEvent($inputChannel, 'change').pipe(
  pluck('target', 'value'),
  startWith($inputChannel.value),
  filter((i: string) => i && i.length > 0),
) as Observable<string>;

const sendButtonClicked$ = fromEvent($inputButtonSend, 'click');

sendButtonClicked$.pipe(
  withLatestFrom(messageInputChanged$, channelInputChanged$),
  tap(([e, message, channel]) => {
    messageService.publish('app1', 'event1', channel, { message });
  })
).subscribe();

// CHANNEL 1
messageService.subscribe('app1', 'event1', 'channel1', (detail) => addMessageToChannel({
  channel: 'channel1',
  event: 'event1',
  detail
}));
// CHANNEL 2
messageService.subscribe('app1', 'event1', 'channel2', (detail) => addMessageToChannel({
  channel: 'channel2',
  event: 'event1',
  detail
}));

// APP 1 - CHANNEL 1
messageService.subscribe('app1', 'event1', 'channel1', (detail) => addMessageToApp({
  applicationId: 'app1',
  channel: 'channel1',
  event: 'event1',
  detail
}));
// APP 2 - CHANNEL 2
messageService.subscribe('app2', 'event1', 'channel2', (detail) => addMessageToApp({
  applicationId: 'app2',
  channel: 'channel2',
  event: 'event1',
  detail
}));
// APP 3 - CHANNEL 1
messageService.subscribe('app3', 'event1', 'channel1', (detail) => addMessageToApp({
  applicationId: 'app3',
  channel: 'channel1',
  event: 'event1',
  detail
}));

setTimeout(() => {
  console.log('Delayed subcription to channel2 for app3');
  // APP 3 - CHANNEL 2
  messageService.subscribe('app3', 'event1', 'channel2', (detail) => addMessageToApp({
    applicationId: 'app3',
    channel: 'channel2',
    event: 'event1',
    detail
  }));
  setTimeout(() => {
    console.log('Delayed unsubcription to channel2 for app3');
    messageService.unsubscribe('app3', 'event1', 'channel2', (detail) => console.log('unsubscribed', detail));
  }, 10000);

}, 7000);

function addMessageToChannel({ channel, event, detail }: Partial<Message>) {
  const $channel = document.querySelector(`#${ channel }`);
  $channel.innerHTML = `${ $channel.innerHTML }<li>${ detail?.message }</li>`;
  $channel.scrollTo(0, $channel.scrollHeight);
}

function addMessageToApp({ applicationId, event, detail }: Partial<Message>) {
  const $app = document.querySelector(`#${ applicationId }`);
  $app.innerHTML = `${ $app.innerHTML }<li>${ detail?.message }</li>`;
  $app.scrollTo(0, $app.scrollHeight);
}
