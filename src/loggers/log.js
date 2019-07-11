import {
    createLogger,
    format,
    transports
} from 'winston';
import path from 'path';
const {
    label,
    combine,
    timestamp,
    prettyPrint
} = format;

const log = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
        new transports.Console({
            filename: path.resolve(__dirname, '../..', 'logger/dev', 'errors.log'),
            level: 'error',
            json: true
        })
    ]
});

export default log;