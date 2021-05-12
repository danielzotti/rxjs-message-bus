import { Observable } from 'rxjs';

const observable = new Observable((observer: any) => {
  observer.next('Hello World!');
  observer.next('Hello Again!');
  observer.complete();
  observer.next('Bye');
});
observable.subscribe({
  next: (x: any) => logItem(x),
  error: (error: any) => logItem('Error: ' + error),
  complete: () => logItem('Completed')
});

function logItem(val: any) {
  const node = document.createElement('li');
  const textnode = document.createTextNode(val);
  node.appendChild(textnode);
  document.getElementById('list').appendChild(node);
}
