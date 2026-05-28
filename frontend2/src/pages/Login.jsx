import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-brand">
          <p className="eyebrow">Task Manager</p>
          <h1>Focus your day.</h1>
          <p>Sign in to keep your work moving.</p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}

export default Login;
