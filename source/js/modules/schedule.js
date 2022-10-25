import {Direction, TicketPrice, Schedule, getQEndings} from '../mock/schedule';

const MINUTES_IN_HOUR = 60;

const schedule = document.querySelector('.schedule');

const initSchedule = () => {
  if (!schedule) {
    return;
  }

  const tripTime = Schedule.getTripTime();
  const minimumAttendanceTime = Schedule.getMinimumAttendanceTime();
  const directDepartures = Schedule.getDirectDepartures();
  const returnDepartures = Schedule.getReturnDepartures();

  const directionSelect = schedule.querySelector('[data-direction-select]');
  const directDepartureSection = schedule.querySelector('[data-direct-departure]');
  const directDepartureSelect = directDepartureSection.querySelector('[data-direct-departure-select]');
  const returnDepartureSection = schedule.querySelector('[data-return-departure]');
  const returnDepartureSelect = returnDepartureSection.querySelector('[data-return-departure-select]');
  const ticketsQty = schedule.querySelector('[data-tickets-qty]');
  const calculateBtn = schedule.querySelector('[data-calculate-btn]');
  const messageSection = schedule.querySelector('[data-message]');

  const getSelectOptions = (options) => (
    options.map((item) => `<option value="${item[0].replace(':', '-')}-direct">${item[0]}</option>`)
  );

  const renderDirectTripCase = () => {
    directDepartureSection.classList.remove('is-hide');
    returnDepartureSection.classList.add('is-hide');
  };

  const renderReturnTripCase = () => {
    directDepartureSection.classList.add('is-hide');
    returnDepartureSection.classList.remove('is-hide');

    returnDepartureSelect.innerHTML = getSelectOptions(returnDepartures);
  };

  const getDayJsObject = (selectdata, scheduleData) => {
    const currentDirectDepartureHumanizedDate = selectdata.replace('-direct', '').replace('-', ':');
    return scheduleData.find((item) => item[0] === currentDirectDepartureHumanizedDate)[1];
  };

  const renderCurrentReturnTripOptions = () => {
    const currentDirectDepartureDate = getDayJsObject(directDepartureSelect.value, directDepartures);
    const currentDirectArrivalDate = currentDirectDepartureDate.add(tripTime + minimumAttendanceTime, 'minute');

    const filteredReturnDepartures = returnDepartures.filter((item) => item[1].isAfter(currentDirectArrivalDate));

    returnDepartureSelect.innerHTML = getSelectOptions(filteredReturnDepartures);
  };

  const renderBothSidesTripCase = () => {
    directDepartureSection.classList.remove('is-hide');
    returnDepartureSection.classList.remove('is-hide');

    renderCurrentReturnTripOptions();
  };

  const renderTripCase = (data) => {
    switch (data) {
      case Direction.DIRECT:
        renderDirectTripCase();
        break;
      case Direction.RETURN:
        renderReturnTripCase();
        break;
      case Direction.BOTH_SIDES:
        renderBothSidesTripCase();
        break;
      default:
        throw new Error('Unknown case');
    }
  };

  const onDirectionSelectChange = () => {
    renderTripCase(directionSelect.value);
  };

  const onDirectDepartureSelectChange = () => {
    renderCurrentReturnTripOptions();
  };

  const onTicketsQtyChange = ({target}) => {
    if (Number(target.value) < Number(target.min)) {
      target.value = target.min;
    }

    if (Number(target.value) > Number(target.max)) {
      target.value = target.max;
    }
  };

  const generateWarningMessage = () => (`
    <p class="warning">Необходимо указать кол-во билетов.</p>
  `);

  const getTimeDuration = (data) => {
    const hours = data[1].diff(data[0], 'hour');
    const minutes = data[1].diff(data[0], 'minute') % MINUTES_IN_HOUR;
    const hoursHumanized = hours > 0 ? `${hours} ${getQEndings(hours, 'hour')} ` : '';
    const minutesHumanized = minutes > 0 ? `${minutes} ${getQEndings(minutes, 'minute')}` : '';

    return `${hoursHumanized}${minutesHumanized}`;
  };

  const getTimePoints = (data) => {
    switch (data) {
      case Direction.DIRECT:
        const SelectedDirectDate = getDayJsObject(directDepartureSelect.value, directDepartures);
        return [SelectedDirectDate, SelectedDirectDate.add(tripTime + minimumAttendanceTime, 'minute')];
      case Direction.RETURN:
        const SelectedReturnDate = getDayJsObject(returnDepartureSelect.value, returnDepartures);
        return [SelectedReturnDate, SelectedReturnDate.add(tripTime + minimumAttendanceTime, 'minute')];
      case Direction.BOTH_SIDES:
        const SelectedBothDirectDate = getDayJsObject(directDepartureSelect.value, directDepartures);
        const SelectedBothReturntDate = getDayJsObject(returnDepartureSelect.value, returnDepartures);
        return [SelectedBothDirectDate, SelectedBothReturntDate.add(tripTime + minimumAttendanceTime, 'minute')];
      default:
        throw new Error('Unknown case');
    }
  };

  const generateSuccessMessage = (direction, qty) => {
    const currentTicketPrice = TicketPrice[direction];
    const tripPrice = currentTicketPrice * qty;
    const directionText = directionSelect.querySelector(`option[value="${direction}"]`).textContent;

    const timePoints = getTimePoints(direction);

    return (`
      <p>Вы выбрали <strong>${qty}</strong> ${getQEndings(qty, 'ticket')} <strong>${directionText}</strong> стоимостью <strong>${tripPrice} руб.</strong></p>
      <p>Это путешествие займет у вас <strong>${getTimeDuration(timePoints).trim()}</strong>.</p>
      <p>Теплоход отправляется в <strong>${timePoints[0].format('H-mm')}</strong>, а прибудет в <strong>${timePoints[1].format('H-mm')}</strong>.</p>
    `);
  };

  const onCalculateBtnClick = () => {
    messageSection.classList.remove('is-hide');
    if (!ticketsQty.value) {
      messageSection.innerHTML = generateWarningMessage();
      return;
    }

    messageSection.innerHTML = generateSuccessMessage(directionSelect.value, ticketsQty.value);
  };

  directDepartureSelect.innerHTML = getSelectOptions(directDepartures);

  renderTripCase(directionSelect.value);

  directionSelect.addEventListener('change', onDirectionSelectChange);
  directDepartureSelect.addEventListener('change', onDirectDepartureSelectChange);
  ticketsQty.addEventListener('change', onTicketsQtyChange);
  calculateBtn.addEventListener('click', onCalculateBtnClick);
};

export {initSchedule};
