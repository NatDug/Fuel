import React, { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
};

const AuthForm: React.FC<Props> = ({ onSubmit }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    saId: "",
    password: "",
    ficaFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignup ? "Sign Up" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="saId"
          placeholder="South African ID Number"
          value={form.saId}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {isSignup && (
          <div>
            <label className="block mb-1 font-medium">FICA Document (PDF/JPG/PNG)</label>
            <input
              className="w-full border p-2 rounded"
              type="file"
              name="ficaFile"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 underline"
          onClick={() => setIsSignup((s) => !s)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;