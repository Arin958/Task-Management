import React from "react";
import * as Icons from "react-icons/fi";

const Icon = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    return <div>Icon not found</div>;
  }
  
  return <IconComponent {...props} />;
};

export default Icon;