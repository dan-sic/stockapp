import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { deleteNotifications, getNotifications } from "@/lib/actions";
import { ChevronDown, TrashIcon } from "lucide-react";
import Link from "next/link";
// import { NotificationListener } from "./NotificationListener";
import { SanitizedContent } from "./SanitizedContent";

export const dynamic = "force-dynamic";

export default async function Notifications() {
  const data = await fetch(`${process.env.API_URL!}/api/notifications`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifications: any[] = await data.json();

  return (
    <>
      {/* <NotificationListener /> */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-muted-foreground">No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id}>
                <Collapsible>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <form action={deleteNotifications}>
                          <input
                            type="hidden"
                            name="ids"
                            value={notification.id}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            type="submit"
                            aria-label="Submit"
                          >
                            <TrashIcon />
                          </Button>
                        </form>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-4">
                          <Link
                            href={`/companies/${notification.companyTicker}`}
                          >
                            <span>{notification.companyName}</span>
                          </Link>
                          <span className="text-muted-foreground">•</span>
                          <span>{notification.title}</span>
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-4">
                          <span>
                            {new Date(notification.timestamp).toLocaleString(
                              "pl-PL",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {/* {notification.type && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="capitalize">
                                {notification.type}
                              </span>
                            </>
                          )} */}
                          <span className="text-muted-foreground">•</span>
                          <span className="uppercase text-xs">
                            {notification.source}
                          </span>
                        </CardDescription>
                      </div>
                      <CollapsibleTrigger className="group">
                        <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <SanitizedContent content={notification.content} />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
