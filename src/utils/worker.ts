let _IDs = 0;

export interface WorkerEvent {
  subject: string;
  data: Object;
}

export class WorkerThread {
  private _worker: Worker;
  private _resolve: (event: Object) => void;
  constructor(ref: string) {
    this._worker = new Worker(ref, { type: "module" });
    this._worker.onmessage = (e: MessageEvent<WorkerEvent>) => {
      this._onMessage(e.data);
    };
    this._resolve = null;
    this._id = _IDs++;
  }
  _onMessage(data: Object) {
    const resolve = this._resolve;
    this._resolve = null;
    resolve(data);
  }

  postMessage(message: string, resolve: (event: Object) => void) {
    this._resolve = resolve;
    this._worker.postMessage(message);
  }

  private _id: number;
  public get id(): number {
    return this._id;
  }
}

export class WorkerThreadPool {
  _workers: Array<WorkerThread>;
  _free: Array<WorkerThread>;
  _queue: Array<Task>;
  _busy: Map<number, WorkerThread>;

  constructor(size: number, entry: string) {
    this._workers = [...Array(size)].map((_) => new WorkerThread(entry));
    this._free = [...this._workers];
    this._busy = new Map();
    this._queue = [];
  }

  public get length(): number {
    return this._workers.length;
  }

  private get hasWork(): boolean {
    return this._free.length > 0 && this._queue.length > 0;
  }

  public get isBusy(): boolean {
    return this._queue.length > 0 || Object.keys(this._busy).length > 0;
  }

  schedule(name: string, resolve: (event: Object) => void) {
    this._queue.push({ subject: name, resolve });
    this.process();
  }

  private process() {
    while (this.hasWork) {
      const worker = this._free.pop();
      this._busy[worker.id] = worker;
      const { subject, resolve } = this._queue.shift();
      worker.postMessage(subject, (event: Object) => {
        delete this._busy[worker.id];
        this._free.push(worker);
        resolve(event);
        this.process();
      });
    }
  }
}

interface Task {
  subject: string;
  resolve: (data: Object) => void;
}
