"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HomeIcon, UsersIcon, CalendarIcon, ChartBarIcon } from "@heroicons/react/outline"; // Add ChartBarIcon for Dashboard

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<{ username: string; email: string; profilePhoto: string | null }>({
    username: '',
    email: '',
    profilePhoto: null, // To hold the selected profile photo
  });
  const router = useRouter(); // Initialize router for redirection

  // Retrieve user data and profile photo from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedProfilePhoto = localStorage.getItem("profilePhoto"); // To store profile photo separately
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        profilePhoto: storedProfilePhoto || null, // Set the stored profile photo
      });
    }
  }, []);

  // Logout handler to clear localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("profilePhoto"); // Remove profile photo
    router.push("/login"); // Redirect to login page
  };

  // Handle profile photo selection
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const photoUrl = reader.result as string;
        setUser((prevUser) => ({ ...prevUser, profilePhoto: photoUrl }));
        localStorage.setItem("profilePhoto", photoUrl); // Store the profile photo in localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-700 to-gray-900 text-white h-screen p-6 flex flex-col shadow-lg fixed justify-between">
      {/* Top Section: App Title */}
      <div>
        <div className="flex flex-col items-center mb-10">
          <img
            src="/ignited_logo.jpeg" // Ensure the correct path to your logo
            alt="Ignited Minds Technologies"
            className="h-16 mb-2" // Adjust the height as needed (e.g., h-16 for 4rem)
          />
          <h2 className="text-3xl font-semibold text-center text-white-400 mb-8">
            Interview Scheduler
          </h2>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col space-y-4">
          {[
            {
              href: "/home",
              label: "Home",
              icon: <HomeIcon className="h-6 w-6 text-teal-300" />,
            },
            {
              href: "/users",
              label: "Users",
              icon: <UsersIcon className="h-6 w-6 text-teal-300" />,
            },
            {
              href: "/calendar",
              label: "Calendar",
              icon: <CalendarIcon className="h-6 w-6 text-teal-300" />,
            },
            {
              href: "/dashboard", // Dashboard link
              label: "Dashboard",
              icon: <ChartBarIcon className="h-6 w-6 text-teal-300" />, // Using ChartBarIcon for Dashboard
            },
            {
              href: "/contactForm",
              label: "Contact Us",
              icon: (
                <svg
                  className="h-6 w-6 text-teal-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 8a3 3 0 01-3 3H6a3 3 0 01-3-3V7h18v1zM5 12h14v6a3 3 0 01-3 3H8a3 3 0 01-3-3v-6z"
                  />
                </svg>
              ),
            },
          ].map(({ href, label, icon }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center space-x-3 py-2 px-4 rounded transition-colors hover:bg-gray-800"
              >
                {icon}
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section: User Info, Profile Photo, and Logout */}
      {user && (
        <div className="mt-auto text-center">
          {/* Display Profile Photo */}
          {/* <div className="flex flex-col items-center mb-4">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="h-20 w-20 rounded-full mb-2 object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                <span className="text-white">No Photo</span>
              </div>
            )} */}
            {/* Input to Upload Profile Photo */}
            {/* <label className="cursor-pointer text-sm bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition duration-200">
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePhotoChange}
              />
            </label> */}
          {/* </div> */}

          {/* Display Username and Email */}
          <p className="text-lg font-bold">{user?.username}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;