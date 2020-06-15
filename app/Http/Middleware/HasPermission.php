<?php

namespace App\Http\Middleware;
use Illuminate\Http\Request;

use Closure;

class HasPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

      if ($request->session()->exists('login')){
        return $next($request);
      }
        $request->session()->flush();
        return redirect()->route('login')
            ->withErrors(['login' => 'Acesso não autorizado.']);
        
    }
}
