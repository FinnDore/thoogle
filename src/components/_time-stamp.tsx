import { format } from "date-fns";
import { useMemo } from "react";

const TimeStamp = ({ seconds }: { seconds: number }) => {
    const formattedString = useMemo(
        () => format(new Date(seconds * 1000), "mm:ss"),
        [seconds]
    );
    return <div>{formattedString}</div>;
};

export default TimeStamp;
