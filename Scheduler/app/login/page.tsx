"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { login } from '../api/api'; // Adjust this import to the correct path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginData = { email, password };

      // Log the login data being sent
      console.log("Sending login data:", loginData);

      // API call to the login function
      const response = await login(loginData);

      // Log the full response
      console.log("API Response:", response);

      // Ensure response has the expected structure
      if (response && response.token && response.user) {
        const { token, user } = response;

        // Log the token and user details
        console.log("Token:", token);
        console.log("User:", user);

        // Store token and user data in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user)); // Store the user data as a string
        
        // Redirect based on the role
        if (user.role === 'ReactJs') {
          console.log("Redirecting to ReactJs home...");
          router.push('/home'); // Redirect to ReactJs home
        } else if (user.role === 'SQL') {
          console.log("Redirecting to SQL home...");
          router.push('/home'); // Redirect to SQL home
        } else {
          console.log("Redirecting to general home...");
          router.push('/home'); // Redirect to home page for other roles
        }
        
        setSuccess(true);
        setError(null);
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (err: any) {
      // Log the error for debugging purposes
      console.error('Login Error:', err);
      setSuccess(false);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-teal-600 to-teal-500">
      <div className="relative p-10 rounded-lg shadow-lg w-full max-w-md z-10 bg-white">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">Login successful!</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <p className="mt-4 text-center text-sm">
            Don't have an account? <Link href="/signIn" className="text-blue-600 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
