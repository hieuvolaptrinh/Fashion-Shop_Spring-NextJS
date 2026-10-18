package com.hieuvolaptrinh.Heatly_Store.Controller;

import com.hieuvolaptrinh.Heatly_Store.Response.Dashboard.DashboardSummaryResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.DashboardService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @ApiMessage("Get admin dashboard summary successfully")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(
            @RequestParam(name = "months", required = false, defaultValue = "6") int months) {
        DashboardSummaryResponse response = dashboardService.getDashboardSummary(months);
        return ResponseEntity.ok(response);
    }
}
