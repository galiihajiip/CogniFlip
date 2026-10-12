import "server-only";
import type { LearningPath } from "@/server/learning/lesson-schema";

/** Draft until its lessons are reviewed and published (D-007). */
export const PATHS: LearningPath[] = [
  {
    id: "dasar-pemrograman",
    status: "draft",
    title: "Dasar Pemrograman",
    locale: "id-ID",
    lessons: ["urutan-instruksi", "perulangan", "percabangan"],
  },
];
