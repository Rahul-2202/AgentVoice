// Twilio provider for outbound calls. The call opens with the spoken opening
// line, then streams audio to `twimlUrl`, which must be the realtime voice
// model's endpoint. That endpoint is not built yet (see the PR notes).
// `fetchImpl` is injectable so tests never reach Twilio.
export function createTwilioProvider({ accountSid, authToken, from, fetchImpl = fetch, twimlUrl }) {
  if (!accountSid || !authToken || !from) {
    throw new Error('Twilio needs accountSid, authToken and a from number');
  }
  return {
    name: 'twilio',
    async placeCall({ to, opening }) {
      const twiml = `<Response><Say>${escapeXml(opening)}</Say><Connect><Stream url="${escapeXml(twimlUrl)}"/></Connect></Response>`;
      const body = new URLSearchParams({ To: to, From: from, Twiml: twiml });
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const res = await fetchImpl(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`Twilio call failed with status ${res.status}`);
      const json = await res.json();
      return { callSid: json.sid };
    },
  };
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
}
