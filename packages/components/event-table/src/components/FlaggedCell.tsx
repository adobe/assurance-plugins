import Flag from "@spectrum-icons/workflow/Flag";
import React, { useCallback } from "react";

function FlaggedCell({ annotations }: any) {
  const onPress = useCallback(() => console.log(annotations), []);

  return (
    <div onClick={onPress}>
      <Flag
        UNSAFE_style={{ ...(!annotations?.length && { opacity: 0.5 }) }}
        color={annotations?.length ? "negative" : undefined}
        size="S"
      />
    </div>
  );
}

export default FlaggedCell;
