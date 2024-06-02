"use client"
import { NotificationWithUser } from "@/lib/types"
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Bell } from "lucide-react";
import { Role } from "@prisma/client";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "../ui/separator";

type Props = {
  notifications: NotificationWithUser | [];
  role?: Role;
  className?: string;
  subAccountId?: string;
}

export default function InfoBar({ notifications, subAccountId, className, role }: Props) {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(true);

  function handleClick() {
    if (!showAll) setAllNotifications(notifications)
    else {
      if (notifications?.length !== 0) {
        setAllNotifications(
          notifications?.filter(item => item.subAccountId === subAccountId) ?? []
        )
      }
    }
    setShowAll(prev => !prev)
  }

  return (
    <>
      <div className={cn('fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px] ', className)}>
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger asChild>
              <div className="rounded-full size-9 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-auto" showX={false}>
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <Separator />
                <SheetDescription>
                  {(role === "AGENCY_OWNER" || role === "AGENCY_ADMIN") && (
                    <Card className="flex items-center justify-between p-4">
                      Current Subaccount
                      <Switch onCheckedChange={handleClick} />
                    </Card>
                  )}
                </SheetDescription>
              </SheetHeader>

              {allNotifications?.map(notification => (
                <div key={notification.id} className="flex mt-4 overflow-auto text-ellipsis">
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage src={notification.User.avatarUrl} alt="Profile Picture" />
                      <AvatarFallback className="bg-primary">{notification.User.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">
                          {notification.notification.split("|")[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {notification.notification.split("|")[1]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {notification.notification.split("|")[2]}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {allNotifications?.length === 0 &&
                (
                  <div className="flex items-center justify-center mb-4 text-muted-foreground">
                    You have no notification
                  </div>
                )}

            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  )
}
