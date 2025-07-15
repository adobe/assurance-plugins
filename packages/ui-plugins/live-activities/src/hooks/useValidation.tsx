import { useValidation as useValidationBridge } from "@assurance/plugin-bridge-provider/src/hooks";

function useValidation() {
  return useValidationBridge()
}

export default useValidation;
