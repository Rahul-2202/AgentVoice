// Trip room: group chat for one trip (PRD 7.1). Members post messages, and
// Go decides from the speaking rules whether to reply.

import { decideGoSpeaks, type SpeakDecision } from './speaking.ts';

export type Message = {
  id: string;
  authorId: string;
  text: string;
  sentAt: number;
  replyTo?: string;
  reactions: Record<string, string[]>;
};

export type TripRoom = {
  tripId: string;
  members: Set<string>;
  messages: Message[];
};

export function createRoom(tripId: string, memberIds: string[]): TripRoom {
  return { tripId, members: new Set(memberIds), messages: [] };
}

export function addMember(room: TripRoom, memberId: string): void {
  room.members.add(memberId);
}

export function postMessage(
  room: TripRoom,
  input: { id: string; authorId: string; text: string; sentAt: number; replyTo?: string },
): { message: Message; goSpeaks: SpeakDecision } {
  if (!room.members.has(input.authorId)) {
    throw new Error(`${input.authorId} is not a member of trip ${room.tripId}`);
  }
  if (input.replyTo && !room.messages.some((m) => m.id === input.replyTo)) {
    throw new Error(`reply target ${input.replyTo} is not in this room`);
  }
  const message: Message = { ...input, reactions: {} };
  room.messages.push(message);
  return { message, goSpeaks: decideGoSpeaks({ kind: 'chat', text: input.text }) };
}

export function react(room: TripRoom, messageId: string, memberId: string, emoji: string): void {
  if (!room.members.has(memberId)) {
    throw new Error(`${memberId} is not a member of trip ${room.tripId}`);
  }
  const message = room.messages.find((m) => m.id === messageId);
  if (!message) throw new Error(`message ${messageId} is not in this room`);
  const who = (message.reactions[emoji] ??= []);
  if (!who.includes(memberId)) who.push(memberId);
}
