<!-- resources/views/auth/register.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register - Aplikasi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center vh-100">

<div class="card p-4 shadow w-100" style="max-width: 450px;">
    <h4 class="text-center mb-4">Register</h4>
    <div id="alert" class="alert d-none"></div>
    <form id="registerForm">
        <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" name="username" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Role</label>
            <select name="role" class="form-control" required>
                <option value="admin">Admin</option>
                <option value="guru_bk">Guru BK</option>
                <option value="siswa">Siswa</option>
            </select>
        </div>
        <button class="btn btn-success w-100">Register</button>
        <div class="text-center mt-2">
            <a href="{{ route('login') }}">Sudah punya akun?</a>
        </div>
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script>
$('#registerForm').submit(function(e) {
    e.preventDefault();
    $.post('/api/register', $(this).serialize())
        .done(function(res) {
            $('#alert').removeClass('d-none alert-danger').addClass('alert-success').text(res.message);
        })
        .fail(function(err) {
            $('#alert').removeClass('d-none alert-success').addClass('alert-danger').text(err.responseJSON.message);
        });
});
</script>

</body>
</html>
