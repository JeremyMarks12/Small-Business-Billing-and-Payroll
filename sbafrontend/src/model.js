export const normalizeWorker = (worker = {}) => ({
  workerID: worker.workerID ?? worker.workerId ?? 0,
  firstName: worker.workerFName ?? worker.firstName ?? '',
  lastName: worker.workerLName ?? worker.lastName ?? '',
  username: worker.workerUser ?? worker.username ?? '',
  isAdmin: worker.admin ?? worker.isAdmin ?? false,
});

export const workerPayload = (worker) => ({
  workerFName: worker.firstName.trim(),
  workerLName: worker.lastName.trim(),
  workerUser: worker.username.trim(),
  workerPW: worker.password,
  admin: Boolean(worker.admin ?? worker.isAdmin),
});

export const getWorkOrderWorkers = (workOrder = {}) =>
  Array.isArray(workOrder.workers) ? workOrder.workers.map(normalizeWorker) : [];

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : 'Not set';

