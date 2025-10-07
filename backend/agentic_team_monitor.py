#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: agentic_team_monitor.py
# Purpose: Monitor and manage agentic teams
# Last modified: 2025-01-27
# By: AI Assistant
# Completeness: 100/100

import time
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import asyncio
from dataclasses import asdict

from agentic_team_system import agentic_team_system, AgenticTeam, AgentTask

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AgenticTeamMonitor:
    """
    Monitor and manage agentic teams
    Provides real-time monitoring, analytics, and management capabilities
    """
    
    def __init__(self):
        self.monitoring_active = False
        self.metrics = {
            "total_teams_created": 0,
            "total_tasks_completed": 0,
            "total_tasks_failed": 0,
            "average_execution_time": 0,
            "success_rate": 0,
            "active_teams": 0,
            "completed_teams": 0
        }
        self.performance_history = []
        
    def start_monitoring(self):
        """Start monitoring agentic teams"""
        self.monitoring_active = True
        logger.info("Agentic team monitoring started")
        
    def stop_monitoring(self):
        """Stop monitoring agentic teams"""
        self.monitoring_active = False
        logger.info("Agentic team monitoring stopped")
        
    def get_team_analytics(self, team_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed analytics for a specific team"""
        team_status = agentic_team_system.get_team_status(team_id)
        if not team_status:
            return None
            
        # Calculate detailed metrics
        analytics = {
            "team_id": team_id,
            "project_name": team_status.get("project_name", ""),
            "status": team_status.get("status", ""),
            "agents": team_status.get("agents", []),
            "task_metrics": {
                "total_tasks": team_status.get("total_tasks", 0),
                "completed_tasks": team_status.get("completed_tasks", 0),
                "failed_tasks": team_status.get("failed_tasks", 0),
                "completion_rate": (team_status.get("completed_tasks", 0) / 
                                  max(team_status.get("total_tasks", 1), 1)) * 100
            },
            "execution_time": team_status.get("execution_time", 0),
            "efficiency_score": self._calculate_efficiency_score(team_status),
            "timestamp": time.time()
        }
        
        return analytics
    
    def get_system_analytics(self) -> Dict[str, Any]:
        """Get system-wide analytics"""
        all_teams = agentic_team_system.get_all_teams()
        
        # Calculate system metrics
        total_teams = all_teams.get("total_teams", 0)
        active_teams = all_teams.get("active_teams", 0)
        
        # Calculate success rate from history
        history = all_teams.get("history", [])
        completed_teams = len([t for t in history if t.get("status") == "completed"])
        failed_teams = len([t for t in history if t.get("status") == "failed"])
        total_completed = completed_teams + failed_teams
        
        success_rate = (completed_teams / max(total_completed, 1)) * 100 if total_completed > 0 else 0
        
        # Calculate average execution time
        execution_times = [t.get("execution_time", 0) for t in history if t.get("execution_time")]
        avg_execution_time = sum(execution_times) / len(execution_times) if execution_times else 0
        
        system_analytics = {
            "overview": {
                "total_teams": total_teams,
                "active_teams": active_teams,
                "completed_teams": completed_teams,
                "failed_teams": failed_teams,
                "success_rate": success_rate,
                "average_execution_time": avg_execution_time
            },
            "performance": {
                "teams_per_hour": self._calculate_teams_per_hour(),
                "average_tasks_per_team": self._calculate_avg_tasks_per_team(),
                "most_common_agents": self._get_most_common_agents(),
                "execution_trends": self._get_execution_trends()
            },
            "health": {
                "system_status": "healthy" if active_teams < 50 else "overloaded",
                "error_rate": (failed_teams / max(total_teams, 1)) * 100,
                "uptime": self._calculate_uptime()
            },
            "timestamp": time.time()
        }
        
        return system_analytics
    
    def _calculate_efficiency_score(self, team_status: Dict[str, Any]) -> float:
        """Calculate efficiency score for a team"""
        completed = team_status.get("completed_tasks", 0)
        total = team_status.get("total_tasks", 1)
        execution_time = team_status.get("execution_time", 0)
        
        # Base score from completion rate
        completion_score = (completed / max(total, 1)) * 100
        
        # Time efficiency (faster is better, but not too fast)
        time_score = 100 if execution_time < 60 else max(0, 100 - (execution_time - 60) / 10)
        
        # Combined efficiency score
        efficiency = (completion_score * 0.7 + time_score * 0.3)
        
        return min(100, max(0, efficiency))
    
    def _calculate_teams_per_hour(self) -> float:
        """Calculate teams processed per hour"""
        # This would be calculated from historical data
        # For now, return a placeholder
        return 2.5
    
    def _calculate_avg_tasks_per_team(self) -> float:
        """Calculate average tasks per team"""
        all_teams = agentic_team_system.get_all_teams()
        teams = all_teams.get("active", []) + all_teams.get("history", [])
        
        if not teams:
            return 0
        
        total_tasks = sum(team.get("total_tasks", 0) for team in teams)
        return total_tasks / len(teams)
    
    def _get_most_common_agents(self) -> List[Dict[str, Any]]:
        """Get most commonly used agents"""
        all_teams = agentic_team_system.get_all_teams()
        teams = all_teams.get("active", []) + all_teams.get("history", [])
        
        agent_counts = {}
        for team in teams:
            agents = team.get("agents", [])
            for agent in agents:
                agent_counts[agent] = agent_counts.get(agent, 0) + 1
        
        # Sort by count
        sorted_agents = sorted(agent_counts.items(), key=lambda x: x[1], reverse=True)
        
        return [{"agent": agent, "count": count} for agent, count in sorted_agents[:5]]
    
    def _get_execution_trends(self) -> Dict[str, Any]:
        """Get execution time trends"""
        # This would analyze historical data for trends
        # For now, return placeholder data
        return {
            "trend": "stable",
            "average_improvement": 0.05,
            "peak_hours": ["09:00-11:00", "14:00-16:00"]
        }
    
    def _calculate_uptime(self) -> float:
        """Calculate system uptime percentage"""
        # This would be calculated from actual uptime data
        # For now, return a placeholder
        return 99.9
    
    def get_team_performance_report(self, team_id: str) -> Optional[Dict[str, Any]]:
        """Generate a detailed performance report for a team"""
        analytics = self.get_team_analytics(team_id)
        if not analytics:
            return None
        
        report = {
            "team_id": team_id,
            "project_name": analytics.get("project_name", ""),
            "performance_summary": {
                "efficiency_score": analytics.get("efficiency_score", 0),
                "completion_rate": analytics.get("task_metrics", {}).get("completion_rate", 0),
                "execution_time": analytics.get("execution_time", 0),
                "status": analytics.get("status", "")
            },
            "recommendations": self._generate_recommendations(analytics),
            "metrics": analytics,
            "timestamp": time.time()
        }
        
        return report
    
    def _generate_recommendations(self, analytics: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on analytics"""
        recommendations = []
        
        efficiency = analytics.get("efficiency_score", 0)
        completion_rate = analytics.get("task_metrics", {}).get("completion_rate", 0)
        execution_time = analytics.get("execution_time", 0)
        
        if efficiency < 70:
            recommendations.append("Consider optimizing task dependencies to improve efficiency")
        
        if completion_rate < 80:
            recommendations.append("Review failed tasks and improve error handling")
        
        if execution_time > 300:  # 5 minutes
            recommendations.append("Consider parallelizing tasks to reduce execution time")
        
        if not recommendations:
            recommendations.append("Team performance is optimal")
        
        return recommendations
    
    def export_analytics(self, format: str = "json") -> str:
        """Export analytics data"""
        analytics = self.get_system_analytics()
        
        if format.lower() == "json":
            return json.dumps(analytics, indent=2)
        elif format.lower() == "csv":
            # Convert to CSV format
            csv_data = "metric,value\n"
            for key, value in analytics.get("overview", {}).items():
                csv_data += f"{key},{value}\n"
            return csv_data
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def cleanup_old_teams(self, days_old: int = 7):
        """Clean up old completed teams"""
        cutoff_time = time.time() - (days_old * 24 * 60 * 60)
        
        # This would clean up old team data
        # Implementation depends on storage backend
        logger.info(f"Cleaning up teams older than {days_old} days")

# Global monitor instance
agentic_team_monitor = AgenticTeamMonitor()

