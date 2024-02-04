import AsyncSelect from "react-select/async";

const MultiSelectTagDropdown = ({
  defaultValue = [],
  loadOptions,
  onChange,
}) => {
  console.log(defaultValue, "defaultValue");
  return (
    <AsyncSelect
      defaultValue={defaultValue}
      defaultOptions
      isMulti
      loadOptions={loadOptions}
      className="relative z-20"
      onChange={onChange}
    />
  );
};

export default MultiSelectTagDropdown;
