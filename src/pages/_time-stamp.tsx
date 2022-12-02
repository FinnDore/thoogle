import { format } from "date-fns";

const TimeStamp = ({ seconds }: { seconds: number }) => {
    const date = new Date(seconds * 1000);

    const formattedString = format(date, "mm:ss");
    return <div>{formattedString}</div>;
};

export default TimeStamp;
