import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  ADMIN_COOKIE_NAME,
  verifySessionToken,
  createSessionToken,
  hashPassword,
  verifyPassword,
} from '@/lib/auth';
import { AdminUser } from '@/types/ecommerce';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const sessionUser = verifySessionToken(token);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Sesi tidak valid' }, { status: 401 });
    }

    // Try fetching freshest data from Supabase
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('admins')
        .select('id, name, email, role, avatar_url, last_login_at')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (data && !error) {
        return NextResponse.json({ user: data });
      }
    } catch {
      // fallback to session user
    }

    return NextResponse.json({ user: sessionUser });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ error: 'Gagal memuat profil admin' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const sessionUser = verifySessionToken(token);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Sesi tidak valid' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, avatar_url, current_password, new_password } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nama administrator wajib diisi.' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email administrator wajib diisi.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const updatedName = name.trim();
    const updatedAvatar = avatar_url?.trim() || null;

    const supabase = await createClient();

    // Check if email already taken by another admin
    const { data: existingAdminWithEmail } = await supabase
      .from('admins')
      .select('id')
      .eq('email', normalizedEmail)
      .neq('id', sessionUser.id)
      .maybeSingle();

    if (existingAdminWithEmail) {
      return NextResponse.json(
        { error: 'Email tersebut sudah digunakan oleh akun administrator lain.' },
        { status: 400 }
      );
    }

    // Fetch current admin DB record for password verification if needed
    const { data: currentAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('id', sessionUser.id)
      .maybeSingle();

    const updates: Record<string, any> = {
      name: updatedName,
      email: normalizedEmail,
      avatar_url: updatedAvatar,
      updated_at: new Date().toISOString(),
    };

    // If password change is requested
    if (new_password) {
      if (!current_password) {
        return NextResponse.json(
          { error: 'Kata sandi saat ini wajib diisi untuk mengubah kata sandi baru.' },
          { status: 400 }
        );
      }

      if (new_password.length < 6) {
        return NextResponse.json(
          { error: 'Kata sandi baru minimal 6 karakter.' },
          { status: 400 }
        );
      }

      if (currentAdmin) {
        const isValid = verifyPassword(current_password, currentAdmin.password_hash);
        if (!isValid) {
          return NextResponse.json(
            { error: 'Kata sandi saat ini tidak cocok.' },
            { status: 400 }
          );
        }
      }

      updates.password_hash = hashPassword(new_password);
    }

    // Update in Supabase
    let updatedAdminUser: AdminUser = {
      id: sessionUser.id,
      name: updatedName,
      email: normalizedEmail,
      role: sessionUser.role,
      avatar_url: updatedAvatar,
    };

    if (currentAdmin) {
      const { data: result, error: updateError } = await supabase
        .from('admins')
        .update(updates)
        .eq('id', sessionUser.id)
        .select('id, name, email, role, avatar_url, last_login_at')
        .single();

      if (updateError) {
        console.error('Supabase update admin error:', updateError);
        return NextResponse.json(
          { error: updateError.message || 'Gagal memperbarui profil di database.' },
          { status: 500 }
        );
      }

      if (result) {
        updatedAdminUser = {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role || sessionUser.role,
          avatar_url: result.avatar_url,
          last_login_at: result.last_login_at,
        };
      }
    } else {
      // If was seed demo admin, create/upsert in admins table
      const passwordToUse = new_password
        ? hashPassword(new_password)
        : hashPassword('admin123');

      const { data: upsertResult, error: upsertError } = await supabase
        .from('admins')
        .upsert({
          name: updatedName,
          email: normalizedEmail,
          password_hash: passwordToUse,
          role: sessionUser.role || 'superadmin',
          avatar_url: updatedAvatar,
        })
        .select('id, name, email, role, avatar_url, last_login_at')
        .single();

      if (upsertResult && !upsertError) {
        updatedAdminUser = {
          id: upsertResult.id,
          name: upsertResult.name,
          email: upsertResult.email,
          role: upsertResult.role || sessionUser.role,
          avatar_url: upsertResult.avatar_url,
          last_login_at: upsertResult.last_login_at,
        };
      }
    }

    // Refresh session cookie with new token
    const newToken = createSessionToken(updatedAdminUser);

    const response = NextResponse.json({
      success: true,
      message: 'Profil administrator berhasil diperbarui!',
      user: updatedAdminUser,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memperbarui profil.' },
      { status: 500 }
    );
  }
}
