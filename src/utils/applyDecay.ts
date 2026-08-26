import { ForYouTag } from "./types";

const HALF_LIFE_DAYS = 7;
const MAX_TAGS = 10;

export function updateForYouTags(
  currentTags: ForYouTag[],
  articleTags: string[]
): ForYouTag[] {
  const now = Date.now();

  const tagsMap = new Map<string, ForYouTag>();

  // 1. نطبق decay على الـ tags القديمة
  for (const tag of currentTags) {
    const elapsedDays =
      (now - new Date(tag.updatedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    const decayedWeight =
      tag.weight * Math.pow(0.5, elapsedDays / HALF_LIFE_DAYS);

    tagsMap.set(tag.name, {
      ...tag,
      weight: decayedWeight,
    });
  }

  // 2. نضيف interaction الجديد
  for (const tagName of articleTags) {
    const existingTag = tagsMap.get(tagName);

    if (existingTag) {
      tagsMap.set(tagName, {
        name: tagName,
        weight: existingTag.weight + 1,
        updatedAt: new Date(now).toISOString(),
      });
    } else {
      tagsMap.set(tagName, {
        name: tagName,
        weight: 1,
        updatedAt: new Date(now).toISOString(),
      });
    }
  }

  // 3. ترتيب حسب الـ weight وأخذ أعلى 10
  return Array.from(tagsMap.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, MAX_TAGS);
}