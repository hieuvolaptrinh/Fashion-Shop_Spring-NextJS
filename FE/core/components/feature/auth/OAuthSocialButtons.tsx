import React from "react";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { GoogleIcon, FacebookIcon } from "@/core/components/icons";
import { API_BASE_URL, API_ENDPOINTS } from "@/core/constants";

interface OAuthSocialButtonsProps {
  label?: string;
}

export const OAuthSocialButtons: React.FC<OAuthSocialButtonsProps> = ({
  label = "Hoặc tiếp tục với",
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground text-[11px]">
            {label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          asChild
          className="h-10 rounded-xl text-xs border-border hover:bg-muted/50 font-normal gap-2"
        >
          <a href={`${API_BASE_URL}${API_ENDPOINTS.OAUTH2.GOOGLE}`}>
            <GoogleIcon className="h-4 w-4" />
            <span>Google</span>
          </a>
        </Button>

        <Button
          variant="outline"
          asChild
          className="h-10 rounded-xl text-xs border-border hover:bg-muted/50 font-normal gap-2"
        >
          <a href={`${API_BASE_URL}${API_ENDPOINTS.OAUTH2.FACEBOOK}`}>
            <FacebookIcon className="h-4 w-4 fill-[#1877F2]" />
            <span>Facebook</span>
          </a>
        </Button>
      </div>
    </div>
  );
};
