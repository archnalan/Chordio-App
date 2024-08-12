import React, { useState } from "react";
import { DatePicker, message } from "antd";
import moment, { Moment } from "moment";

const { RangePicker } = DatePicker;

interface YearPickerProps {
  yearStart: number | null;
  yearEnd: number | null;
  onChange: (range: [number, number] | null) => void;
}

const YearRangePicker: React.FC<YearPickerProps> = ({
  yearStart,
  yearEnd,
  onChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<[Moment, Moment] | null>(
    yearStart !== null && yearEnd !== null
      ? [moment(yearStart, "YYYY"), moment(yearEnd, "YYYY")]
      : null
  );

  const handleYearRangeChange = (dates: [Moment, Moment] | null) => {
    if (dates) {
      const [start, end] = dates;
      if (start.year() > end.year()) {
        message.error(
          "The start year must be less than or equal to the end year."
        );
        return;
      }
      setSelectedRange(dates);
      onChange([start.year(), end.year()]);
    } else {
      setSelectedRange(null);
      onChange(null);
    }
  };

  const disabledDate = (current: Moment) => {
    return current && current.year() > moment().year();
  };

  return (
    <RangePicker
      picker="year"
      format="YYYY"
      className="w-100 custom-range-picker"
      value={selectedRange}
      onChange={handleYearRangeChange}
      disabledDate={disabledDate}
    />
  );
};

export default YearRangePicker;
