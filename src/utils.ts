export const uuid = () => crypto.randomUUID();

export const nowIso = () => new Date().toISOString();

export const extractVariables = (body: string): string[] =>
  [...new Set(Array.from(body.matchAll(/\{([a-zA-Z0-9_]+)\}/g)).map((m) => m[1]))];

export const applyTemplate = (body: string, values: Record<string, string>) =>
  body.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => values[key] ?? `{${key}}`);

export const riskyWords = ['絶対', '必ず', '100%', '確実', '誰でも'];

export const detectRiskyContent = (text: string) => riskyWords.filter((w) => text.includes(w));
