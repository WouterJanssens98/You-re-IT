import Handlebars from 'handlebars';

export default (page, imgSource, imgAlt, imgClass = '', cssClass = '') => {
  const escapedPage = Handlebars.escapeExpression(page);
  const escapedImgSource = Handlebars.escapeExpression(imgSource);
  const escapedImgAlt = Handlebars.escapeExpression(imgAlt);
  const escapedImgClass = !imgClass || typeof imgClass !== 'string' ? '' : Handlebars.escapeExpression(imgClass);
  const escapedCssClass = !cssClass || typeof cssClass !== 'string' ? '' : Handlebars.escapeExpression(cssClass);
  return imgSource !== '' ? new Handlebars.SafeString(`
    <a href="/${escapedPage}" ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''} data-navigo>
      <img src="${escapedImgSource}" alt="${escapedImgAlt}" ${escapedImgClass !== '' ? `class="${escapedImgClass}"` : ''}>
    </a>`) : '';
};
