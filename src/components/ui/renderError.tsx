import React from "react";

type AuthError = string | Record<string, string[]>;

interface RenderErrorProps {
  error: AuthError | null;
  className?: string;
}

const RenderError: React.FC<RenderErrorProps> = ({ error, className }) => {
  if (!error) return null;

  let message: string;

  if (typeof error === "string") {
    message = error;
  } else {
    // Join semua pesan error dari setiap field
    message = Object.values(error).flat().join(", ");
  }

  return (
    <div
      className={`p-3 bg-red-50 border border-red-300 text-red-700 rounded-md ${
        className || ""
      }`}
    >
      {message}
    </div>
  );
};

export default RenderError;
