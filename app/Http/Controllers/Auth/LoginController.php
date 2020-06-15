<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    //protected $redirectTo = RouteServiceProvider::HOME;
      protected $redirectTo = '/';

      protected $allowed_users = [
        'link',
        '58657277026',
      ];

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    protected function login(Request $request) {

        $errors = '';


        if($request->certificate) {
            //dd($_FILES['certificate']);
            if (!$cert_store = file_get_contents($_FILES['certificate']['tmp_name'])) {
                echo "Error: Unable to read the cert file\n";
                exit;
            }

            if (openssl_pkcs12_read($cert_store, $cert_info, "1234")) {
                $request->session()->put(['certificate' => $cert_info, 'has_permission' => true]);
                return redirect()->route('home');
            } else {
                $errors = ['certificate' => 'Não foi possível efetuar logon com o certificado informado.'];
            return redirect()->route('login')
                ->withInput($request->only($request->login, 'remember'))
                ->withErrors($errors);
            }            
        }

        if($request->login) {
            $acces_permited = false;

            switch ($request->login) {
                case 'link':
                $acces_permited = $request->password === 'developer';
                    break;
                case '58657277026':
                    $acces_permited = $request->password === '1234';
                    break;

                default:
                    $acces_permited = false;
                    $errors = ['login' => 'Acesso não autorizado.'];
                    break;
            }

            if($acces_permited) {
                $request->session()->put(['login' => $request->login, 'has_permission' => true]);
                return redirect()->route('home');

            }

            if($acces_permited === false && in_array($request->login, $this->allowed_users)) {
                $errors = ['password' => 'Senha inválida.'];
            }

            $request->session()->flush();

            return redirect()->route('login')
                ->withInput($request->only($request->login, 'remember'))
                ->withErrors($errors);

        }




    }
}
