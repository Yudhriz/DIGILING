<!-- resources/views/auth/login.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - Aplikasi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center vh-100">

<div class="card p-4 shadow w-100" style="max-width: 400px;">
    <h4 class="text-center mb-4">Login</h4>
    <div id="alert" class="alert d-none"></div>
    <form id="loginForm">
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" name="username" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
        <div class="text-center mt-2">
            <a href="{{ route('forgot') }}">Lupa Password?</a>
        </div>
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script>
$('#loginForm').submit(function(e) {
    e.preventDefault();
    $.post('/api/login', $(this).serialize())
        .done(function(res) {
            localStorage.setItem('token', res.token);
            window.location.href = '/dashboard'; // sesuaikan
        })
        .fail(function(err) {
            $('#alert').removeClass('d-none alert-success').addClass('alert-danger').text(err.responseJSON.message);
        });
});
</script>

</body>
</html>
