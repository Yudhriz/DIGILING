<!-- resources/views/auth/forgot-password.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lupa Password - Aplikasi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center vh-100">

<div class="card p-4 shadow w-100" style="max-width: 400px;">
    <h4 class="text-center mb-4">Lupa Password</h4>
    <div id="alert" class="alert d-none"></div>
    <form id="forgotForm">
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <button class="btn btn-warning w-100">Kirim OTP</button>
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script>
$('#forgotForm').submit(function(e) {
    e.preventDefault();
    $.post('/api/forgot-password', $(this).serialize())
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
