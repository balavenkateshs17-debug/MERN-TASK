import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";

function LoginForm() {
  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(
        loginUser(formData)
      );

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login Successful");
        navigate("/");
      } else {
        throw new Error(resultAction.payload || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-heading">
        <h2>Welcome back</h2>
        <p>Enter your details to continue.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-switch">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default LoginForm;
