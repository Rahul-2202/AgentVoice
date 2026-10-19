import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkCallPolicy, CallPolicyError } from '../src/calls/policy.js';
import { AI_DISCLOSURE, buildOpening, hasAiDisclosure } from '../src/calls/disclosure.js';
import { startCall, waitForStop, STOP_WINDOW_MS } from '../src/calls/callFlow.js';
import { createTwilioProvider } from '../src/calls/twilio.js';

const NUMBER = '+919876543210';
const ALLOW = [NUMBER];

function fakeProvider() {
  const calls = [];
  return {
    calls,
    async placeCall(args) {
      calls.push(args);
      return { callSid: 'CA-test-1' };
    },
  };
}

const never = new Promise(() => {});

test('calls are off by default (CALLS_MODE unset or off)', () => {
  assert.throws(() => checkCallPolicy({ to: NUMBER, allowlist: ALLOW }), (e) => e.rule === 'calls_off');
  assert.throws(() => checkCallPolicy({ mode: 'off', to: NUMBER, allowlist: ALLOW }), (e) => e.rule === 'calls_off');
});

test('only allowlisted numbers can be called', () => {
  assert.throws(() => checkCallPolicy({ mode: 'live', to: '+14155550100', allowlist: ALLOW }), (e) => e.rule === 'allowlist');
  assert.doesNotThrow(() => checkCallPolicy({ mode: 'live', to: NUMBER, allowlist: ALLOW }));
});

test('numbers must be E.164', () => {
  assert.throws(() => checkCallPolicy({ mode: 'live', to: '98765 43210', allowlist: ['98765 43210'] }), (e) => e.rule === 'number_format');
});

test('the opening discloses that Go is an AI', () => {
  const opening = buildOpening({ callee: 'Hotel Sea View', reason: 'a room for 3 on 1 Nov', requestedBy: 'Ada' });
  assert.ok(opening.startsWith(AI_DISCLOSURE));
  assert.equal(hasAiDisclosure(opening), true);
  assert.equal(hasAiDisclosure('Hi, this is Go calling.'), false);
});

test('STOP_WINDOW_MS is 30 seconds', () => {
  assert.equal(STOP_WINDOW_MS, 30_000);
});

test('waitForStop resolves proceed after the window with no stop', async () => {
  assert.equal(await waitForStop({ stopSignal: never, waitMs: 5 }), 'proceed');
});

test('waitForStop resolves stopped when a stop arrives first', async () => {
  assert.equal(await waitForStop({ stopSignal: Promise.resolve(), waitMs: 1000 }), 'stopped');
});

test('a refused number is never announced or dialled', async () => {
  const provider = fakeProvider();
  let announced = false;
  await assert.rejects(
    startCall({ to: NUMBER, callee: 'Hotel', reason: 'rooms', requestedBy: 'Ada', mode: 'off', allowlist: ALLOW, provider, stopSignal: never, waitMs: 0, announce: async () => { announced = true; } }),
    (e) => e instanceof CallPolicyError,
  );
  assert.equal(announced, false);
  assert.equal(provider.calls.length, 0);
});

test('an allowed call is announced, waits, then places the call with the disclosure', async () => {
  const provider = fakeProvider();
  const announcements = [];
  const result = await startCall({
    to: NUMBER, callee: 'Hotel Sea View', reason: 'a room for 3', requestedBy: 'Ada',
    mode: 'live', allowlist: ALLOW, provider, stopSignal: never, waitMs: 5,
    announce: async (a) => announcements.push(a),
  });
  assert.equal(result.status, 'placed');
  assert.equal(result.callSid, 'CA-test-1');
  assert.equal(announcements.length, 1);
  assert.match(announcements[0].text, /Hotel Sea View/);
  assert.match(announcements[0].text, /a room for 3/);
  assert.equal(provider.calls.length, 1);
  assert.ok(provider.calls[0].opening.startsWith(AI_DISCLOSURE));
});

test('a stop during the window cancels the call', async () => {
  const provider = fakeProvider();
  const result = await startCall({
    to: NUMBER, callee: 'Hotel', reason: 'rooms', requestedBy: 'Ada',
    mode: 'live', allowlist: ALLOW, provider, stopSignal: Promise.resolve(), waitMs: 1000,
  });
  assert.equal(result.status, 'stopped');
  assert.equal(provider.calls.length, 0);
});

test('Twilio provider posts the call with the opening line and returns the call SID', async () => {
  let captured;
  const fetchImpl = async (url, init) => {
    captured = { url, init };
    return { ok: true, status: 201, json: async () => ({ sid: 'CA123' }) };
  };
  const provider = createTwilioProvider({ accountSid: 'AC1', authToken: 'tok', from: '+15550000000', fetchImpl, twimlUrl: 'wss://example.test/voice' });
  const out = await provider.placeCall({ to: NUMBER, opening: `${AI_DISCLOSURE} Is this a good time?` });
  assert.equal(out.callSid, 'CA123');
  assert.equal(captured.url, 'https://api.twilio.com/2010-04-01/Accounts/AC1/Calls.json');
  assert.equal(captured.init.headers.Authorization, `Basic ${Buffer.from('AC1:tok').toString('base64')}`);
  const body = new URLSearchParams(captured.init.body);
  assert.equal(body.get('To'), NUMBER);
  assert.match(body.get('Twiml'), /an AI assistant/);
});

test('Twilio provider escapes the opening line in TwiML', async () => {
  let body;
  const fetchImpl = async (_u, init) => {
    body = new URLSearchParams(init.body);
    return { ok: true, status: 201, json: async () => ({ sid: 'CA9' }) };
  };
  const provider = createTwilioProvider({ accountSid: 'AC1', authToken: 't', from: '+1', fetchImpl, twimlUrl: 'wss://x' });
  await provider.placeCall({ to: NUMBER, opening: 'Tom & <Jerry>' });
  assert.match(body.get('Twiml'), /Tom &amp; &lt;Jerry&gt;/);
});

test('Twilio provider surfaces HTTP failures', async () => {
  const fetchImpl = async () => ({ ok: false, status: 401 });
  const provider = createTwilioProvider({ accountSid: 'AC1', authToken: 'bad', from: '+1', fetchImpl, twimlUrl: 'wss://x' });
  await assert.rejects(provider.placeCall({ to: NUMBER, opening: 'x' }), /status 401/);
});

test('Twilio provider refuses to start without credentials', () => {
  assert.throws(() => createTwilioProvider({ accountSid: '', authToken: 'x', from: '+1' }), /needs/);
});
