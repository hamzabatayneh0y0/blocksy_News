"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileActivities from "./ProfileActivities";

interface Props {
  userId: number;
}

export default function ProfileTabs({ userId }: Props) {
  const [activeTab, setActiveTab] = useState<
    "bookmarks" | "articleLikes" | "comments"
  >("bookmarks");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "bookmarks" | "articleLikes" | "comments")
      }
      className="w-full h-auto!"
    >
      <div>
        <TabsList className="flex  w-full h-auto! gap-1 flex-wrap">
          <TabsTrigger className={"my-1"} value="bookmarks">
            Bookmarks
          </TabsTrigger>

          <TabsTrigger className={"my-1"} value="articleLikes">
            Article Likes
          </TabsTrigger>

          <TabsTrigger className={"my-1"} value="comments">
            Comments
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="my-1">
        <TabsContent value="bookmarks" className="mt-6">
          <ProfileActivities userId={userId} type="bookmarks" />
        </TabsContent>

        <TabsContent value="articleLikes" className="mt-6">
          <ProfileActivities userId={userId} type="articleLikes" />
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <ProfileActivities userId={userId} type="comments" />
        </TabsContent>
      </div>
    </Tabs>
  );
}
