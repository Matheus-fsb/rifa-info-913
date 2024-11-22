const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Armazenando o token no localStorage
        alert('Login bem-sucedido!');
        window.location.href = '/admin-dashboard.html'; // Redireciona para o painel de admin
    } else {
        alert('Credenciais inválidas');
    }
});