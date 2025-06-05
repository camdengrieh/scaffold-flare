import { useCallback, useEffect, useState } from "react";
import { CommonInputProps, InputBase, UNSIGNED_NUMBER_REGEX } from "~~/components/scaffold-eth";

// 1 USDC = 1,000,000 units (6 decimals)
const USDC_DECIMALS = 6;

type USDCInputProps = CommonInputProps<string>;

/**
 * Input for USDC amounts with proper 6-decimal handling
 */
export const USDCInput = ({ value, onChange, ...props }: USDCInputProps) => {
  const [transitoryDisplayValue, setTransitoryDisplayValue] = useState<string>("");

  useEffect(() => {
    setTransitoryDisplayValue(value);
  }, [value]);

  const onChange_ = useCallback(
    (newValue: string) => {
      if (newValue && !UNSIGNED_NUMBER_REGEX.test(newValue)) {
        return;
      }

      // Handle empty input
      if (newValue === "" || newValue === ".") {
        setTransitoryDisplayValue(newValue);
        onChange("");
        return;
      }

      // Limit decimal places to 6 for USDC
      const parts = newValue.split(".");
      if (parts[1] && parts[1].length > USDC_DECIMALS) {
        return;
      }

      setTransitoryDisplayValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <InputBase
      name="usdc-input"
      value={transitoryDisplayValue}
      placeholder="0"
      onChange={onChange_}
      prefix={<span className="pl-4 pr-1 text-accent self-center">💵</span>}
      suffix={
        <div className="space-x-2 flex">
          <span className="text-xs font-medium tracking-wide leading-none text-accent px-4">USDC</span>
        </div>
      }
      {...props}
    />
  );
};
