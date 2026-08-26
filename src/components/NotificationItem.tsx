"use client";

import { Notification } from "@/utils/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  notification: Notification & {
    seen: boolean;
    actor?: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };

  onSeen: () => void;
}

export function NotificationItem({ notification, onSeen }: Props) {
  const router = useRouter();

  function handleClick() {
    if (!notification.seen) {
      onSeen();
    }

    if (notification.url) {
      router.push(notification.url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full gap-3 p-4 text-left transition hover:bg-muted ${
        !notification.seen ? "bg-muted/50" : ""
      }`}
    >
      {/* Actor Image */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
        {notification.actor?.image ? (
          <Image
            src={notification.actor.image}
            alt={notification.actor.name ?? "User"}
            fill
            sizes="100px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm">
            {notification.actor?.name?.charAt(0) ?? "?"}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm">{notification.message}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {!notification.seen && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}
