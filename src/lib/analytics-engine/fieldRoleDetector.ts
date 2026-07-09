import type { FieldRole } from "./types";

export function detectFieldRole(fieldName: string, displayLabel = "", sampleValues: string[] = []): FieldRole {
  const text = `${fieldName} ${displayLabel} ${sampleValues.slice(0, 5).join(" ")}`.toLowerCase();
  if (/importid|metadata|duration|ipaddress|distributionchannel|userlanguage|recordeddate|responseid/.test(text)) return "metadata";
  if (/first name|last name|full name|email|phone|client id|participant id|record id|uuid|\bid\b/.test(text)) return "identifier";
  if (/race|ethnicity|gender|age|dob|date of birth|demographic/.test(text)) return "demographic";
  if (/start date|end date|recorded date|referral date|denial date|date|month|year/.test(text)) return "date";
  if (/outcome|completion|complete|discharge|result/.test(text)) return "outcome";
  if (/status|progress|finished/.test(text)) return "status";
  if (/program|project|grant/.test(text)) return "program";
  if (/shelter|site|agency|organization|organisation|org|provider/.test(text)) return "organization";
  if (/service|session|appointment|intervention/.test(text)) return "service";
  if (/referral|refer/.test(text)) return "referral";
  if (/reason|denial|denied|barrier|category/.test(text)) return "reason";
  if (/latitude|longitude|address|county|city|state|zip|location/.test(text)) return "location";
  if (/amount|cost|revenue|budget|payment|expense|invoice|dollar/.test(text)) return "amount";
  if (/score|rating|scale|grade|quality/.test(text)) return "score";
  if (/note|comment|description|narrative|explain|elaborate|text/.test(text)) return "freeText";
  return "other";
}
