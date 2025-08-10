export class CircularBuffer<T> {
  private buf: (T | undefined)[];
  private head = 0;
  private size = 0;

  constructor(private capacity: number) {
    if (capacity <= 0) throw new Error('capacity must be > 0');
    this.buf = new Array<T | undefined>(capacity);
  }

  push(value: T): void {
    this.buf[(this.head + this.size) % this.capacity] = value;
    if (this.size < this.capacity) {
      this.size++;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
  }

  toArray(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this.size; i++) {
      const v = this.buf[(this.head + i) % this.capacity];
      if (v !== undefined) out.push(v as T);
    }
    return out;
  }
}
