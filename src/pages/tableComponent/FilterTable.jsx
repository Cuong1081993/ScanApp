import { SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, Space } from "antd";
import Input from "antd/es/input/Input";
import { useCallback, useEffect, useState } from "react";
const CheckboxGroup = Checkbox.Group;
const FilterTable = (props) => {
  // eslint-disable-next-line react/prop-types
  const {
    handleSearch,
    handleReset,
    optionsDefault = [],
    setSelectedKeys,
  } = props;
  const [inputValue, setInputValue] = useState(undefined);
  const [option, setOption] = useState(optionsDefault);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedValues, setSelectedValues] = useState(
      optionsDefault.map((i) => i.value)
  );

  let timeoutId;
  useEffect(() => {
    const op = inputValue ? option : optionsDefault;
    setOption(op);
    if (selectAll) {
      setSelectedValues(op.map((i) => i.value));
    }
  }, [inputValue, option, optionsDefault, selectAll]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      let newOptions = optionsDefault.filter((i) => {
        if (typeof i.label === "string") {
          return i.label?.toLowerCase()?.includes(value?.toLowerCase());
        }
        if (!Number.isNaN(value)) {
          return i.label?.toString()?.includes(value?.toString());
        }
        return;
      });
      if (!value) {
        newOptions = optionsDefault;
      }
      setOption(newOptions);
      setSelectedKeys(newOptions.map((i) => i.value));
    }, 300); // 1000 milliseconds = 1 giây
  };

  const onReset = useCallback(() => {
    setInputValue(undefined);
    setOption(optionsDefault);
    setSelectedValues(optionsDefault.map((i) => i.value));
    setSelectedKeys([]);
    setSelectAll(true);
    handleReset();
  }, [handleReset, optionsDefault, setSelectedKeys]);

  const onSearch = useCallback(() => {
    setInputValue(undefined);
    setSelectAll(true);
    handleSearch();
  }, [handleSearch]);

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
    const op = e.target.checked ? option : [];
    setSelectedValues(op.map((i) => i.value));
    setSelectedKeys(op.map((i) => i.value));
  };

  // Xử lý khi checkbox riêng lẻ thay đổi trạng thái
  const handleCheckboxChange = (checkedValues) => {
    setSelectedValues(checkedValues);
    setSelectedKeys(checkedValues);
    setSelectAll(checkedValues.length === option.length);
  };

  return (
      <div>
        <Input value={inputValue} onChange={handleInputChange}></Input>
        <div style={{ marginLeft: 16 }}>
          <Checkbox
              onChange={handleSelectAllChange}
              checked={selectAll}
              style={{ marginTop: 16 }}
          >
            Select All
          </Checkbox>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <CheckboxGroup
                style={{
                  display: "flex",
                  marginLeft: 8,
                  flexDirection: "column",
                }}
                options={option}
                value={selectedValues}
                onChange={handleCheckboxChange}
            />
          </div>
        </div>
        <Space style={{ marginTop: 16 }}>
          <Button
              type="primary"
              onClick={onSearch}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={onReset} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
  );
};

export default FilterTable;
