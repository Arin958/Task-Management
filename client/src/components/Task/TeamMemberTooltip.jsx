import React from "react";

const TeamMemberTooltip = ({ member }) => {
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
      <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap shadow-lg">
        <div className="font-semibold">{member.name}</div>
        <div className="text-gray-300">{member.title}</div>
        <div className="text-gray-400">{member.email}</div>
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  );
};

export default TeamMemberTooltip;