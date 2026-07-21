import { ZodError } from 'zod';
import { ValidationError } from '@chuo-gpa/utils';

/**
 * Map internal errors to safe client-facing messages (no raw attacker input).
 */
export function toSafeClientError(error: unknown): { status: 400; message: string } {
  if (error instanceof ZodError) {
    return { status: 400, message: 'Invalid request data' };
  }

  if (error instanceof ValidationError) {
    return { status: 400, message: 'Invalid academic input' };
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('university') && msg.includes('not found')) {
      return { status: 400, message: 'Unknown university' };
    }
    if (msg.includes('grade') || msg.includes('score') || msg.includes('credits')) {
      return { status: 400, message: 'Invalid academic input' };
    }
    if (msg.includes('already registered')) {
      return { status: 400, message: 'Invalid academic input' };
    }
  }

  return { status: 400, message: 'Request could not be processed' };
}
