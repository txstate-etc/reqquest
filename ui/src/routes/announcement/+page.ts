import { error } from "@sveltejs/kit";
import type { PageLoad } from "../$types";
import { api } from "$internal";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent()
  if (!parentData?.access?.createAnnouncement) throw error(403)

  const anouncement = await api.getAnnouncement(false)

  return { anouncement }
}