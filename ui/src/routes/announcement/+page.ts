import { error } from "@sveltejs/kit";
import type { PageLoad } from "../$types";
import { api } from "$internal";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent()
  if (!parentData?.access?.viewAnnouncementManagement) throw error(403)
  const canManage = !!parentData?.access?.manageAnnouncements

  // no filter: the editor needs the announcement whether or not it is currently displaying
  const anouncement = await api.getAnnouncement()

  return { anouncement, canManage }
}
