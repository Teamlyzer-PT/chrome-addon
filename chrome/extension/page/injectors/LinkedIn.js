import debounce from 'lodash/debounce';
import { Base } from './Base';

const ratingElSelector = {
  jobOfferPage: '.jobs-unified-top-card h1',
  companyPage: '.org-top-card .relative',
  searchPage: '.jobs-details-top-card__company-info',
};
const salaryElSelector = {
  jobOfferPage: '.jobs-unified-top-card > .p5',
  searchPage: '.jobs-details-top-card__actions',
};
const detailsElSelector = {
  jobOfferPage: '.right-rail',
  companyPage: '.scaffold-layout__aside',
};

export class LinkedInInjector extends Base {
  constructor(loader) {
    super(loader);

    const debouncedObserveBoot = debounce(this.observeBoot.bind(this), 100);
    this.bootObserver = new MutationObserver(debouncedObserveBoot);

    const debouncedObserveSearch = debounce(this.observeSearch.bind(this), 1000);
    this.searchObserver = new MutationObserver(debouncedObserveSearch);

    const debouncedObserveSalaryContainer = debounce(this.observeSalaryContainer.bind(this), 1000);
    this.salaryContainerObserver = new MutationObserver(debouncedObserveSalaryContainer);
  }

  observeBoot() {
    if (document.body.classList.contains('boot-complete')) {
      if (
        !this.detailsInjected
        && !this.salaryInjected
        && !this.ratingInjected
      ) {
        this.cleanup();
        this.inject();
      }
    }
  }

  observeSearch() {
    const el = document.querySelector('.jobs-details-top-card__company-url');
    if (!this.injecting && el && this.isCompanyPage(el.pathname)) {
      if (!this.salaryInjected || !this.ratingInjected) {
        this.cleanup();
        this.inject();
      }
    }
  }

  observeSalaryContainer() {
    const el = document.querySelector('.jobs-top-card__flavors');
    if (!this.salaryInjected && el) {
      this.cleanup();
      this.inject();
    }
  }

  startSearchPageObserver() {
    const el = document.querySelector('.jobs-search__right-rail');
    this.searchObserver.observe(el, {
      childList: true,
      subtree: true,
    });
  }

  startBootObserver() {
    this.bootObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  startSalaryContainerObserver() {
    let el = null;
    if (this.isJobOfferPage()) {
      el = document.querySelector(salaryElSelector.jobOfferPage);
    }
    if (el) {
      this.salaryContainerObserver.observe(el, {
        childList: true,
        subtree: true,
      });
    }
  }

  isCompanyPage(path) {
    return /^\/company\/(.*)/.test(path || this.path);
  }

  isJobOfferPage(path) {
    return /^\/jobs\/view\/(.*)/.test(path || this.path);
  }

  isSearchPage(path) {
    return /^\/jobs\/search\/(.*)/.test(path || this.path);
  }

  addToDOM() {
    this.addRatingToDOM();
    if (this.isJobOfferPage()) {
      this.addJobOfferRatingToDOM();
    }
    if (this.isJobOfferPage() || this.isCompanyPage()) {
      this.addDetailsToDOM();
    }
    if (this.isJobOfferPage() || this.isSearchPage()) {
      this.addSalaryAverageToDOM();
    }
  }

  addRatingToDOM() {
    if (this.company.rating && this.company.url) {
      const rating = this.getRatingElement();
      rating.style.marginRight = '8px';
      if (this.isJobOfferPage()) {
        const destinationEl = document.querySelector(ratingElSelector.jobOfferPage);
        if (destinationEl) {
          destinationEl.parentNode.insertBefore(rating, destinationEl.previousSibling);
          rating.style.marginLeft = '8px';
          const logo = document.querySelector('.jobs-unified-top-card > .p5 a');
          logo.style.display = 'inline-block';
          logo.style.verticalAlign = 'middle';
          this.ratingInjected = true;
        }
      } else if (this.isCompanyPage()) {
        const destinationEl = document.querySelector(ratingElSelector.companyPage);
        if (destinationEl) {
          destinationEl.style.position = 'relative';
          rating.style.position = 'absolute';
          rating.style.top = '10px';
          rating.style.left = '144px';
          destinationEl.prepend(rating);
          this.ratingInjected = true;
        }
      } else if (this.isSearchPage()) {
        const destinationEl = document.querySelector(ratingElSelector.searchPage);
        if (destinationEl) {
          destinationEl.prepend(rating);
          this.ratingInjected = true;
        }
      }
    }
  }

  addDetailsToDOM() {
    if (this.company.details) {
      const {
        container,
        heading,
        text,
        content,
        list,
        link,
      } = this.getDetailsElement();

      container.classList.add('mb3');
      container.classList.add('artdeco-card');
      container.classList.add('p0');

      heading.classList.add('p4');
      heading.classList.add('t-20');
      heading.classList.add('t-bold');

      text.firstChild.style.display = 'block';

      list.classList.add('artdeco-list');
      list.classList.add('ph4');

      link.classList.add('artdeco-card__actions');
      link.classList.add('mt3');
      link.classList.add('artdeco-button');
      link.classList.add('artdeco-button--muted');
      link.classList.add('artdeco-button--3');
      link.classList.add('artdeco-button--full');
      link.classList.add('artdeco-button--tertiary');

      container.appendChild(link);

      if (this.isJobOfferPage()) {
        const destinationEl = document.querySelector(detailsElSelector.jobOfferPage);
        if (destinationEl) {
          destinationEl.prepend(container);
          this.detailsInjected = true;
        }
      } else if (this.isCompanyPage()) {
        const sidebar = document.querySelector(detailsElSelector.companyPage);
        if (sidebar) {
          sidebar.prepend(container);
          this.detailsInjected = true;
        }
      }
    }
  }

  addSalaryAverageToDOM() {
    if (this.company.salary) {
      const {
        container,
        title,
        salaryLink,
        averageSalaryContainer,
        range,
      } = this.getSalaryElement();

      const wrapper = document.createElement('div');
      wrapper.appendChild(title);
      wrapper.appendChild(salaryLink);
      wrapper.appendChild(averageSalaryContainer);

      container.classList.add('job-flavors__flavor');
      container.style.lineHeight = '1em';
      container.style.display = 'flex';

      container.appendChild(wrapper);
      container.appendChild(range.container);

      title.classList.add('job-flavors__label');
      title.classList.add('mb1');
      title.style.display = 'block';

      salaryLink.style.display = 'block';
      salaryLink.style.lineHeight = '1em';

      averageSalaryContainer.style.fontSize = '11px';
      averageSalaryContainer.style.lineHeight = '1em';

      range.container.style.marginLeft = '24px';

      if (this.isJobOfferPage()) {
        container.classList.add('mt5');
        const destinationEl = document.querySelector(salaryElSelector.jobOfferPage);
        if (destinationEl) {
          destinationEl.appendChild(container);
          this.salaryInjected = true;
          this.salaryContainerObserver.disconnect();
        } else {
          this.startSalaryContainerObserver();
        }
      } else if (this.isSearchPage()) {
        container.classList.add('mr3');
        container.classList.add('mb4');
        container.style.width = '100%';

        const destinationEl = document.querySelector(salaryElSelector.searchPage);
        if (destinationEl) {
          destinationEl.prepend(container);
          this.salaryInjected = true;
        }
      }
    }
  }

  handleLocationChange() {
    if (
      this.path !== window.location.pathname
      || this.search !== window.location.search
    ) {
      this.searchObserver.disconnect();
      this.path = window.location.pathname;
      this.search = window.location.search;
      this.cleanup();

      if (this.isSearchPage()) {
        this.startSearchPageObserver();
      } else {
        this.inject();
      }
    }
  }

  init() {
    try {
      this.path = window.location.pathname;
      this.search = window.location.search;
      this.interval = setInterval(this.handleLocationChange.bind(this), 500);

      if (this.isSearchPage()) {
        this.startSearchPageObserver();
      }

      if (document.body.classList.contains('boot-complete')) {
        if (this.isSearchPage()) {
          this.startSearchPageObserver();
        } else {
          this.cleanup();
          this.inject();
        }
      } else {
        this.startBootObserver();
      }
    } catch (err) {
      console.log('err: ', err);
    }
  }
}

export default LinkedInInjector;
