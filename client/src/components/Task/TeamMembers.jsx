import React, { useState } from "react";
import TeamMemberTooltip from "./TeamMemberTooltip";

const TeamMembers = ({ team }) => {
  const [hoveredMember, setHoveredMember] = useState(null);

  return (
    <div className="flex items-center relative">
      {team.slice(0, 3).map((member, index) => (
        <div 
          key={member._id} 
          className="relative group"
          style={{ zIndex: team.length - index }}
          onMouseEnter={() => setHoveredMember(member)}
          onMouseLeave={() => setHoveredMember(null)}
        >
          <div 
            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs -ml-2 first:ml-0 overflow-hidden border-2 border-white dark:border-gray-700 transition-transform group-hover:scale-110 cursor-pointer"
          >
            {member.name.charAt(0)}
          </div>
          
          {hoveredMember && hoveredMember._id === member._id && (
            <TeamMemberTooltip member={hoveredMember} />
          )}
        </div>
      ))}
      
      {team.length > 3 && (
        <div 
          className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs -ml-2 text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-700 cursor-help"
          title={`${team.length - 3} more team members`}
        >
          +{team.length - 3}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;