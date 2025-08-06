"use client";

import React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, GitBranch, Globe, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface DeploymentInfo {
  id: string;
  url: string;
  state: 'BUILDING' | 'ERROR' | 'READY' | 'CANCELED';
  createdAt: string;
  commitSha?: string;
  commitMessage?: string;
}

interface MonitoringAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: 'github' | 'vercel' | 'system';
  message: string;
  timestamp: string;
}

export default function MonitoringDashboard() {
  const [deployments, setDeployments] = useState<DeploymentInfo[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Mock data for demonstration
  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    // In production, this would connect to the monitoring agent
    setDeployments([
      {
        id: 'dep_1',
        url: 'https://weexit-marketing-git-main.vercel.app',
        state: 'READY',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        commitSha: '78c9a1c1',
        commitMessage: 'feat: Complete ProjectWE platform backend - 20% to 100% implementation 🚀'
      },
      {
        id: 'dep_2',
        url: 'https://weexit-marketing-preview.vercel.app',
        state: 'BUILDING',
        createdAt: new Date().toISOString(),
        commitSha: 'abc123',
        commitMessage: 'fix: Update monitoring agent configuration'
      }
    ]);

    setAlerts([
      {
        id: '1',
        level: 'info',
        source: 'vercel',
        message: '✅ New deployment successful',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '2',
        level: 'warning',
        source: 'github',
        message: '2 critical issue(s) open',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]);

    setIsConnected(true);
    setLastUpdate(new Date());
  }, []);

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'READY':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'BUILDING':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'critical':
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Platform Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of ProjectWE deployments and repository
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vercel Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              {deployments.filter(d => d.state === 'READY').length} successful deployments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GitHub Activity</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Issues</div>
            <p className="text-xs text-muted-foreground">
              2 open pull requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Uptime last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deployments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={index}
                key={deployment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(deployment.state)}
                  <div>
                    <p className="font-medium">{deployment.commitMessage}</p>
                    <p className="text-sm text-muted-foreground">
                      {deployment.commitSha} • {new Date(deployment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{deployment.state}</Badge>
                  {deployment.state === 'READY' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(deployment.url, '_blank')}
                    >
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={index}
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={getAlertBadgeVariant(alert.level)}>
                    {alert.level.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.source} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => window.open('https://vercel.com/mojosolos-projects/weexit-marketing', '_blank')}>
              Open Vercel Dashboard
            </Button>
            <Button variant="outline" onClick={() => window.open('https://github.com/mojosolo/weexit-marketing', '_blank')}>
              Open GitHub Repo
            </Button>
            <Button variant="outline">
              View Full Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}