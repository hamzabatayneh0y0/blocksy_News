"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { NotificationItem } from "./NotificationItem";
import {
  getNotifications,
  markNotificationAsSeenAction,
} from "@/actions/notificationActions";

interface NotificationBellProps {
  navOpen: boolean;
}

export function NotificationBell({ navOpen }: NotificationBellProps) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  // Close notification when mobile nav opens/closes
  useEffect(() => {
    setIsOpen(false);
  }, [navOpen]);

  // Close notification on resize
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 60 * 1000,
    gcTime: 60 * 1000,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: markSeen } = useMutation({
    mutationFn: markNotificationAsSeenAction,

    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (old: any[] = []) =>
        old.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                seen: true,
              }
            : notification,
        ),
      );
    },
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.seen,
  ).length;
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="
    relative
    inline-flex
    h-10
    w-10
    items-center
    justify-center
    rounded-md
    text-foreground
    transition-colors
    hover:bg-accent
  "
      >
        <Bell />

        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="m-1 w-[calc(100vw-1rem)] max-w-[380px] p-0"
      >
        <div className="border-b p-4 font-semibold">Notifications</div>

        <div className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onSeen={() => markSeen(notification.id)}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
