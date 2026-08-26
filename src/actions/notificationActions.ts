"use server";

import { auth } from "@/auth";
import { getUserNotifications, markNotificationAsSeen } from "@/utils/services/notification.service";

export async function getNotifications() {
  const session = await auth();

  if (!session?.user?.id) {
    return
  }

  return getUserNotifications(session.user.id);
}

export async function markNotificationAsSeenAction(
  notificationId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return
  }

  return markNotificationAsSeen(
    session.user.id,
    notificationId
  );
}

