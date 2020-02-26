import { teamlyzerUrl } from '../../../../config';
import { getCompanyInfo } from '../data/company';
// import teamlyzerLogo from '../../../assets/img/teamlyzer_logo.svg';

export class Base {
  constructor(loader) {
    this.path = window.location.pathname;

    this.company = loader.loadData();
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
    rating.style.padding = '2px 5px';
    rating.style.fontWeight = 'bold';
    rating.style.borderRadius = '3px';
    rating.style.color = '#FFF';
    rating.innerText = this.company.rating;

    const maxRating = document.createElement('span');
    maxRating.style.fontSize = '16px';
    maxRating.style.fontWeight = 'normal';
    maxRating.style.opacity = '0.7';
    maxRating.innerText = '/5';

    rating.appendChild(maxRating);

    const link = document.createElement('a');
    link.href = this.company.url;
    link.target = '_blank';
    link.appendChild(rating);

    return link;
  }

  getProgressElement(text, value) {
    const title = document.createElement('p');
    title.innerText = text;
    title.style.marginTop = 0;
    title.style.marginBottom = '4px';
    title.style.fontSize = '14px';

    const progress = document.createElement('div');
    progress.style.height = '14px';
    progress.style.transition = 'width .6s ease';
    progress.style.backgroundColor = '#13231b';
    progress.style.color = '#59b287';
    progress.style.border = '1px solid #59b287';
    progress.style.textAlign = 'center';
    progress.style.width = `${value}%`;
    progress.style.fontSize = '10px';
    progress.style.lineHeight = '14px';
    progress.innerText = `${Math.round(value)} / 100`;

    const bar = document.createElement('div');
    bar.style.backgroundColor = '#13231b';
    bar.appendChild(progress);

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

  getDetailsElement() {
    // Create Heading
    const logo = document.createElement('img');
    logo.src = `${teamlyzerUrl}/static/img/teamlyzer_logo.svg`;
    logo.alt = 'Teamlyzer';
    const text = document.createElement('div');
    text.appendChild(logo);
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
    breakEl.style.borderTop = '1px solid hsla(0,0%,96.1%,.1)';
    list.insertBefore(breakEl, list.children[5]);

    // Add Link
    const link = document.createElement('a');
    link.href = this.company.url;
    link.title = 'Abrir empresa no Teamlyzer';
    link.innerText = 'Abrir empresa no Teamlyzer';

    content.appendChild(link);

    // Create Block
    const container = document.createElement('div');
    container.appendChild(heading);
    container.appendChild(content);

    return {
      text,
      heading,
      content,
      list,
      link,
      container,
    };
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

  addToDOM() {
    this.addRatingToDOM();
    this.addDetailsToDOM();
    if (this.isJobOfferPage()) {
      this.addJobOfferRatingToDOM();
    }
  }

  async init() {
    const result = await getCompanyInfo({
      slug: this.company.slug,
    });

    this.company = {
      ...this.company,
      ...result,
    };

    this.addToDOM();
  }
}

export default Base;
