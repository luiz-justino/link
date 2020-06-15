@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Link Certificação Digital - Acesso:</div>

                <div class="card-body">
                    <form id="form-login" method="POST" action="{{ route('login') }}" enctype="multipart/form-data">
                        @csrf

                        <div class="form-group row">
                            <label for="email" class="col-md-4 col-form-label text-md-right"></label>

                            <div class="col-md-6">
                                <input id="login" type="text" class="form-control @error('login') is-invalid @enderror" name="login" value="{{ old('login') }}" placeholder="Login (CPF/CNPJ)" autocomplete="login" autofocus>

                                @error('login')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right"></label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" placeholder="Senha" autocomplete="current-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-md-6 offset-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                    <label class="form-check-label" for="remember">
                                        {{ __('Lembrar-me') }}

                                        @if (Route::has('password.request'))
                                            <a class="btn btn-link" href="{{ route('password.request') }}" style="float: right; margin-left: 81px; margin-top: -8px;">
                                                {{ __('Esqueceu a senha?') }}
                                            </a>
                                        @endif                                        
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row mb-0" style="text-align: center;">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary" style="border-radius: 30px; border-color: #5867dd; background-color: #5867dd; padding: 10px 35px 10px 35px;">
                                    {{ __('Entrar') }}
                                </button>
<!-- 
                                @if (Route::has('password.request'))
                                    <a class="btn btn-link" href="{{ route('password.request') }}">
                                        {{ __('Esqueceu a senha?') }}
                                    </a>
                                @endif -->
                            </div>
                        </div>

                        <div class="form-group row mb-0" style="margin-top: 30px; text-align: center;">
                            <div class="col-12" id="btn-cd">
                                <button type="button" id="btn-certificate" name="btn-certificate" class="btn btn-primary is-invalid" style="border-radius: 30px; border-color: #34bfa3; background-color: #34bfa3; padding: 10px 35px 10px 35px;"  data-toggle="collapse" data-target="#collapse-certificate" aria-expanded="false" aria-controls="collapse-certificate" autofocus>
                                    {{ __('Logar com certificado digital') }}
                                </button>

                                @error('certificate')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="collapse" id="collapse-certificate" style="margin-top: 25px;">
                          <div class="card card-body">
                            <div class="row">
                                <div class="row col-12">
                                    <div class="col-md-6">
                                        <label for="certificate">Selecione seu certificado digital</label>
                                         <input type="file" id="certificate" name="certificate">                                        
                                    </div>
                                    <div class="col-md-6">
                                        <button type="submit" class="btn btn-primary" style="border-radius: 30px; border-color: #5867dd; background-color: #5867dd; padding: 10px 35px 10px 35px; float: right;">
                                            {{ __('Acessar') }}
                                        </button>                                        
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>



                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
<script src="{{ asset('js/jquery-3.5.1.min.js') }}"></script>
<script src="{{ asset('JS/base/general.js') }}"></script>
<script src="{{ asset('js/bootstrap/bootstrap.min.js') }}"></script>
<script src="{{ asset('js/auth/certificate.js') }}"></script>