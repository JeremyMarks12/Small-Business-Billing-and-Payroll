import { normalizeWorker, workerPayload } from './model';

test('normalizes the backend worker contract for the UI', () => {
  expect(normalizeWorker({
    workerID: 7,
    workerFName: 'Pat',
    workerLName: 'Smith',
    workerUser: 'psmith',
    admin: true,
  })).toEqual({
    workerID: 7,
    firstName: 'Pat',
    lastName: 'Smith',
    username: 'psmith',
    isAdmin: true,
  });
});

test('maps the UI worker form back to the backend contract', () => {
  expect(workerPayload({
    firstName: ' Pat ',
    lastName: ' Smith ',
    username: ' psmith ',
    password: 'Password1',
    admin: false,
  })).toEqual({
    workerFName: 'Pat',
    workerLName: 'Smith',
    workerUser: 'psmith',
    workerPW: 'Password1',
    admin: false,
  });
});
