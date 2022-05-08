import internalDayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

internalDayjs.extend(relativeTime);

export { internalDayjs as dayjs };
