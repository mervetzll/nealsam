export type SharedNote = { title: string; note: string; from: string };

export function readSharedNote(params: URLSearchParams): SharedNote {
  return {
    title: (params.get("title") || "Sana özel bir not").slice(0, 120),
    note: (params.get("note") || "").slice(0, 1200),
    from: (params.get("from") || "").slice(0, 100),
  };
}

export function createNoteLink(origin: string, value: SharedNote): string {
  if (!value.note.trim() || value.note.length > 1200) throw new Error("Not 1–1200 karakter arasında olmalı.");
  const params = new URLSearchParams({ title: value.title.slice(0, 120), note: value.note, from: value.from.slice(0, 100) });
  // The message stays in the URL fragment, which browsers do not send to the server.
  return `${origin}/hediye-notu#${params.toString()}`;
}
