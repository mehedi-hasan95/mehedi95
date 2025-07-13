import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
export const UserBilling = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Pro Plan</h3>
              <p className="text-sm text-muted-foreground">
                $19/month • Billed monthly
              </p>
            </div>
            <Badge>Active</Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your payment information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          <Button variant="outline">
            <Lock className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">December 2023</p>
                <p className="text-sm text-muted-foreground">
                  Pro Plan - $19.00
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">November 2023</p>
                <p className="text-sm text-muted-foreground">
                  Pro Plan - $19.00
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
