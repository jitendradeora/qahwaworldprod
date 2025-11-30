import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const secret = process.env.REVALIDATE_SECRET;
    const token = req.headers.get('x-secret');

    if (!secret) {
      return NextResponse.json(
        { message: 'REVALIDATE_SECRET not configured' }, 
        { status: 500 }
      );
    }

    if (token !== secret) {
      return NextResponse.json(
        { message: 'Invalid secret' }, 
        { status: 401 }
      );
    }

    const body = await req.json();

    const { action, post_type, slug, post_id, post_name } = body;

    // CRITICAL: Clear all WordPress data cache using path revalidation
    // This will clear Next.js fetch cache for all WordPress GraphQL requests

    // Revalidate based on action type
    if (action === 'menu_update') {
      // Menu changes affect the entire layout (header/footer)
      revalidatePath('/', 'layout');
    }
    else if (action === 'create' || action === 'update' || action === 'publish') {
      // Revalidate homepage
      revalidatePath('/');
      
      // If it's a post, revalidate related pages
      if (post_type === 'post') {
        // Revalidate all article pages (dynamic route pattern)
        revalidatePath('/[category]/[id]', 'page');
        
        // Revalidate all category pages
        revalidatePath('/category/[category]', 'page');
        
        // Revalidate all tag pages
        revalidatePath('/tag/[tag]', 'page');
        
        // Revalidate tags listing page
        revalidatePath('/tags', 'page');
        
        // Revalidate search
        revalidatePath('/search', 'page');
      }
      
      // If it's a page, revalidate that specific page
      if (post_type === 'page') {
        if (slug) {
          revalidatePath(`/${slug}`, 'page');
          
          // Special handling for specific pages
          if (slug === 'about') {
            revalidatePath('/about', 'page');
          }
          if (slug === 'contact') {
            revalidatePath('/contact', 'page');
          }
          if (slug === 'privacy-policy') {
            revalidatePath('/privacy-policy', 'page');
          }
        }
        // Pages might affect layout (like home page config)
        revalidatePath('/', 'layout');
      }

      
    } 
    else if (action === 'delete' || action === 'unpublish') {
      // On delete/unpublish, do a full revalidation
      revalidatePath('/', 'layout');
    }
    else if (action === 'media_update') {
      // Media changes might affect any page with images
      revalidatePath('/', 'layout');
    }
    else if (action === 'theme_settings_update') {
      // Theme settings affect the entire site (header, footer, layout, etc.)
      revalidatePath('/', 'layout');
      revalidatePath('/');
    }
    else if (action === 'user_profile_update' && post_type === 'user_profile') {
      // User profile update affects author pages and all articles by that author
      
      // Revalidate homepage (shows articles with author info)
      revalidatePath('/');
      
      // Revalidate all author pages
      revalidatePath('/author/[id]', 'page');
      
      // Revalidate all article pages (they display author images)
      revalidatePath('/[category]/[id]', 'page');
      
      // Revalidate all category pages (they list articles with author info)
      revalidatePath('/category/[category]', 'page');
      
      // Revalidate all tag pages (they list articles with author info)
      revalidatePath('/tag/[tag]', 'page');
    }
    else {
      // Default: revalidate homepage and layout
      revalidatePath('/');
      revalidatePath('/', 'layout');
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      action,
      post_type,
      slug,
      post_id,
      post_name,
      duration_ms: duration,
      now: Date.now() 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: message 
    }, { status: 500 });
  }
}

// GET method for manual testing
export async function GET(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const token = req.nextUrl.searchParams.get('secret');

  if (!secret || token !== secret) {
    return NextResponse.json(
      { message: 'Invalid secret' }, 
      { status: 401 }
    );
  }

  try {
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      now: Date.now() 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false,
      error: message 
    }, { status: 500 });
  }
}
