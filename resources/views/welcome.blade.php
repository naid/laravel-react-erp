<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'ERP System') }}</title>

        <!-- Styles / Scripts -->
        <link rel="stylesheet" href="/css/app.css">
        <script src="/js/app.js" defer></script>
    </head>

    <body class="antialiased">
        <div id="root"></div>
        
        <!-- Test Tailwind CSS -->
        <div class="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
            ✅ Tailwind CSS is working!
        </div>
    </body>
</html>
