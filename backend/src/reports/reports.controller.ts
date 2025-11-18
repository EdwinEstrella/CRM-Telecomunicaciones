import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";

@Controller("reports")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("dashboard")
  @Permissions("reports:view")
  getDashboardMetrics(@Query("startDate") startDate?: string, @Query("endDate") endDate?: string) {
    return this.reportsService.getDashboardMetrics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Get("tickets")
  @Permissions("reports:view")
  getTicketsReport(
    @Query("status") status?: string,
    @Query("priority") priority?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.reportsService.getTicketsReport({
      status,
      priority,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get("conversations")
  @Permissions("reports:view")
  getConversationsReport(
    @Query("channel") channel?: string,
    @Query("status") status?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.reportsService.getConversationsReport({
      channel,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get("agents")
  @Permissions("reports:view")
  getAgentsPerformance(@Query("startDate") startDate?: string, @Query("endDate") endDate?: string) {
    return this.reportsService.getAgentsPerformance(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Get("technicians")
  @Permissions("reports:view")
  getTechniciansPerformance(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return this.reportsService.getTechniciansPerformance(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }
}
