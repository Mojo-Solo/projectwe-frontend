import { NextResponse } from 'next/server';
import { config, isDevelopment } from '@/config/environment';
import { RepositoryFactory } from '@/infrastructure/factories/RepositoryFactory';

/**
 * Demo API endpoint to show the auth system in action
 * 
 * GET /api/auth-demo - Shows current environment and available users
 * POST /api/auth-demo - Login with email/password
 */

export async function GET() {
  try {
    const stats = await RepositoryFactory.getStats();
    
    return NextResponse.json({
      environment: isDevelopment() ? 'DEV' : 'PROD',
      message: `Auth system running in ${isDevelopment() ? 'DEV 🚧' : 'PROD 🚀'} mode`,
      config: {
        requireEmailVerification: config.auth.requireEmailVerification,
        sessionDuration: config.auth.sessionDuration,
        passwordMinLength: config.auth.passwordPolicy.minLength,
        testUsersAvailable: isDevelopment() ? config.auth.testUsers.length : 0,
      },
      stats,
      testUsers: isDevelopment() ? config.auth.testUsers.map(u => ({
        email: u.email,
        password: u.password,
        role: u.role,
      })) : undefined,
      features: config.features,
    });
  } catch (error) {
    console.error('Error in auth demo:', error);
    return NextResponse.json(
      { error: 'Failed to get auth system info' },
      { status: 500 }
    );
  }
}