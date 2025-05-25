<!-- resources/views/dashboard.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Aplikasi</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <span class="navbar-brand">Dashboard</span>
        <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>
    </div>
</nav>

<div class="container mt-5">
    <div id="alert" class="alert d-none"></div>

    <div class="card p-4 shadow">
        <h4>Selamat Datang</h4>
        <p><strong>Username:</strong> <span id="username"></span></p>
        <p><strong>Email:</strong> <span id="email"></span></p>
        <p><strong>Role:</strong> <span id="role"></span></p>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script>
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = "/login";
}

$.ajax({
    url: '/api/me',
    headers: {
        Authorization: 'Bearer ' + token
    },
    success: function (res) {
        $('#username').text(res.user.username);
        $('#email').text(res.user.email);
        $('#role').text(res.user.role);
    },
    error: function () {
        $('#alert').removeClass('d-none alert-success').addClass('alert-danger').text("Token tidak valid. Silakan login ulang.");
        setTimeout(() => window.location.href = "/login", 2000);
    }
});

$('#logoutBtn').click(function () {
    localStorage.removeItem('token');
    window.location.href = "/login";
});
</script>

</body>
</html>
