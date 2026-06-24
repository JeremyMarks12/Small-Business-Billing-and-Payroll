import { mockCompanies, mockWorkers, mockWorkOrders } from './mockData';

const STORAGE_KEY = 'sbaMockApiStateV2';

class MockApiError extends Error {
  constructor(message, status = 400, data = null) {
    super(message);
    this.name = 'MockApiError';
    this.status = status;
    this.data = data;
  }
}

const clone = (value) => JSON.parse(JSON.stringify(value));

const loadState = () => {
  if (typeof localStorage === 'undefined') {
    return {
      workers: clone(mockWorkers),
      companies: clone(mockCompanies),
      workOrders: clone(mockWorkOrders),
    };
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const initialState = {
    workers: clone(mockWorkers),
    companies: clone(mockCompanies),
    workOrders: clone(mockWorkOrders),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  return initialState;
};

let state = loadState();

const saveState = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

const withoutPassword = ({ workerPW, ...worker }) => worker;

const nextId = (items, key) => Math.max(0, ...items.map(item => Number(item[key]) || 0)) + 1;

const bodyAsJson = (options) => {
  if (!options.body) return {};
  return typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
};

const findWorker = (workerID) => state.workers.find(worker => worker.workerID === Number(workerID));
const findCompany = (companyID) => state.companies.find(company => company.companyID === Number(companyID));
const findWorkOrder = (workOrderID) => state.workOrders.find(order => order.workOrderID === Number(workOrderID));

const createLoginResponse = (worker) => ({
  workerID: worker.workerID,
  workerUser: worker.workerUser,
  workerFName: worker.workerFName,
  workerLName: worker.workerLName,
  admin: worker.admin,
});

const handleAuth = (segments, method, options) => {
  if (segments[1] === 'login' && method === 'POST') {
    const { username = '', password = '' } = bodyAsJson(options);
    const worker = state.workers.find(item => item.workerUser === username.trim());

    if (!worker || worker.workerPW !== password) {
      throw new MockApiError('Invalid username or password', 401);
    }

    return createLoginResponse(worker);
  }

  if (segments[1] === 'logout' && method === 'POST') {
    return null;
  }

  throw new MockApiError('Mock auth route not found', 404);
};

const handleWorkers = (segments, method, options) => {
  if (segments.length === 1 && method === 'GET') {
    return state.workers.map(withoutPassword);
  }

  if (segments.length === 1 && method === 'POST') {
    const payload = bodyAsJson(options);
    const worker = {
      workerID: nextId(state.workers, 'workerID'),
      workerFName: payload.workerFName,
      workerLName: payload.workerLName,
      workerUser: payload.workerUser,
      workerPW: payload.workerPW,
      admin: Boolean(payload.admin),
    };
    state.workers.push(worker);
    saveState();
    return withoutPassword(worker);
  }

  const workerID = segments[1];
  const worker = findWorker(workerID);
  if (!worker) throw new MockApiError('Worker not found', 404);

  if (segments.length === 2 && method === 'GET') {
    return withoutPassword(worker);
  }

  if (segments.length === 2 && method === 'DELETE') {
    state.workers = state.workers.filter(item => item.workerID !== Number(workerID));
    state.workOrders = state.workOrders.map(order => ({
      ...order,
      workers: order.workers.filter(item => item.workerID !== Number(workerID)),
    }));
    saveState();
    return null;
  }

  if (segments[2] === 'password' && method === 'PUT') {
    const { newPassword } = bodyAsJson(options);
    worker.workerPW = newPassword;
    saveState();
    return null;
  }

  throw new MockApiError('Mock worker route not found', 404);
};

const handleCompanies = (segments, method, options) => {
  if (segments[1] === 'all' && method === 'GET') {
    return state.companies;
  }

  if (segments[1] === 'add' && method === 'POST') {
    const payload = bodyAsJson(options);
    const company = {
      ...payload,
      companyID: nextId(state.companies, 'companyID'),
    };
    state.companies.push(company);
    saveState();
    return company;
  }

  const companyID = segments[1];
  const company = findCompany(companyID);
  if (!company) throw new MockApiError('Company not found', 404);

  if (segments.length === 2 && method === 'PUT') {
    const payload = bodyAsJson(options);
    Object.assign(company, payload, { companyID: Number(companyID) });
    state.workOrders = state.workOrders.map(order => (
      order.company?.companyID === Number(companyID) ? { ...order, company: clone(company) } : order
    ));
    saveState();
    return company;
  }

  if (segments.length === 2 && method === 'DELETE') {
    state.companies = state.companies.filter(item => item.companyID !== Number(companyID));
    state.workOrders = state.workOrders.map(order => (
      order.company?.companyID === Number(companyID) ? { ...order, company: null } : order
    ));
    saveState();
    return null;
  }

  throw new MockApiError('Mock company route not found', 404);
};

const setWorkOrderStatus = (workOrder, status) => {
  workOrder.status = status;
  if (status === 'COMPLETE') {
    workOrder.endDateTime = new Date().toISOString();
  }
  if (status !== 'COMPLETE') {
    workOrder.endDateTime = null;
  }
  saveState();
  return workOrder;
};

const handleWorkOrders = (segments, method, options) => {
  if (segments.length === 1 && method === 'GET') {
    return state.workOrders;
  }

  if (segments[1] === 'count' && method === 'GET') {
    return state.workOrders.length;
  }

  if (segments.length === 1 && method === 'POST') {
    const payload = bodyAsJson(options);
    const workerRefs = Array.isArray(payload.workers) ? payload.workers : [];
    const company = payload.company?.companyID ? findCompany(payload.company.companyID) : payload.company;
    const workOrder = {
      workOrderID: nextId(state.workOrders, 'workOrderID'),
      workers: workerRefs.map(worker => findWorker(worker.workerID)).filter(Boolean).map(withoutPassword),
      company: company ? clone(company) : null,
      status: 'OPEN',
      startDateTime: new Date().toISOString(),
      endDateTime: null,
      comment: payload.comment || '',
      items: [],
    };
    state.workOrders.push(workOrder);
    saveState();
    return workOrder;
  }

  if (segments[1] === 'company' && method === 'GET') {
    const companyID = Number(segments[2]);
    return state.workOrders.filter(order => order.company?.companyID === companyID);
  }

  const workOrderID = segments[1];
  const workOrder = findWorkOrder(workOrderID);
  if (!workOrder) throw new MockApiError('Work order not found', 404);

  if (segments.length === 2 && method === 'GET') {
    return workOrder;
  }

  if (segments.length === 2 && method === 'DELETE') {
    state.workOrders = state.workOrders.filter(order => order.workOrderID !== Number(workOrderID));
    saveState();
    return null;
  }

  if (segments[2] === 'start' && method === 'PUT') {
    workOrder.startDateTime = new Date().toISOString();
    return setWorkOrderStatus(workOrder, 'IN_PROCESS');
  }

  if (segments[2] === 'assign' && method === 'PUT') {
    if (workOrder.status === 'COMPLETE') {
      throw new MockApiError('Completed work orders cannot be reassigned', 400);
    }

    const { workerID } = bodyAsJson(options);
    const worker = findWorker(workerID);
    if (!worker || worker.admin) {
      throw new MockApiError('Worker not found', 404);
    }

    workOrder.workers = [withoutPassword(worker)];
    saveState();
    return workOrder;
  }

  if (segments[2] === 'submit' && method === 'PUT') {
    return setWorkOrderStatus(workOrder, 'IN_REVIEW');
  }

  if (segments[2] === 'approve' && method === 'PUT') {
    return setWorkOrderStatus(workOrder, 'COMPLETE');
  }

  if (segments[2] === 'reject' && method === 'PUT') {
    return setWorkOrderStatus(workOrder, 'IN_PROCESS');
  }

  throw new MockApiError('Mock work order route not found', 404);
};

export const resetMockApiState = () => {
  state = {
    workers: clone(mockWorkers),
    companies: clone(mockCompanies),
    workOrders: clone(mockWorkOrders),
  };
  saveState();
};

export const mockApiFetch = async (path, options = {}) => {
  await new Promise(resolve => setTimeout(resolve, 150));

  const method = (options.method || 'GET').toUpperCase();
  const segments = path.split('?')[0].split('/').filter(Boolean);

  try {
    if (segments[0] === 'auth') return clone(handleAuth(segments, method, options));
    if (segments[0] === 'workers') return clone(handleWorkers(segments, method, options));
    if (segments[0] === 'companies') return clone(handleCompanies(segments, method, options));
    if (segments[0] === 'workorders') return clone(handleWorkOrders(segments, method, options));
  } catch (error) {
    throw error;
  }

  throw new MockApiError(`Mock route not found: ${method} ${path}`, 404);
};
