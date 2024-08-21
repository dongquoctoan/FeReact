import { Input, Select } from "antd";
import InputNumber from "components/InputNumber";
import { Option as OptionType } from "constants/types/common.type";
import { FC, useEffect, useMemo, useState } from "react";

const { Option } = Select;
const SHOW_INPUT_OPTION_VALUE = "SHOW_INPUT_OPTION_VALUE";

type Props = {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<OptionType>;
  labelOptionOpenInput: string;
};

const InputSelector: FC<Props> = ({
  value,
  onChange,
  options,
  labelOptionOpenInput,
}) => {
  const [isShowInput, setIsShowInput] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string | number>(value);

  const optionValues = useMemo(() => {
    return options.map((option) => option.value);
  }, [options]);

  useEffect(() => {
    if (!optionValues.includes(value)) {
      setIsShowInput(true);
      setSelectValue(SHOW_INPUT_OPTION_VALUE);
    } else {
      setIsShowInput(false);
      setSelectValue(value);
    }
  }, [value]);

  const selectOption = (optionValue: string | number) => {
    if (!optionValues.includes(optionValue)) {
      setIsShowInput(true);
    } else {
      setIsShowInput(false);
      onChange(optionValue);
    }

    setSelectValue(optionValue);
  };

  return (
    <Input.Group compact>
      <Select
        dropdownMatchSelectWidth={false}
        value={selectValue}
        style={{ width: "50%" }}
        onChange={selectOption}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}

        <Option value={SHOW_INPUT_OPTION_VALUE}>{labelOptionOpenInput}</Option>
      </Select>
      {isShowInput && (
        <InputNumber
          style={{ width: "50%" }}
          value={value.toString()}
          onChange={onChange}
        />
      )}
    </Input.Group>
  );
};

export default InputSelector;
