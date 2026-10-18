import React from "react";
import { Phone, Mail, CreditCard, ShieldCheck } from "lucide-react";

export const HeaderTopBar: React.FC = () => {
  return (
    <div className="bg-muted/40 hidden border-b border-border/40 md:block text-xs text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-9 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 hover:text-foreground transition-colors">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>093.1133.128 - 08.193.148.93</span>
            </div>

            <div className="flex items-center space-x-1.5 hover:text-foreground transition-colors">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>lanchuyenhangsale@gmail.com</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>MB: 0937429455 - NGUYEN THI MONG LAN</span>
            </div>

            <div className="flex items-center space-x-1.5 text-primary font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Cam kết chính hãng 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
