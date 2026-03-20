type HubSpotContactInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  phone?: string | null;
  website?: string | null;
  lifecycleStage?: string | null;
};

function getHubSpotToken() {
  return (process.env.HUBSPOT_ACCESS_TOKEN || "").trim();
}

async function hubSpotFetch(path: string, init: RequestInit) {
  const token = getHubSpotToken();
  if (!token) return null;

  const res = await fetch(`https://api.hubapi.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("HubSpot sync failed:", res.status, body);
    return null;
  }

  return res.json().catch(() => null);
}

async function findContactIdByEmail(email: string) {
  const json = await hubSpotFetch("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      limit: 1,
      properties: ["email"],
      filterGroups: [
        {
          filters: [{ propertyName: "email", operator: "EQ", value: email }],
        },
      ],
    }),
  });

  return json?.results?.[0]?.id ? String(json.results[0].id) : null;
}

async function upsertHubSpotContact(input: HubSpotContactInput) {
  const email = (input.email || "").trim().toLowerCase();
  if (!email || !getHubSpotToken()) return null;

  const properties = Object.fromEntries(
    Object.entries({
      email,
      firstname: input.firstName || undefined,
      lastname: input.lastName || undefined,
      company: input.company || undefined,
      phone: input.phone || undefined,
      website: input.website || undefined,
      lifecyclestage: input.lifecycleStage || undefined,
    }).filter(([, value]) => value !== undefined)
  );

  const existingId = await findContactIdByEmail(email);
  if (existingId) {
    const json = await hubSpotFetch(`/crm/v3/objects/contacts/${existingId}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
    return json?.id ? String(json.id) : existingId;
  }

  const created = await hubSpotFetch("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
  return created?.id ? String(created.id) : null;
}

function splitName(name: string | null | undefined) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  const lastName = parts.pop() || null;
  return { firstName: parts.join(" "), lastName };
}

export async function syncTrialLeadToHubSpot(input: {
  name?: string | null;
  email?: string | null;
  firm?: string | null;
  website?: string | null;
}) {
  if (!input.email) return null;
  const name = splitName(input.name);
  return upsertHubSpotContact({
    email: input.email,
    firstName: name.firstName,
    lastName: name.lastName,
    company: input.firm,
    website: input.website,
    lifecycleStage: "opportunity",
  });
}

export async function syncClientToHubSpot(input: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
}) {
  if (!input.email) return null;
  return upsertHubSpotContact({
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    company: input.company,
  });
}
