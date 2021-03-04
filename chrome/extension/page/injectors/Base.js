import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { teamlyzerUrl, colors } from '../../../../config';

export class Base {
  constructor(loader) {
    this.path = window.location.pathname;
    this.search = window.location.search;
    this.loader = loader;

    this.injecting = false;
    this.ratingInjected = false;
    this.detailsInjected = false;
    this.salaryInjected = false;

    this.company = null;

    this.rating = null;
    this.details = null;
    this.salary = null;
  }

  shouldInjectSalary() {
    if (
      !this.company
      || !this.company.salary
      || !this.company.salary
      || !this.company.salary.salaryCompanyDetails
      || !this.company.salary.salaryCompanyDetails.salaryMin
      || !this.company.salary.salaryCompanyDetails.salaryMax
      || !this.company.salary.salaryCompanyDetails.salaryMedian
    ) {
      return false;
    }
    return true;
  }

  createList(elements) {
    const list = document.createElement('ul');
    list.style.padding = 0;
    list.style.listStyle = 'none';

    elements.forEach((el) => {
      const item = document.createElement('li');
      item.appendChild(el);
      item.style.paddingTop = '4px';
      item.style.paddingBottom = '4px';
      list.appendChild(item);
    });

    return list;
  }

  getRatingColor(value) {
    if (!value) {
      return null;
    }
    const rating = parseFloat(value);
    if (rating < 1.5) {
      return '#FF7800';
    }
    if (rating < 2) {
      return '#FFBA00';
    }
    if (rating < 2.5) {
      return '#EDD614';
    }
    if (rating < 3) {
      return '#9ACD32';
    }
    if (rating < 3.5) {
      return '#5BA829';
    }
    if (rating < 4) {
      return '#3F7E00';
    }
    if (rating < 5) {
      return '#257C00';
    }
    return null;
  }

  getRatingElement() {
    const rating = document.createElement('div');
    rating.style.display = 'inline-block';
    rating.style.backgroundColor = this.getRatingColor(this.company.rating);
    rating.style.textAlign = 'center';
    rating.style.fontSize = '25px';
    rating.style.lineHeight = '1em';
    rating.style.padding = '3px 5px';
    rating.style.fontWeight = 'bold';
    rating.style.borderRadius = '3px';
    rating.style.verticalAlign = 'middle';
    rating.style.color = colors.white;
    rating.innerText = this.company.rating;

    const maxRating = document.createElement('span');
    maxRating.style.fontSize = '16px';
    maxRating.style.fontWeight = 'normal';
    maxRating.style.lineHeight = '1em';
    maxRating.style.opacity = '0.7';
    maxRating.innerText = '/5';

    rating.appendChild(maxRating);

    const link = document.createElement('a');
    link.href = this.company.url;
    link.target = '_blank';
    link.style.display = 'inline-block';
    link.appendChild(rating);

    this.rating = link;

    return this.rating;
  }

  getProgressBar(value) {
    const progress = document.createElement('div');
    progress.style.height = '14px';
    progress.style.backgroundColor = colors.primary;
    progress.style.border = `1px solid ${colors.primary}`;
    progress.style.color = colors.white;
    progress.style.textAlign = 'center';
    progress.style.fontSize = '10px';
    progress.style.lineHeight = '13px';
    progress.style.width = `${value}%`;

    const bar = document.createElement('div');
    bar.style.backgroundColor = colors.primaryFade;
    bar.appendChild(progress);

    return {
      progress,
      bar,
    };
  }

  getProgressElement(text, value) {
    const title = document.createElement('p');
    title.innerText = text;
    title.style.marginTop = 0;
    title.style.marginBottom = '4px';
    title.style.fontSize = '14px';

    const { progress, bar } = this.getProgressBar(value);
    progress.innerText = `${Math.round(value)} / 100`;

    const container = document.createElement('div');

    container.appendChild(title);
    container.appendChild(bar);

    return {
      title,
      bar,
      progress,
      container,
    };
  }

  getDetailsElement() {
    // Create Heading
    const logo = document.createElement('img');
    logo.src = `${teamlyzerUrl}/static/img/teamlyzer_logo_blue.svg`;
    logo.alt = 'Teamlyzer';
    const logoLink = document.createElement('a');
    logoLink.href = this.company.url;
    logoLink.target = '_blank';
    logo.style.display = 'block';
    logoLink.appendChild(logo);
    const text = document.createElement('div');
    text.appendChild(logoLink);
    const heading = document.createElement('div');
    heading.appendChild(text);

    // Create Content
    const content = document.createElement('div');
    // Details
    const workLifeBalance = this.getProgressElement('Equilíbrio trabalho/vida pessoal', this.company.details.workLifeBalance);
    const recognitionAndReward = this.getProgressElement('Reconhecimento e recompensa', this.company.details.recognitionAndReward);
    const salary = this.getProgressElement('Salário', this.company.details.salary);
    const managementQuality = this.getProgressElement('Qualidade de gestão', this.company.details.managementQuality);
    const careerOpportunity = this.getProgressElement('Oportunidades de carreira', this.company.details.careerOpportunity);
    const interviewDifficulty = this.getProgressElement('Dificuldade das entrevistas', this.company.details.interviewDifficulty);

    // Create List
    const list = this.createList([
      workLifeBalance.container,
      recognitionAndReward.container,
      salary.container,
      managementQuality.container,
      careerOpportunity.container,
      interviewDifficulty.container,
    ]);
    content.appendChild(list);

    const breakEl = document.createElement('li');
    breakEl.setAttribute('role', 'separator');
    breakEl.style.marginTop = '16px';
    breakEl.style.marginBottom = '14px';
    breakEl.style.borderTop = '1px solid rgba(0, 0, 0, 0.15)';
    list.insertBefore(breakEl, list.children[5]);

    // Add Link
    const link = document.createElement('a');
    link.href = this.company.url;
    link.target = '_blank';
    link.title = 'Abrir empresa no Teamlyzer';
    link.innerText = 'Abrir empresa no Teamlyzer';

    content.appendChild(link);

    // Create Block
    const container = document.createElement('div');
    container.appendChild(heading);
    container.appendChild(content);

    this.details = {
      text,
      logo,
      logoLink,
      heading,
      content,
      list,
      link,
      container,
    };

    return this.details;
  }

  getSalaryString(value) {
    const number = parseFloat(value);
    return number.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  getSalaryRange() {
    if (!this.shouldInjectSalary()) {
      return null;
    }

    const minLabel = document.createElement('span');
    minLabel.innerText = 'min';
    minLabel.style.fontSize = '10px';
    minLabel.style.lineHeight = 1;
    const maxLabel = document.createElement('span');
    maxLabel.style.fontSize = '10px';
    maxLabel.innerText = 'max';
    maxLabel.style.lineHeight = 1;

    const minValue = document.createElement('span');
    minValue.innerText = this.getSalaryString(this.company.salary.salaryCompanyDetails.salaryMin);
    minValue.style.fontSize = '12px';
    const maxValue = document.createElement('span');
    maxValue.style.fontSize = '12px';
    maxValue.innerText = this.getSalaryString(this.company.salary.salaryCompanyDetails.salaryMax);

    const labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.justifyContent = 'space-between';
    labelContainer.style.marginBottom = '2px';
    labelContainer.appendChild(minLabel);
    labelContainer.appendChild(maxLabel);

    const valueContainer = document.createElement('div');
    valueContainer.style.display = 'flex';
    valueContainer.style.justifyContent = 'space-between';
    valueContainer.style.marginTop = '8px';
    valueContainer.appendChild(minValue);
    valueContainer.appendChild(maxValue);

    const container = document.createElement('a');
    container.href = `${this.company.url}/salary-reviews`;
    container.target = '_blank';
    container.style.color = 'inherit';
    container.style.display = 'block';
    container.style.width = '200px';

    const medianPercentage = (
      (
        this.company.salary.salaryCompanyDetails.salaryMedian
        - this.company.salary.salaryCompanyDetails.salaryMin
      ) / (
        this.company.salary.salaryCompanyDetails.salaryMax
        - this.company.salary.salaryCompanyDetails.salaryMin
      )) * 100;
    const { progress, bar } = this.getProgressBar(medianPercentage);

    const line = document.createElement('div');
    line.style.width = '2px';
    line.style.height = '24px';
    line.style.position = 'absolute';
    line.style.left = `${medianPercentage}%`;
    line.style.top = '100%';
    line.style.backgroundColor = colors.primaryFade;

    bar.style.position = 'relative';
    bar.appendChild(line);

    const medianValue = this.getSalaryString(this.company.salary.salaryCompanyDetails.salaryMedian);
    tippy(bar, {
      content: `Mediana ${medianValue}`,
    });

    container.appendChild(labelContainer);
    container.appendChild(bar);
    container.appendChild(valueContainer);

    this.salaryRange = {
      progress,
      bar,
      minLabel,
      maxLabel,
      labelContainer,
      container,
    };

    return this.salaryRange;
  }

  getSalaryElement() {
    const hasData = this.company.salary.avgJobSalary.salaryMaxAvg
      && this.company.salary.avgJobSalary.salaryMinAvg;
    // Title
    const title = document.createElement('span');
    title.innerText = 'Salário previsto';

    // Salary
    const salary = document.createElement('span');
    let arrow = null;
    if (hasData) {
      // Salary difference arrow
      arrow = document.createElement('i');
      arrow.style.marginLeft = '4px';

      if (
        this.company.salary.avgJobSalary.salaryMaxAvg < this.company.salary.avgJobSalaryIndustry.salaryMaxAvg
      ) {
        arrow.style.color = colors.red;
        arrow.innerHTML = '&darr;';
      } else {
        arrow.style.color = colors.green;
        arrow.innerHTML = '&uarr;';
      }

      // Average salary
      const minValue = this.getSalaryString(this.company.salary.avgJobSalary.salaryMinAvg);
      const maxValue = this.getSalaryString(this.company.salary.avgJobSalary.salaryMaxAvg);
      const minSalary = document.createElement('span');
      minSalary.innerText = minValue;
      const maxSalary = document.createElement('span');
      maxSalary.innerText = maxValue;

      salary.innerText = ' - ';
      salary.prepend(minSalary);
      salary.appendChild(maxSalary);
      salary.appendChild(arrow);
    } else {
      salary.innerHTML = 'Ainda sem dados';
    }

    const salaryLink = document.createElement('a');
    salaryLink.href = `${this.company.url}/salary-reviews`;
    salaryLink.target = '_blank';
    salaryLink.style.color = colors.primary;
    salaryLink.appendChild(salary);

    // Market average salary
    const averageMin = this.getSalaryString(this.company.salary.avgJobSalaryIndustry.salaryMinAvg);
    const averageMax = this.getSalaryString(this.company.salary.avgJobSalaryIndustry.salaryMaxAvg);
    const averageMinSalary = document.createElement('span');
    averageMinSalary.innerText = averageMin;
    const averageMaxSalary = document.createElement('span');
    averageMaxSalary.innerText = averageMax;

    const averageSalaryLink = document.createElement('a');
    averageSalaryLink.href = `${teamlyzerUrl}/companies/industries/${this.company.industrySlug}`;
    averageSalaryLink.target = '_blank';
    averageSalaryLink.innerText = ' - ';
    averageSalaryLink.style.color = colors.primary;
    averageSalaryLink.prepend(averageMinSalary);
    averageSalaryLink.appendChild(averageMaxSalary);

    const averageSalaryContainer = document.createElement('span');
    averageSalaryContainer.innerText = 'Média da indústria ';
    averageSalaryContainer.appendChild(averageSalaryLink);

    // Container
    const container = document.createElement('div');
    container.style.lineHeight = '1em';
    container.appendChild(title);
    container.appendChild(salaryLink);
    container.appendChild(averageSalaryContainer);

    const range = this.getSalaryRange();

    this.salary = {
      title,
      salary,
      salaryLink,
      arrow,
      container,
      averageSalaryLink,
      averageSalaryContainer,
      range,
    };

    return this.salary;
  }

  isCompanyPage() {
    console.warn('Method isCompanyPage not implemented');
  }

  isJobOfferPage() {
    console.warn('Method isJobOfferPage not implemented');
  }

  addRatingToDOM() {
    console.warn('Method addRatingToDOM not implemented');
  }

  addDetailsToDOM() {
    console.warn('Method addDetailsToDOM not implemented');
  }

  addJobOfferRatingToDOM() {
    console.warn('Method addJobOfferRatingToDOM not implemented');
  }

  addSalaryAverageToDOM() {
    console.warn('Method addSalaryAverageToDOM not implemented');
  }

  addToDOM() {
    this.addRatingToDOM();
    this.addDetailsToDOM();
    if (this.isJobOfferPage()) {
      this.addJobOfferRatingToDOM();
      this.addSalaryAverageToDOM();
    }
  }

  cleanup() {
    this.injecting = false;
    this.ratingInjected = false;
    this.detailsInjected = false;
    this.salaryInjected = false;
    this.company = null;
    if (this.rating) {
      this.rating.remove();
    }
    if (this.details) {
      this.details.container.remove();
    }
    if (this.salary) {
      this.salary.container.remove();
    }
  }

  async loadData() {
    const company = this.loader.loadData();
    const result = await this.loader.getCompanyData({
      slug: company.slug,
    });

    return {
      slug: company.slug,
      ...result,
    };
  }

  async inject() {
    try {
      this.injecting = true;

      this.company = await this.loadData();
      this.addToDOM();
      this.injecting = false;
    } catch (err) {
      this.injecting = false;
      console.log('err: ', err);
    }
  }

  init() {
    console.warn('Method init not implemented');
  }
}

export default Base;
