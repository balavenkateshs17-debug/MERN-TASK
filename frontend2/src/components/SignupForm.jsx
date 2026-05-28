import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const validateSignup = (formData) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!emailPattern.test(formData.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

function SignupForm() {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormError("");
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "",
    });

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const errors = validateSignup(formData);

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    try {
      const resultAction = await dispatch(
        signupUser(formData)
      );

      if (signupUser.fulfilled.match(resultAction)) {
        toast.success("Signup Successful");
        navigate("/");
      } else {
        const message = resultAction.payload || "Signup failed";
        setFormError(message);
        throw new Error(message);
      }
    } catch (error) {
      toast.error(error.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-heading">
        <h2>Create account</h2>
        <p>Your workspace is one form away.</p>
      </div>

      {formError && (
        <div className="form-alert" role="alert">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "signup-name-error" : undefined}
          required
        />
        {fieldErrors.name && (
          <p className="field-error" id="signup-name-error">
            {fieldErrors.name}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
          required
        />
        {fieldErrors.email && (
          <p className="field-error" id="signup-email-error">
            {fieldErrors.email}
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
          required
        />
        {fieldErrors.password && (
          <p className="field-error" id="signup-password-error">
            {fieldErrors.password}
          </p>
        )}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default SignupForm;
