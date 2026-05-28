import SignupForm from "../components/SignupForm";

function Signup() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-brand">
          <p className="eyebrow">Task Manager</p>
          <h1>Start clean.</h1>
          <p>Create an account and get your tasks in order.</p>
        </div>

        <SignupForm />
      </section>
    </main>
  );
}

export default Signup;
