import { fromEvent, Observable } from 'rxjs';
import { filter, map, pluck, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Message, MessageBusService } from './message-bus-service';

const messageService: MessageBusService = new MessageBusService();
const $inputMessage: HTMLInputElement = document.querySelector('#input__message');
const $inputChannel: HTMLSelectElement = document.querySelector('#input__channel');
const $inputButtonSend: HTMLButtonElement = document.querySelector('#input__send');
const $inputButtonReset: HTMLButtonElement = document.querySelector('#input__reset');
const $inputForm: HTMLButtonElement = document.querySelector('#input__form');

const messageInputChanged$: Observable<string> = fromEvent($inputMessage, 'change').pipe(
  pluck('target', 'value'),
  startWith($inputMessage.value),
  // tap(message => console.log({ message }))
) as Observable<string>;

const channelInputChanged$: Observable<string> = fromEvent($inputChannel, 'change').pipe(
  pluck('target', 'value'),
  startWith($inputChannel.value),
  filter((i: string) => i && i.length > 0),
  // tap(channel => console.log({ channel }))
) as Observable<string>;

const sendButtonClicked$ = fromEvent($inputButtonSend, 'click');

sendButtonClicked$.pipe(
  withLatestFrom(messageInputChanged$, channelInputChanged$),
  tap(([e, message, channel]) => {
    console.log({ channel, message });
    messageService.publish({ appId: 'app1', channelId: channel, message });
  })
).subscribe();


const ch1 = messageService.subscribe('app1', 'channel1');
const ch2 = messageService.subscribe('app1', 'channel2');

const app1 = messageService.subscribe('app1', 'channel1');
const app2 = messageService.subscribe('app2', 'channel2');
const app3 = messageService.subscribe('app3', 'channel2');

ch1.pipe(tap(res => console.log({ channel1: res }))).subscribe(addMessageToChannel);
ch2.pipe(tap(res => console.log({ channel2: res }))).subscribe(addMessageToChannel);

app1.subscribe((res) => addMessageToApp({
  appId: 'app1',
  channelId: 'channel1',
  message: res.message
}));
app2.subscribe((res) => addMessageToApp({
  appId: 'app2',
  channelId: 'channel2',
  message: res.message
}));


setTimeout(() => {
  console.log('Delayed channel2 subscribed for app3');
  app3.subscribe((res) => addMessageToApp({
    appId: 'app3',
    channelId: 'channel2',
    message: res.message
  }));
  setTimeout(() => {
    console.log('Delayed channel2 unsubscribed for app3');
    messageService.unsubscribe('app3', 'channel2');
  }, 10000);

}, 10000);

function addMessageToChannel({ channelId, message }: Message) {
  const $channel = document.querySelector(`#${ channelId }`);
  $channel.innerHTML = `${ $channel.innerHTML }<li>${ message }</li>`;
}

function addMessageToApp({ appId, message }: Message) {
  const $app = document.querySelector(`#${ appId }`);
  $app.innerHTML = `${ $app.innerHTML }<li>${ message }</li>`;
}
