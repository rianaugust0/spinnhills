'use client';

import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

// Define the structure of events and their payloads.
type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// Extend EventEmitter and type it with our defined events.
class TypedEventEmitter extends EventEmitter {
  // Override `emit` to provide type safety for the event name and payload.
  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>): boolean {
    return super.emit(event, ...args);
  }

  // Override `on` to provide type safety for the event name and listener.
  on<T extends keyof Events>(event: T, listener: Events[T]): this {
    return super.on(event, listener);
  }

  // Override `off` for completeness.
  off<T extends keyof Events>(event: T, listener: Events[T]): this {
    return super.off(event, listener);
  }
}

// Export a singleton instance of our typed event emitter.
export const errorEmitter = new TypedEventEmitter();
