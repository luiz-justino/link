<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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


        $rules = [
            'login' => 'required_if:certificate,',
            'password' => 'required_if:certificate,',
        ];

        $messages = [
            'login.required' => 'O campo login deve ser preenchido.',
            'login.min' => 'O campo login não atende aos requisitos mínimos.',
            'login.required_if' => 'O campo login deve ser preenchido caso não faça acesso com certificado digital.',
            'password.required' => 'O campo senha deve ser preenchido.',
            'password.required_if' => 'O campo senha deve ser preenchido caso não faça acesso com certificado digital.',
        ]; 

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return redirect()->route('login')
                ->withInput($request->only($request->login, 'remember'))
                ->withErrors($validator->errors());
        }

        $errors = '';

        if($request->certificate) { 
            if (!$cert_store = file_get_contents($_FILES['certificate']['tmp_name'])) {
                $errors = ['certificate' => 'Não foi possível efetuar a leitura do certificado informado.'];
            return redirect()->route('login')
                ->withInput($request->only($request->login, 'remember'))
                ->withErrors($errors);
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
                    $request->session()->flush();
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

    protected function logout(Request $request) {

            $request->session()->flush();
            return redirect()->route('login')
                ->withInput($request->only($request->login, 'remember'));        
    }    
}
