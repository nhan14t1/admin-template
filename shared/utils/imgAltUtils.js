export const findImgTags = (html) => {
  var regex = /<img[^>]+src="([^">]+)"[^>]*>/g;
  var matches = html.match(regex);
  return matches || [];
}

export const findImgUrl = (imgTag) => {
  var regex = /<img[^>]+src="([^">]+)"[^>]*>/;

  var matches = regex.exec(imgTag);
  if (matches) {
    return matches[1];
  }

  return '';
}

export const findAltText = (imgTag) => {
  var regex = /<img[^>]+alt="([^">]+)"[^>]*>/;

  var matches = regex.exec(imgTag);
  if (matches) {
    return matches[1];
  }

  return '';
}

export const findUrlAlts = (content) => {
  const imgTags = findImgTags(content);
  const urlAlts = {};
  imgTags.forEach(imgTag => {
    const url = findImgUrl(imgTag);
    const altText = findAltText(imgTag);
    urlAlts[url] = altText;
  });

  return urlAlts;
}

const applyAltText = (content, imgUrl, altText) => {
  let regex = new RegExp('<img[^>]+src="' + imgUrl + '"[^>]*>');
  var match = regex.exec(content);
  if (match) {
    var startIndex = match.index;
    var endIndex = startIndex + match[0].length;

    // Kiểm tra xem thẻ img có thuộc tính alt hay không
    var altRegex = /alt="([^"]*)"/;
    var hasAlt = altRegex.test(match[0]);

    // Nếu thẻ img đã có thuộc tính alt, thực hiện replace
    if (hasAlt) {
      content = content.substring(0, match.index) +
        match[0].replace(altRegex, 'alt="' + altText + '"') +
        content.substring(endIndex);
    } else {
      // Nếu thẻ img chưa có thuộc tính alt, thực hiện insert
      content = content.substring(0, endIndex - 1) +
        ' alt="' + altText + '"' +
        content.substring(endIndex - 1);
    }
  }

  return content;
}

export const applyAllAltText = (content, imgUrlAlts) => {
  const urls = Object.keys(imgUrlAlts);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const altText = imgUrlAlts[url];

    content = applyAltText(content, url, altText);
  }

  return content;
}