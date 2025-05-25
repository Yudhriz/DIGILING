<!-- resources/views/auth/reset-password.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password - Aplikasi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center vh-100">

<div class="card p-4 shadow w-100" style="max-width: 450px;">
    <h4 class="text-center mb-4">Reset Password</h4>
    <div id="alert" class="alert d-none"></div>
    <form id="resetForm">
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">OTP</label>
            <input type="text" name="otp" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Password Baru</label>
            <input type="password" name="new_password" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Konfirmasi Password Baru</label>
            <input type="password" name="new_password_confirmation" class="form-control" required>
        </div>
        <button class="btn btn-primary w-100">Reset Password</button>
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script>
$('#resetForm').submit(function(e) {
    e.preventDefault();
    $.post('/api/reset-password', $(this).serialize())
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
