import React from "react";
import { FaArrowDown } from "react-icons/fa";

const Arrow: React.FC = () => {
  return (
    <div className="flex justify-center w-full mt-8">
      <FaArrowDown className="text-cyan-400 text-2xl sm:text-3xl animate-bounce" />
    </div>
  );
};

export default Arrow;
