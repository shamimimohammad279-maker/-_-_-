import React from "react";
import PropertiesPanel from "./PropertiesPanel";

export default function MobileBottomSheet(props) {
  return (
    <div className="mobile-sheet glass">
      <PropertiesPanel {...props} />
    </div>
  );
}
