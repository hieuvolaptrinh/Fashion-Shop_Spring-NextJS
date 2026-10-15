import slugify from "slugify";

export const convertToSlug = (text: string) => {
  if (!text) return "";
  return slugify(text, {
    locale: "vi",
    lower: true,
  });
};

export const convertToSlugWithId = (text?: string): string | null => {
  if (!text) return null;

  const url = text.split(".html");
  const id = url[0]?.split("-").pop();

  return id ?? null;
};
