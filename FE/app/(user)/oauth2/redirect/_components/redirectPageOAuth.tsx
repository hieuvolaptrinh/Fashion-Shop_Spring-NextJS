"use client";

import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function redirectPageOAuth() {
   const [countdown, setCountdown] = useState(5);

   const route = useRouter();
   const paramUrl = useSearchParams();

   localStorage.setItem("accessToken", paramUrl.get("token") || "");
   localStorage.setItem("user", paramUrl.get("fullName") || "");

   useEffect(() => {
     const timer = setInterval(() => {
       setCountdown((prev) => {
         if (prev <= 1) {
           route.push("/");
           return 0;
         }
         return prev - 1;
       });
     }, 1000);

     return () => clearInterval(timer);
   }, []);

   const handleRedirectHome = () => {
     route.push("/");
   };

   return (
     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 p-4">
       <Card className="mx-auto w-full max-w-md shadow-lg">
         <CardHeader className="space-y-4 text-center">
           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
             <CheckCircle className="h-8 w-8 text-green-600" />
           </div>
           <div>
             <CardTitle className="text-center text-2xl font-bold text-green-800">
               Đăng nhập thành công!
             </CardTitle>
             <CardDescription className="mt-2 text-gray-600">
               Chào mừng bạn quay trở lại
             </CardDescription>
           </div>
         </CardHeader>

         <CardContent>
           <div className="space-y-4">
             <div className="text-center">
               <p className="mb-2 text-sm text-gray-600">
                 Tự động chuyển hướng sau {countdown} giây
               </p>
               <div className="h-2 w-full rounded-full bg-gray-200">
                 <div
                   className="h-2 rounded-full bg-green-600 transition-all duration-1000"
                   style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                 />
               </div>
             </div>

             <Button
               onClick={handleRedirectHome}
               className="w-full bg-green-600 hover:bg-green-700"
               size="lg"
             >
               <Home className="mr-2 h-4 w-4" />
               Về trang chủ ngay
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
   );
}