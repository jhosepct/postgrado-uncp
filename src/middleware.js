import { NextResponse } from "next/server"

export function middleware(request) {
    // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
    // Getting cookies from the request using the `RequestCookies` API
    let cookie = request.cookies.get('user_token')

    let isAuthenticated = false;

    if (cookie) {
        isAuthenticated = true;
    }

    
   
    // Setting cookies on the response using the `ResponseCookies` API
    const response = NextResponse.next()
    response.cookies.set({
        name: 'isAuthenticated',
        value: isAuthenticated,
        path: '/',
    });
    return response
  }