import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="text-6xl">🌙</div>
      <h1 className="text-xl font-semibold text-mind-textMain">
        Page floated off into space
      </h1>
      <p className="text-sm text-mind-textSoft">
        This route doesn&apos;t exist. Let&apos;s gently guide you back home.
      </p>
      <Button as="button" onClick={() => (window.location.href = "/home")}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
