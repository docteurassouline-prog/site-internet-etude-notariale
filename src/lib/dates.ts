const formatDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
export function dateFr(iso: string) {
  return formatDate.format(new Date(`${iso}T12:00:00Z`));
}
