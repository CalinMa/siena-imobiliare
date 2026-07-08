import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Flag global pentru mentenanță
  const isUnderConstruction = true;
  const path = request.nextUrl.pathname;
  const hostname = request.nextUrl.hostname;
  
  // Aplicăm bariera doar pe domeniul oficial de producție
  // Ignorăm localhost și domeniile .vercel.app pentru a putea lucra și arăta site-ul
  if (hostname !== 'sienaimobiliare.ro' && hostname !== 'www.sienaimobiliare.ro') {
    return NextResponse.next();
  }
  
  if (isUnderConstruction) {
    // Permitem accesul doar la admin, API, fișiere statice și pagina de coming-soon
    if (
      path.startsWith('/admin') ||
      path.startsWith('/api') ||
      path.startsWith('/_next') ||
      path === '/coming-soon' ||
      path.includes('.')
    ) {
      return NextResponse.next();
    }
    
    // Redirecționăm orice altă pagină spre /coming-soon
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
