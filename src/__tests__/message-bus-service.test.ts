import { MessageBusService } from '../message-bus-service';

test('Should adds 2 + 2 to equal 4', () => {
  expect(MessageBusService.add(2, 2)).toBe(4);
});
