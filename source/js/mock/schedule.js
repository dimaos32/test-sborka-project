import dayjs from 'dayjs';

const TRIP_TIME = 50;
const MINIMUM_ATTENDANCE_TIME = 0;

const DirectDepartures = [
  '18:00',
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '21:00'
];

const ReturnDepartures = [
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '19:35',
  '21:50',
  '21:55'
];

const Direction = {
  DIRECT: 'direct',
  RETURN: 'return',
  BOTH_SIDES: 'both-sides',
};

const TicketPrice = {
  'direct': 700,
  'return': 700,
  'both-sides': 1200,
};

const qEndingsMap = {
  ticket: ['билет', 'билета', 'билетов'],
  hour: ['час', 'часа', 'часов'],
  minute: ['минута', 'минуты', 'минут'],
};

const Schedule = {
  getDirectDepartures() {
    return DirectDepartures
        .map((elem) => {
          const splitElem = elem.split(':');

          return [elem, dayjs().hour(splitElem[0]).minute(splitElem[1]).second(0)];
        });
  },

  getReturnDepartures() {
    return ReturnDepartures
        .map((elem) => {
          const splitElem = elem.split(':');

          return [elem, dayjs().hour(splitElem[0]).minute(splitElem[1]).second(0)];
        });
  },

  getTripTime() {
    return TRIP_TIME;
  },

  getMinimumAttendanceTime() {
    return MINIMUM_ATTENDANCE_TIME;
  },
};

const getQEndings = (q, word) => {
  if (q % 100 < 11 || q % 100 > 14) {
    if (q % 10 === 1) {
      return qEndingsMap[word][0];
    } else if (q % 10 > 1 && q % 10 < 5) {
      return qEndingsMap[word][1];
    }
  }

  return qEndingsMap[word][2];
};

export {Direction, TicketPrice, Schedule, getQEndings};
