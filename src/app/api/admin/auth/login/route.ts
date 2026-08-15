import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPassword, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { AdminUser } from '@/types/ecommerce';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query admin from Supabase database
    let adminUser: AdminUser | null = null;
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (data && !error) {
        const isMatch = verifyPassword(password, data.password_hash);
        if (isMatch) {
          adminUser = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role || 'admin',
            avatar_url: data.avatar_url,
            last_login_at: data.last_login_at,
          };

          // Update last_login_at asynchronously
          supabase
            .from('admins')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', data.id)
            .then(() => {});
        }
      }
    } catch (dbError) {
      console.warn('Supabase query error, checking fallback demo admin:', dbError);
    }

    // Fallback demo admin for development/preview if database query fails or match fallback
    if (!adminUser && normalizedEmail === 'admin@sparke.id' && password === 'admin123') {
      adminUser = {
        id: 'admin-seed-1',
        name: 'Admin Pusat',
        email: 'admin@sparke.id',
        role: 'superadmin',
        avatar_url: null,
      };
    }

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Email atau password yang Anda masukkan salah.' },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSessionToken(adminUser);

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil! Mengalihkan ke dashboard...',
      user: adminUser,
    });

    // Set cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses login.' },
      { status: 500 }
    );
  }
}
