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
    messageService.publish({ id: channel, message: message });
  })
).subscribe();


const ch1 = messageService.subscribe('channel1');
const ch2 = messageService.subscribe('channel2');
const ch2_delayed = messageService.subscribe('channel2');

ch1.pipe(tap(res => console.log({ channel1: res }))).subscribe(addMessageToChannel);
ch2.pipe(tap(res => console.log({ channel2: res }))).subscribe(addMessageToChannel);

setTimeout(() => {
  console.log('Delayed channel2 subscribed');
  ch2_delayed.pipe(tap(res => console.log({ channel2_delayed: res }))).subscribe((res) => addMessageToChannel({
    id: 'channel3',
    message: res.message
  }));
}, 10000);

function addMessageToChannel({ id, message }: Message) {
  const $channel = document.querySelector(`#${ id }`);
  $channel.innerHTML = `${ $channel.innerHTML }<li>${ message }</li>`;
}
