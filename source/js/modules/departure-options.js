const COMPENSATION_SHIFT = 2;

const optionLists = document.querySelectorAll('.offer-card__departure-list');

const getNodesSumWidth = (nodes) => Array.from(nodes).reduce((acc, node) => acc + node.offsetWidth, 0);

const initDepartureOptions = () => {
  if (!optionLists.length) {
    return;
  }

  optionLists.forEach((optionList) => {
    const hiddenOptionList = optionList.querySelector('.offer-card__departure-hidden-list');
    const showMoreItem = optionList.querySelector('[data-departure-show-more]');
    const showMoreItemLink = showMoreItem.querySelector('[data-departure-show-more-link]');

    const removeLastOptions = () => {
      let options = optionList.querySelectorAll('.offer-card__departure-item:not([data-departure-show-more])');

      let optionsSumWidth = getNodesSumWidth(options);

      if (optionList.offsetWidth < optionsSumWidth) {
        showMoreItem.classList.remove('is-hide');

        while (optionList.offsetWidth - COMPENSATION_SHIFT - showMoreItem.offsetWidth < optionsSumWidth) {
          options[options.length - 2].classList.remove('offer-card__departure-item');
          options[options.length - 2].classList.add('offer-card__departure-hidden-item');
          hiddenOptionList.append(options[options.length - 2]);

          options = optionList.querySelectorAll('.offer-card__departure-item:not([data-departure-show-more])');

          optionsSumWidth = getNodesSumWidth(options);
        }
      }
    };

    const resetOptions = () => {
      const hiddenOptions = optionList.querySelectorAll('.offer-card__departure-hidden-item');

      hiddenOptions.forEach((hiddenOption) => {
        showMoreItem.classList.add('is-hide');
        hiddenOption.classList.remove('offer-card__departure-hidden-item');
        hiddenOption.classList.add('offer-card__departure-item');

        optionList.append(hiddenOption);
        optionList.append(showMoreItem);
      });
    };

    const onWindowClick = ({target}) => {
      if (!target.closest('[data-departure-show-more]')) {
        window.removeEventListener('click', onWindowClick);

        closeHiddenOptions();
      }
    };

    const openHiddenOptions = () => {
      hiddenOptionList.classList.add('is-shown');

      window.addEventListener('click', onWindowClick);
    };

    const closeHiddenOptions = () => {
      hiddenOptionList.classList.remove('is-shown');
    };

    const onShowMorItemLinkClick = (evt) => {
      evt.preventDefault();

      if (hiddenOptionList.classList.contains('is-shown')) {
        closeHiddenOptions();
      } else {
        openHiddenOptions();
      }
    };

    const onWindowResize = () => {
      resetOptions();
      removeLastOptions();
    };

    resetOptions();
    removeLastOptions();

    showMoreItemLink.addEventListener('click', onShowMorItemLinkClick);
    window.addEventListener('resize', onWindowResize);
  });
};

export {initDepartureOptions};
