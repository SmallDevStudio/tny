import { Sections } from "@/sections";

export const getSections = (sectionsData) => {
  if (!sectionsData || !Array.isArray(sectionsData)) {
    console.error("Invalid sections data provided.");
    return [];
  }

  return sectionsData
    .map((section) => {
      const foundSection = Sections.find((s) => s.name === section.component);
      return foundSection
        ? { ...foundSection, id: section.id, contentId: section.contentId }
        : null;
    })
    .filter(Boolean); // กรองค่า null ออก
};
