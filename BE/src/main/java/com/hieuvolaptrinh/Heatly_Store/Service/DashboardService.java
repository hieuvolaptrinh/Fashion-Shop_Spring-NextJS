package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Response.Dashboard.DashboardSummaryResponse;

public interface DashboardService {
    DashboardSummaryResponse getDashboardSummary(int months);
}
