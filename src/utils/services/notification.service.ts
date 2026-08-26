// src/services/notification.service.ts
import { randomUUID } from "crypto";
import { NOTIFICATION_TTL  } from "../constants";
import { redis } from "@/lib/redis";
import { Notification, NotificationEntityType, NotificationType } from "../types";
import prisma from "@/lib/db";

const userNotificationsKey = (userId: string) =>
  `notifications:user:${userId}`;

const globalNotificationsKey = () =>
  `notifications:global`;

const notificationKey = (id: string) =>
  `notification:${id}`;

const actionKey = (
  recipientId: string,
  actorId: string,
  entityType: NotificationEntityType,
  entityId: string,
  action: string
) =>
  `notification:action:${recipientId}:${actorId}:${entityType}:${entityId}:${action}`;

const seenKey = (userId: string, notificationId: string) =>
  `notification:seen:${userId}:${notificationId}`;

export async function createUserNotification({
  recipientId,
  actorId,
  type,
  entityId,
  entityType,
  url,
}: {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  entityId?: string;
  entityType?: NotificationEntityType;
  url?: string;
}) {
  // Don't notify yourself
  if (recipientId === actorId) {
    return null;
  }

  const id = randomUUID();

  const notification: Notification = {
    id,
    recipientId,
    actorId,
    type,
    entityId,
    entityType,
    url,
    createdAt: Date.now(),
  };

  await redis.set(
    notificationKey(id),
    notification,
    {
      ex: NOTIFICATION_TTL,
    }
  );

  await redis.lpush(
    userNotificationsKey(recipientId),
    id
  );

  return notification;
}


export async function createGlobalNotification({
  type = "GLOBAL",
  title,
  message,
  url,
}: {
  type?: NotificationType;
  title: string;
  message: string;
  url?: string;
}) {
  const id = randomUUID();

  const notification: Notification = {
    id,
    type,
    title,
    message,
    url,
    createdAt: Date.now(),
  };

  await redis.set(
    notificationKey(id),
    notification,
    {
      ex: NOTIFICATION_TTL,
    }
  );

  await redis.lpush(
    globalNotificationsKey(),
    id
  );

  return notification;
}

export async function createOrUpdateActionNotification({
  recipientId,
  actorId,
  entityType,
  entityId,
  action,
  type,
  url,
}: {
  recipientId: string;
  actorId: string;
  entityType: NotificationEntityType;
  entityId: string;
  action: string;
  type: NotificationType;
  url?: string;
}) {
  if (recipientId === actorId) {
    return null;
  }

  const key = actionKey(
    recipientId,
    actorId,
    entityType,
    entityId,
    action
  );

  const existingId = await redis.get<string>(key);

  if (existingId) {
    const existing = await redis.get<Notification>(
      notificationKey(existingId)
    );

    if (existing) {
      const updated: Notification = {
        ...existing,
        type,
      };

      await redis.set(
        notificationKey(existingId),
        updated,
        {
          // نقرأ TTL الحالي حتى لا نمدد عمر الإشعار
          keepTtl: true,
        }
      );

      return updated;
    }
  }

  const notification = await createUserNotification({
    recipientId,
    actorId,
    type,
    entityId,
    entityType,
    url,
  });

  if (!notification) {
    return null;
  }

  await redis.set(
    key,
    notification.id,
    {
      ex: NOTIFICATION_TTL,
    }
  );

  return notification;
}
export async function getUserNotifications(userId: string) {
  const [userIds, globalIds] = await Promise.all([
    redis.lrange<string>(
      userNotificationsKey(userId),
      0,
      49
    ),
    redis.lrange<string>(
      globalNotificationsKey(),
      0,
      49
    ),
  ]);

  const ids = [...userIds, ...globalIds];

  if (!ids.length) {
    return [];
  }

  const notifications = await Promise.all(
    ids.map((id) =>
      redis.get<Notification>(
        notificationKey(id)
      )
    )
  );

  const validNotifications = notifications.filter(
    (notification): notification is Notification =>
      notification !== null
  );

  validNotifications.sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const unique = [
    ...new Map(
      validNotifications.map((notification) => [
        notification.id,
        notification,
      ])
    ).values(),
  ];

  // Get actor IDs
  const actorIds = [
    ...new Set(
      unique
        .map((notification) => notification.actorId)
        .filter(Boolean)
        .map(Number)
    ),
  ];

  const actors = await prisma.user.findMany({
    where: {
      id: {
        in: actorIds,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });




  const actorMap = new Map(
    actors.map((actor) => [
      actor.id.toString(),
      actor,
    ])
  );

  const result = await Promise.all(
    unique.map(async (notification) => {
      const seen = await redis.exists(
        seenKey(userId, notification.id)
      );

const dbActor = notification.actorId
  ? actorMap.get(notification.actorId.toString())
  : undefined;

const actor = dbActor
  ? {
      ...dbActor,
      id: dbActor.id.toString(),
    }
  : undefined;

      let message = "";

      switch (notification.type) {
        case "COMMENT_REPLY":
          message = `${actor?.name ?? "Someone"} replied to your comment`;
          break;

        case "COMMENT_LIKE":
          message = `${actor?.name ?? "Someone"} liked your comment`;
          break;

        case "COMMENT_UNLIKE":
          message = `${actor?.name ?? "Someone"} removed their like from your comment`;
          break;

        case "GLOBAL":
          message = notification.message ?? "";
          break;
      }

      return {
        ...notification,
        actor,
        message,
        seen: Boolean(seen),
      };
    })
  );


  return result.slice(0, 30);
}

export async function markNotificationAsSeen(
  userId: string,
  notificationId: string
) {
  const notification = await redis.get<Notification>(
    notificationKey(notificationId)
  );

  if (!notification) {
    console.log("notification not found");
    return false;
  }

  if (
    notification.recipientId &&
    Number(notification.recipientId) !== Number(userId)
  ) {
   

    return false;
  }

  const ttl = await redis.ttl(
    notificationKey(notificationId)
  );


  if (ttl <= 0) {
    return false;
  }

  await redis.set(
    seenKey(userId, notificationId),
    "1",
    {
      ex: ttl,
    }
  );



  return true;
}